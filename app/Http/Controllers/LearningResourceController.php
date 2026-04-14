<?php

namespace App\Http\Controllers;

use App\Models\LearningResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use OpenApi\Attributes as OA;

class LearningResourceController extends Controller
{
    #[OA\Get(
        path: '/api/resources',
        summary: 'Get list of all learning resources',
        tags: ['Resources']
    )]
    #[OA\Response(
        response: 200,
        description: 'Successful operation',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(
                properties: [
                    new OA\Property(property: 'id', type: 'integer', example: 1),
                    new OA\Property(property: 'title', type: 'string', example: 'Advanced Calculus Video'),
                    new OA\Property(property: 'reviews_avg_rating', type: 'number', format: 'float', example: 4.5),
                    new OA\Property(property: 'ai_summary', type: 'string', example: 'Most users found this highly comprehensive.')
                ]
            )
        )
    )]
    public function index()
    {
        $resources = LearningResource::with(['reviews' => function ($query) {
            $query->withCount('likes')->orderByDesc('likes_count');
        }])
                                     ->withAvg('reviews', 'rating')
                                     ->get();

        return response()->json($resources);
    }

    #[OA\Post(
        path: '/api/resources',
        summary: 'Submit a new learning resource (YouTube or Textbook ISBN)',
        security: [['sanctum' => []]],
        tags: ['Resources']
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ['type', 'identifier'],
            properties: [
                new OA\Property(property: 'type', type: 'string', example: 'textbook', description: "Must be 'youtube' or 'textbook'"),
                new OA\Property(property: 'identifier', type: 'string', example: '0201896834', description: "YouTube URL or Textbook ISBN"),
                new OA\Property(property: 'title', type: 'string', example: 'Optional manual title for YouTube videos')
            ]
        )
    )]
    #[OA\Response(response: 200, description: 'Resource retrieved or created successfully')]
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:youtube,textbook',
            'identifier' => 'required|string',
            'title' => 'required_if:type,youtube|string|max:255', // Title is only required if it's a YouTube video
        ]);

        // 1. Check if we already have this exact resource saved to prevent duplicates
        $existingResource = LearningResource::where('identifier', $validated['identifier'])->first();
        if ($existingResource) {
            return response()->json($existingResource, 200);
        }

        // 2. If it is a textbook, fetch the missing data from the Open Library API
        if ($validated['type'] === 'textbook') {
            $isbn = $validated['identifier'];

            // Call the external API
            $response = Http::get("https://openlibrary.org/api/books?bibkeys=ISBN:{$isbn}&format=json&jscmd=data");

            if ($response->successful() && !empty($response->json())) {
                $bookData = $response->json()["ISBN:{$isbn}"];

                // Extract the data we want
                $validated['title'] = $bookData['title'] ?? 'Unknown Title';
                $validated['author'] = $bookData['authors'][0]['name'] ?? 'Unknown Author';
                $validated['cover_image_url'] = $bookData['cover']['large'] ?? null;
            } else {
                return response()->json(['message' => 'Could not find a textbook with that ISBN.'], 404);
            }
        }

        // 3. Save the new resource (either the YouTube link or the newly fetched Textbook data)
        $resource = LearningResource::create($validated);

        return response()->json($resource, 201);
    }
    #[OA\Get(
        path: '/api/resources/{id}',
        summary: 'Get a specific learning resource',
        tags: ['Resources']
    )]
    #[OA\Parameter(
        name: 'id',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'integer')
    )]
    #[OA\Response(response: 200, description: 'Successful operation')]
    public function show($id)
    {
        $resource = LearningResource::with(['reviews' => function ($query) {
            $query->withCount('likes')->orderByDesc('likes_count');
        }])
                                    ->withAvg('reviews', 'rating')
                                    ->findOrFail($id);

        return response()->json($resource);
    }
}
