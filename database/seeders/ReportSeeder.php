<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Report;
use App\Models\User;
use App\Models\Review;
use App\Models\LearningResource;

class ReportSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure we have at least one user to act as the reporter
        $reporter = User::first() ?? User::factory()->create();

        // 2. Create a fake Learning Resource and report it
        // Create a fake Learning Resource using the correct column names
        $resource = LearningResource::create([
            'title' => 'Dodgy Calculus Guide',
            'url_or_isbn' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'ai_summary' => 'This resource is flagged for manual review.'
        ]);

        Report::create([
            'user_id' => $reporter->id,
            'reason' => 'This link leads to malware, not a tutorial.',
            'status' => 'pending',
            'reportable_id' => $resource->id,
            'reportable_type' => LearningResource::class,
        ]);

        // 3. Create a fake Review and report it
        $review = Review::create([
            'user_id' => $reporter->id,
            'learning_resource_id' => $resource->id,
            'rating' => 1,
            'content' => 'This reviewer is using extreme profanity and harrassing people.'
        ]);

        Report::create([
            'user_id' => $reporter->id,
            'reason' => 'Hate speech and harassment.',
            'status' => 'pending',
            'reportable_id' => $review->id,
            'reportable_type' => Review::class,
        ]);
    }
}
