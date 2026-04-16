<?php

namespace App\Jobs;

use App\Models\LearningResource;
use App\Services\GitHubModelsReviewSummaryService;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Throwable;

class GenerateLearningResourceSummary implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $uniqueFor = 300;

    public function __construct(public int $resourceId)
    {
    }

    public function uniqueId(): string
    {
        return 'learning-resource-summary-' . $this->resourceId;
    }

    public function handle(GitHubModelsReviewSummaryService $summaryService): void
    {
        $resource = LearningResource::find($this->resourceId);

        if (! $resource || ! $resource->needsAiSummaryRefresh()) {
            return;
        }

        try {
            $summary = $summaryService->summarize($resource);

            $resource->forceFill([
                'ai_summary' => $summary['text'],
                'ai_summary_review_count' => $summary['review_count'],
                'ai_summary_generated_at' => now(),
            ])->save();
        } catch (Throwable $exception) {
            Log::error('Failed to generate AI summary for learning resource.', [
                'learning_resource_id' => $this->resourceId,
                'message' => $exception->getMessage(),
            ]);

            throw $exception;
        }
    }
}