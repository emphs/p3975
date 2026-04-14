<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class ReportController extends Controller
{
    #[OA\Post(
        path: "/api/reports",
        summary: "Report a resource or review to admins",
        tags: ["Reports"],
        security: [["sanctum" => []]]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["reason"],
            properties: [
                new OA\Property(property: "learning_resource_id", type: "integer", nullable: true),
                new OA\Property(property: "review_id", type: "integer", nullable: true),
                new OA\Property(property: "reason", type: "string", example: "Invalid YouTube link")
            ]
        )
    )]
    #[OA\Response(response: 201, description: "Report submitted successfully")]
    public function store(Request $request)
    {
        $validated = $request->validate([
            'learning_resource_id' => 'nullable|exists:learning_resources,id',
            'review_id' => 'nullable|exists:reviews,id',
            'reason' => 'required|string|max:255',
        ]);

        // Prevent empty reports
        if (empty($validated['learning_resource_id']) && empty($validated['review_id'])) {
            return response()->json(['message' => 'Must report either a resource or a review.'], 422);
        }

        $validated['user_id'] = $request->user()->id;

        $report = Report::create($validated);

        return response()->json($report, 201);
    }
}
