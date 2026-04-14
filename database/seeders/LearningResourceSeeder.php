<?php

namespace Database\Seeders;

use App\Models\LearningResource;
use App\Models\Like;
use App\Models\Report;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class LearningResourceSeeder extends Seeder
{
    public function run(): void
    {
        // Use existing users if they exist (like your 'aa' user), otherwise create new ones
        $users = User::all();
        if ($users->isEmpty()) {
            $users = User::factory(5)->create();
        }

        // Create 10 learning resources
        LearningResource::factory(10)->create()->each(function ($resource) use ($users) {

            // 1. Create 2 reviews for each resource
            $reviews = Review::factory(2)->create([
                'learning_resource_id' => $resource->id,
                'user_id' => $users->random()->id,
            ]);

            // 2. Randomly report the Resource (Polymorphic)
            if (rand(1, 3) === 1) {
                Report::create([
                    'user_id' => $users->random()->id,
                    'reason' => 'Inappropriate resource content',
                    'status' => 'pending',
                    'reportable_id' => $resource->id,
                    'reportable_type' => LearningResource::class,
                ]);
            }

            // 3. Randomly report a Review (Polymorphic)
            $reviews->each(function ($review) use ($users) {
                if (rand(1, 4) === 1) {
                    Report::create([
                        'user_id' => $users->random()->id,
                        'reason' => 'Spammy review',
                        'status' => 'pending',
                        'reportable_id' => $review->id,
                        'reportable_type' => Review::class,
                    ]);
                }
            });
        });
    }
}
