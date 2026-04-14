<?php

namespace App\Http\Controllers;

use App\Models\Review;
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
                new OA\Property(property: "rating", type: "integer", example: 4, description: "Must be between 1 and 5"),
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
            'content' => 'required|string',
        ]);

        // Grabs the authenticated user's ID
        $validated['user_id'] = $request->user()->id;

        $review = Review::create($validated);

        return response()->json($review, 201);
    }
}
