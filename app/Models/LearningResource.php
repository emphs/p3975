<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LearningResource extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'url_or_isbn', 'ai_summary'];

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
