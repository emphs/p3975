<?php

namespace App\Services;

use App\Models\LearningResource;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Throwable;

class GitHubModelsReviewSummaryService
{
    public function summarize(LearningResource $resource): array
    {
        $reviews = $resource->reviews()
            ->with('user:id,name')
            ->latest()
            ->take(50)
            ->get(['id', 'learning_resource_id', 'user_id', 'rating', 'content', 'created_at']);

        if ($reviews->isEmpty()) {
            return [
                'raw' => null,
                'text' => 'No reviews yet.',
                'review_count' => 0,
                'average_rating' => 0,
            ];
        }

        $normalized = $reviews->map(function ($review) {
            return [
                'author' => $review->user?->name ?? 'Anonymous',
                'rating' => (int) $review->rating,
                'content' => (string) $review->content,
            ];
        });

        return $this->summarizeReviewCollection(
            title: (string) ($resource->title ?? 'Learning resource'),
            reviews: $normalized
        );
    }

    public function summarizePreview(string $title, array $reviews): array
    {
        $collection = collect($reviews)
            ->filter(fn ($review) => is_array($review))
            ->map(function (array $review) {
                return [
                    'author' => (string) ($review['author'] ?? 'Anonymous'),
                    'rating' => (int) ($review['rating'] ?? 0),
                    'content' => (string) ($review['content'] ?? ''),
                ];
            })
            ->filter(fn (array $review) => $review['rating'] >= 1 && $review['rating'] <= 5 && filled($review['content']))
            ->values();

        if ($collection->isEmpty()) {
            return [
                'raw' => null,
                'text' => 'No reviews yet.',
                'review_count' => 0,
                'average_rating' => 0,
            ];
        }

        return $this->summarizeReviewCollection(
            title: $title !== '' ? $title : 'Learning resource',
            reviews: $collection
        );
    }

    protected function summarizeReviewCollection(string $title, Collection $reviews): array
    {
        $averageRating = round((float) $reviews->avg('rating'), 2);

        try {
            return $this->summarizeWithGitHubModels($title, $reviews, $averageRating);
        } catch (Throwable $exception) {
            return [
                'raw' => [
                    'fallback' => true,
                    'reason' => $exception->getMessage(),
                ],
                'text' => $this->buildFallbackSummary($title, $reviews, $averageRating),
                'review_count' => $reviews->count(),
                'average_rating' => $averageRating,
            ];
        }
    }

    protected function summarizeWithGitHubModels(string $title, Collection $reviews, float $averageRating): array
    {
        $token = config('services.github_models.token');

        if (blank($token)) {
            throw new \RuntimeException('GITHUB_MODELS_TOKEN is not configured.');
        }

        $reviewLines = $reviews
            ->map(function (array $review, int $index) {
                $author = $review['author'] !== '' ? $review['author'] : 'Anonymous';
                $content = str($review['content'])
                    ->squish()
                    ->limit(500, '...');

                return sprintf(
                    "%d. %s | %d/5 | %s",
                    $index + 1,
                    $author,
                    (int) $review['rating'],
                    $content,
                );
            })
            ->implode("\n");

        $payload = [
            'model' => config('services.github_models.model', 'openai/gpt-4.1'),
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'You summarize review sentiment for learning materials. Be accurate, balanced, concise, and grounded only in the supplied reviews. Never invent facts.',
                ],
                [
                    'role' => 'developer',
                    'content' => 'Return valid JSON only. Write a short Amazon-style review summary that mentions positives, negatives, and who this resource seems best for.',
                ],
                [
                    'role' => 'user',
                    'content' => "Learning resource:\n"
                        . "Title: {$title}\n\n"
                        . "Review count: {$reviews->count()}\n"
                        . "Average rating: {$averageRating}/5\n\n"
                        . "Reviews:\n{$reviewLines}",
                ],
            ],
            'temperature' => (float) config('services.github_models.temperature', 0.2),
            'max_tokens' => (int) config('services.github_models.max_tokens', 350),
            'response_format' => [
                'type' => 'json_schema',
                'json_schema' => [
                    'name' => 'learning_resource_review_summary',
                    'schema' => [
                        'type' => 'object',
                        'properties' => [
                            'overall_sentiment' => [
                                'type' => 'string',
                            ],
                            'summary' => [
                                'type' => 'string',
                            ],
                            'best_for' => [
                                'type' => 'string',
                            ],
                            'strengths' => [
                                'type' => 'array',
                                'items' => ['type' => 'string'],
                            ],
                            'weaknesses' => [
                                'type' => 'array',
                                'items' => ['type' => 'string'],
                            ],
                        ],
                        'required' => ['overall_sentiment', 'summary', 'best_for', 'strengths', 'weaknesses'],
                        'additionalProperties' => false,
                    ],
                    'strict' => true,
                ],
            ],
        ];

        $request = Http::baseUrl(rtrim(config('services.github_models.endpoint', 'https://models.github.ai'), '/'))
            ->acceptJson()
            ->withToken($token)
            ->withHeaders([
                'Content-Type' => 'application/json',
                'X-GitHub-Api-Version' => config('services.github_models.api_version', '2026-03-10'),
            ])
            ->timeout(45)
            ->retry(1, 500);

        if (app()->environment('local')) {
            $request = $request->withoutVerifying();
        }

        $response = $request
            ->post('/inference/chat/completions', $payload)
            ->throw();

        $content = Arr::get($response->json(), 'choices.0.message.content');

        if (is_array($content)) {
            $content = collect($content)
                ->map(fn (array $part) => $part['text'] ?? '')
                ->implode('');
        }

        if (! is_string($content) || blank($content)) {
            throw new \RuntimeException('GitHub Models returned an empty summary payload.');
        }

        $decoded = json_decode($content, true, flags: JSON_THROW_ON_ERROR);

        return [
            'raw' => $decoded,
            'text' => $this->formatSummaryText($decoded),
            'review_count' => $reviews->count(),
            'average_rating' => $averageRating,
        ];
    }

    protected function buildFallbackSummary(string $title, Collection $reviews, float $averageRating): string
    {
        $count = $reviews->count();

        $positiveCount = $reviews->filter(fn (array $review) => $review['rating'] >= 4)->count();
        $negativeCount = $reviews->filter(fn (array $review) => $review['rating'] <= 2)->count();

        $sentiment = match (true) {
            $averageRating >= 4.5 => 'Very Positive',
            $averageRating >= 3.8 => 'Positive',
            $averageRating >= 2.8 => 'Mixed',
            $averageRating >= 2.0 => 'Negative',
            default => 'Very Negative',
        };

        $strengthKeywords = [
            'clear', 'easy', 'helpful', 'good', 'great', 'structured', 'organized',
            'examples', 'simple', 'useful', 'beginner', 'detailed'
        ];

        $weaknessKeywords = [
            'confusing', 'hard', 'boring', 'rushed', 'dense', 'slow', 'vague',
            'unclear', 'bad', 'weak', 'difficult'
        ];

        $strengths = [];
        $weaknesses = [];

        foreach ($reviews as $review) {
            $text = strtolower($review['content']);

            foreach ($strengthKeywords as $word) {
                if (str_contains($text, $word)) {
                    $strengths[$word] = ($strengths[$word] ?? 0) + 1;
                }
            }

            foreach ($weaknessKeywords as $word) {
                if (str_contains($text, $word)) {
                    $weaknesses[$word] = ($weaknesses[$word] ?? 0) + 1;
                }
            }
        }

        arsort($strengths);
        arsort($weaknesses);

        $topStrengths = array_slice(array_keys($strengths), 0, 3);
        $topWeaknesses = array_slice(array_keys($weaknesses), 0, 3);

        $strengthLine = count($topStrengths) > 0
            ? 'Readers most often praise it for being ' . implode(', ', $topStrengths) . '.'
            : 'Readers generally praise the overall usefulness of the resource.';

        $weaknessLine = count($topWeaknesses) > 0
            ? 'Common complaints mention it can feel ' . implode(', ', $topWeaknesses) . '.'
            : 'There are fewer repeated complaints, but some readers still had mixed experiences.';

        $bestFor = match (true) {
            $averageRating >= 4.0 => 'Best for learners who want a dependable and approachable resource.',
            $averageRating >= 3.0 => 'Best for learners who are okay using this alongside other materials.',
            default => 'Best for learners who want to sample it first before relying on it heavily.',
        };

        return "Overall sentiment: {$sentiment}\n\n"
            . "\"{$title}\" currently has {$count} displayed review(s) with an average rating of {$averageRating}/5. "
            . ($positiveCount >= $negativeCount
                ? 'Most readers lean positive overall.'
                : 'Reader opinion is more mixed or negative overall.')
            . "\n\n"
            . $strengthLine . "\n\n"
            . $weaknessLine . "\n\n"
            . $bestFor;
    }

    public function formatSummaryText(array $summary): string
    {
        $strengths = collect($summary['strengths'] ?? [])
            ->filter()
            ->map(fn (string $item) => '• ' . $item)
            ->implode("\n");

        $weaknesses = collect($summary['weaknesses'] ?? [])
            ->filter()
            ->map(fn (string $item) => '• ' . $item)
            ->implode("\n");

        return trim(implode("\n\n", array_filter([
            'Overall sentiment: ' . str((string) ($summary['overall_sentiment'] ?? 'mixed'))->replace('_', ' ')->title(),
            $summary['summary'] ?? null,
            isset($summary['best_for']) ? 'Best for: ' . $summary['best_for'] : null,
            $strengths !== '' ? "Strengths:\n{$strengths}" : null,
            $weaknesses !== '' ? "Weaknesses:\n{$weaknesses}" : null,
        ])));
    }
} 