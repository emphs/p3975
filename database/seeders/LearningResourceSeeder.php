<?php

namespace Database\Seeders;

use App\Models\LearningResource;
use App\Models\Like;
use App\Models\Report;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LearningResourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 5 regular users and 1 admin
        $users = User::factory(5)->create();
        $admin = User::factory()->admin()->create([
            'email' => 'admin@example.com',
        ]);

        // Create 10 learning resources
        LearningResource::factory(10)->create()->each(function ($resource) use ($users) {
            // Create 3 reviews for each resource by random users
            Review::factory(3)->create([
                'learning_resource_id' => $resource->id,
                'user_id' => fn() => $users->random()->id,
            ])->each(function ($review) use ($users) {
                // Create some likes for each review
                $likers = $users->random(rand(0, 3));
                foreach ($likers as $liker) {
                    Like::factory()->create([
                        'review_id' => $review->id,
                        'user_id' => $liker->id,
                    ]);
                }
            });

            // Randomly report some resources or reviews
            if (rand(1, 4) === 1) {
                Report::factory()->create([
                    'user_id' => $users->random()->id,
                    'learning_resource_id' => $resource->id,
                    'review_id' => null,
                    'reason' => 'Inappropriate content',
                ]);
            }
        });
    }
}
