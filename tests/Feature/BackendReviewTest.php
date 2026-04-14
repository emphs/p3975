<?php

namespace Tests\Feature;

use App\Models\LearningResource;
use App\Models\Like;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class BackendReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_get_resources_with_avg_rating_and_sorted_reviews()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $user3 = User::factory()->create();

        $resource = LearningResource::create([
            'type' => 'youtube',
            'identifier' => 'https://youtube.com/watch?v=123',
            'title' => 'Test Video'
        ]);

        $review1 = Review::create([
            'learning_resource_id' => $resource->id,
            'user_id' => $user1->id,
            'rating' => 4,
            'content' => 'Review with 1 like'
        ]);

        $review2 = Review::create([
            'learning_resource_id' => $resource->id,
            'user_id' => $user2->id,
            'rating' => 5,
            'content' => 'Review with 2 likes'
        ]);

        Like::create(['review_id' => $review2->id, 'user_id' => $user1->id]);
        Like::create(['review_id' => $review2->id, 'user_id' => $user2->id]);
        Like::create(['review_id' => $review1->id, 'user_id' => $user3->id]);

        $response = $this->getJson('/api/resources');

        $response->assertStatus(200);
        $response->assertJsonFragment(['reviews_avg_rating' => 4.5]);

        $data = $response->json();
        $this->assertCount(1, $data);
        $reviews = $data[0]['reviews'];
        $this->assertCount(2, $reviews);

        // Ensure review with 2 likes comes first
        $this->assertEquals($review2->id, $reviews[0]['id']);
        $this->assertEquals(2, $reviews[0]['likes_count']);
        $this->assertEquals(1, $reviews[1]['likes_count']);
    }

    public function test_store_resource_deduplication()
    {
        $user = User::factory()->create();
        $resource = LearningResource::create([
            'type' => 'youtube',
            'identifier' => 'https://youtube.com/watch?v=123',
            'title' => 'Existing Video'
        ]);

        $response = $this->actingAs($user)
            ->postJson('/api/resources', [
                'type' => 'youtube',
                'identifier' => 'https://youtube.com/watch?v=123',
                'title' => 'New Video'
            ]);

        $response->assertStatus(200);
        $this->assertEquals($resource->id, $response->json('id'));
        $this->assertCount(1, LearningResource::all());
    }

    public function test_store_textbook_with_external_api()
    {
        $user = User::factory()->create();
        $isbn = '0201896834';

        Http::fake([
            "https://openlibrary.org/api/books*" => Http::response([
                "ISBN:{$isbn}" => [
                    'title' => 'The Art of Computer Programming',
                    'authors' => [['name' => 'Donald Knuth']],
                    'cover' => ['large' => 'https://example.com/cover.jpg']
                ]
            ], 200)
        ]);

        $response = $this->actingAs($user)
            ->postJson('/api/resources', [
                'type' => 'textbook',
                'identifier' => $isbn
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('learning_resources', [
            'identifier' => $isbn,
            'title' => 'The Art of Computer Programming',
            'author' => 'Donald Knuth',
            'cover_image_url' => 'https://example.com/cover.jpg'
        ]);
    }

    public function test_like_toggle_logic()
    {
        $user = User::factory()->create();
        $resource = LearningResource::create(['type' => 'youtube', 'identifier' => 'vid1', 'title' => 'Title']);
        $review = Review::create([
            'learning_resource_id' => $resource->id,
            'user_id' => $user->id,
            'rating' => 5,
            'content' => 'Cool'
        ]);

        // Like it
        $response = $this->actingAs($user)
            ->postJson("/api/reviews/{$review->id}/like");

        $response->assertStatus(201);
        $this->assertDatabaseHas('likes', ['review_id' => $review->id, 'user_id' => $user->id]);

        // Unlike it
        $response = $this->actingAs($user)
            ->postJson("/api/reviews/{$review->id}/like");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('likes', ['review_id' => $review->id, 'user_id' => $user->id]);
    }

    public function test_report_validation()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->postJson('/api/reports', [
                'reason' => 'Bad content'
            ]);

        $response->assertStatus(422);
    }
}
