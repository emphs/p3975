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
        $reporter = \App\Models\User::first() ?? \App\Models\User::factory()->create();

        // --- SAMPLE 1: A Malicious Resource ---
        $res1 = \App\Models\LearningResource::create([
            'title' => 'FREE CHEAT CODES 2026',
            'type' => 'youtube',
            'identifier' => 'https://youtube.com/bad-link', // Changed from url_or_isbn
            'ai_summary' => 'Suspicious link detected.'
        ]);

        \App\Models\Report::create([
            'user_id' => $reporter->id,
            'reason' => 'This is a phishing link.',
            'reportable_id' => $res1->id,
            'reportable_type' => \App\Models\LearningResource::class,
        ]);

        // --- SAMPLE 2: An Off-Topic Resource ---
        $res2 = \App\Models\LearningResource::create([
            'title' => 'How to Boil Eggs',
            'type' => 'textbook',
            'identifier' => '978-3-16-148410-0', // ISBN example
            'author' => 'Chef Quack',
            'ai_summary' => 'Unrelated to programming.'
        ]);

        \App\Models\Report::create([
            'user_id' => $reporter->id,
            'reason' => 'Off-topic content.',
            'reportable_id' => $res2->id,
            'reportable_type' => \App\Models\LearningResource::class,
        ]);

        // --- SAMPLE 3: A Toxic Review ---
        // We need a resource for the review to belong to first
        $validRes = \App\Models\LearningResource::first();

        $badReview = \App\Models\Review::create([
            'user_id' => $reporter->id,
            'learning_resource_id' => $validRes->id,
            'rating' => 1,
            'content' => "The author of this guide is a [REDACTED] and shouldn't be teaching!!"
        ]);

        \App\Models\Report::create([
            'user_id' => $reporter->id,
            'reason' => 'Hate speech and personal attacks against the author.',
            'reportable_id' => $badReview->id,
            'reportable_type' => \App\Models\Review::class,
        ]);
    }
}
