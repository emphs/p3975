<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearningResource extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'identifier',
        'title',
        'author',
        'cover_image_url',
        'ai_summary',
        'ai_summary_review_count',
        'ai_summary_generated_at',
    ];

    protected $casts = [
        'ai_summary_generated_at' => 'datetime',
    ];

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function needsAiSummaryRefresh(): bool
    {
        $reviewCount = $this->reviews()->count();

        if ($reviewCount === 0) {
            return false;
        }

        if (blank($this->ai_summary) || blank($this->ai_summary_generated_at)) {
            return true;
        }

        $lastSummarizedCount = (int) ($this->ai_summary_review_count ?? 0);
        $refreshAfterNewReviews = (int) config('services.github_models.refresh_after_new_reviews', 3);

        if (($reviewCount - $lastSummarizedCount) >= $refreshAfterNewReviews) {
            return true;
        }

        return $this->ai_summary_generated_at->lte(
            now()->subHours((int) config('services.github_models.refresh_interval_hours', 24))
        );
    }
}