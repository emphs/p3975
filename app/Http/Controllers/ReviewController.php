<?php

namespace App\Http\Controllers;

use App\Jobs\GenerateLearningResourceSummary;
use App\Models\LearningResource;
use App\Models\Review;
use App\Services\GitHubModelsReviewSummaryService;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ReviewController extends Controller
{
    #[OA\Post(
        path: "/api/reviews",
        summary: "Leave a review on a learning resource",
        tags: ["Reviews"],
        security: [["sanctum" => []]]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["learning_resource_id", "rating", "content"],
            properties: [
                new OA\Property(property: "learning_resource_id", type: "integer", example: 1),
                new OA\Property(property: "rating", type: "integer", example: 4),
                new OA\Property(property: "content", type: "string", example: "Great explanation of integrals!")
            ]
        )
    )]
    #[OA\Response(response: 201, description: "Review saved successfully")]
    public function store(Request $request)
    {
        $validated = $request->validate([
            'learning_resource_id' => 'required|exists:learning_resources,id',
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'required|string|max:1000',
        ]);

        $validated['user_id'] = $request->user()->id;

        $review = Review::create($validated);

        $resource = LearningResource::find($validated['learning_resource_id']);

        if ($resource && $resource->needsAiSummaryRefresh()) {
            GenerateLearningResourceSummary::dispatch($resource->id);
        }

        return response()->json(
            $review->load('user:id,name'),
            201
        );
    }

    public function previewSummary(Request $request, GitHubModelsReviewSummaryService $summaryService)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'reviews' => 'required|array|min:1|max:10',
            'reviews.*.author' => 'required|string|max:100',
            'reviews.*.rating' => 'required|integer|min:1|max:5',
            'reviews.*.content' => 'required|string|max:1000',
        ]);

        $summary = $summaryService->summarizePreview(
            $validated['title'],
            $validated['reviews']
        );

        return response()->json([
            'summary' => $summary['text'],
        ]);
    }
}