<?php

namespace App\Http\Controllers;

use App\Models\Like;
use App\Models\Review;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class LikeController extends Controller
{
    #[OA\Post(
        path: "/api/reviews/{review_id}/like",
        summary: "Toggle a like on a review",
        tags: ["Likes"],
        security: [["sanctum" => []]]
    )]
    #[OA\Parameter(name: "review_id", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\Response(response: 200, description: "Like toggled successfully")]
    public function toggle(Request $request, $review_id)
    {
        // 1. Ensure the review actually exists
        $review = Review::findOrFail($review_id);
        $userId = $request->user()->id;

        // 2. Check if the user already liked this specific review
        $existingLike = Like::where('review_id', $review_id)
                            ->where('user_id', $userId)
                            ->first();

        // 3. If it exists, delete it (unlike). If not, create it (like).
        if ($existingLike) {
            $existingLike->delete();
            return response()->json(['message' => 'Review unliked'], 200);
        }

        Like::create([
            'review_id' => $review_id,
            'user_id' => $userId,
        ]);

        return response()->json(['message' => 'Review liked'], 201);
    }
}
