<?php

use App\Jobs\GenerateLearningResourceSummary;
use App\Models\LearningResource;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function () {
    LearningResource::query()
        ->whereHas('reviews')
        ->chunkById(50, function ($resources): void {
            foreach ($resources as $resource) {
                GenerateLearningResourceSummary::dispatch($resource->id);
            }
        });
})->hourly()->name('refresh-ai-review-summaries')->withoutOverlapping();