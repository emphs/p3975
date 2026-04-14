<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'reason',
        'status',          // Added your status column
        'reportable_id',   // Handled by morphs()
        'reportable_type'  // Handled by morphs()
    ];

    /**
     * Get the parent reportable model (either a LearningResource or a Review).
     */
    public function reportable()
    {
        return $this->morphTo();
    }

    /**
     * Get the user that submitted the report.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}