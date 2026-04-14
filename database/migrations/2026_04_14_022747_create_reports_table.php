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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // The user making the report
            $table->foreignId('learning_resource_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('review_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('reason');
            $table->string('status')->default('pending'); // For Son's admin dashboard
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
