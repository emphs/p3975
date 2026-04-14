<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('learning_resources', function (Blueprint $table) {
            $table->id();
            $table->string('type')->default('youtube'); // 'youtube' or 'textbook'
            $table->string('identifier'); // The YouTube URL or the ISBN
            $table->string('title')->nullable(); // Nullable because we might fetch it automatically
            $table->string('author')->nullable(); // Only used for textbooks
            $table->string('cover_image_url')->nullable(); // Only used for textbooks
            $table->text('ai_summary')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_resources');
    }
};
