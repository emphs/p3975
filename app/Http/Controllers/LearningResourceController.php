<?php

namespace App\Http\Controllers;

use App\Models\LearningResource;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class LearningResourceController extends Controller
{
    #[OA\Get(
        path: "/api/resources",
        summary: "Get list of all learning resources",
        tags: ["Resources"]
    )]
    #[OA\Response(
        response: 200,
        description: "Successful operation",
        content: new OA\JsonContent(
            type: "array",
            items: new OA\Items(
                properties: [
                    new OA\Property(property: "id", type: "integer", example: 1),
                    new OA\Property(property: "title", type: "string", example: "Advanced Calculus Video"),
                    new OA\Property(property: "ai_summary", type: "string", example: "Most users found this highly comprehensive.")
                ]
            )
        )
    )]
    public function index()
    {
        // Returns all resources with their reviews attached
        return response()->json(LearningResource::with('reviews')->get());
    }

    #[OA\Post(
        path: "/api/resources",
        summary: "Submit a new learning resource",
        tags: ["Resources"],
        security: [["sanctum" => []]]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["title", "url_or_isbn"],
            properties: [
                new OA\Property(property: "title", type: "string", example: "Intro to React"),
                new OA\Property(property: "url_or_isbn", type: "string", example: "https://youtube.com/watch?v=123")
            ]
        )
    )]
    #[OA\Response(response: 201, description: "Resource created successfully")]
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'url_or_isbn' => 'required|string|max:255',
        ]);

        $resource = LearningResource::create($validated);

        return response()->json($resource, 201);
    }
}
