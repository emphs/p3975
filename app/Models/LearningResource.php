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
        'ai_summary'
    ];

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
