<?php

namespace App\Http\Controllers;

use App\Jobs\GenerateLearningResourceSummary;
use App\Models\LearningResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class LearningResourceController extends Controller
{
    public function index()
    {
        $resources = LearningResource::query()
            ->with([
                'reviews' => function ($query) {
                    $query->with('user:id,name')->latest();
                },
            ])
            ->withAvg('reviews', 'rating')
            ->latest()
            ->get();

        return response()->json($resources);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:youtube,textbook',
            'identifier' => 'required|string',
            'title' => 'nullable|string|max:255',
        ]);

        $existingResource = LearningResource::query()
            ->where('type', $validated['type'])
            ->where('identifier', $validated['identifier'])
            ->first();

        if ($existingResource) {
            return response()->json($existingResource, 200);
        }

        if ($validated['type'] === 'textbook') {
            $isbn = $validated['identifier'];

            $response = Http::timeout(10)->get(
                "https://openlibrary.org/api/books?bibkeys=ISBN:{$isbn}&format=json&jscmd=data"
            );

            if ($response->successful() && !empty($response->json())) {
                $bookData = $response->json()["ISBN:{$isbn}"] ?? null;

                if ($bookData) {
                    $validated['title'] = $bookData['title'] ?? $validated['title'] ?? 'Unknown Title';
                    $validated['author'] = $bookData['authors'][0]['name'] ?? 'Unknown Author';
                    $validated['cover_image_url'] = $bookData['cover']['large']
                        ?? $bookData['cover']['medium']
                        ?? null;
                }
            }
        }

        $resource = LearningResource::create($validated);

        return response()->json($resource, 201);
    }

    public function show($id)
    {
        $resource = LearningResource::query()
            ->with([
                'reviews' => function ($query) {
                    $query->with('user:id,name')->latest();
                },
            ])
            ->withAvg('reviews', 'rating')
            ->findOrFail($id);

        return response()->json($resource);
    }

    public function summarize($id)
    {
        $resource = LearningResource::query()
            ->withCount('reviews')
            ->findOrFail($id);

        if ($resource->reviews_count === 0) {
            return response()->json([
                'message' => 'This book has no user reviews yet, so there is nothing to summarize.',
            ], 422);
        }

        GenerateLearningResourceSummary::dispatch($resource->id);

        return response()->json([
            'message' => 'Summary generation started.',
        ]);
    }
}