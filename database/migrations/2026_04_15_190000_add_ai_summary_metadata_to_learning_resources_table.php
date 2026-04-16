<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('learning_resources', function (Blueprint $table) {
            $table->unsignedInteger('ai_summary_review_count')->default(0)->after('ai_summary');
            $table->timestamp('ai_summary_generated_at')->nullable()->after('ai_summary_review_count');
        });
    }

    public function down(): void
    {
        Schema::table('learning_resources', function (Blueprint $table) {
            $table->dropColumn(['ai_summary_review_count', 'ai_summary_generated_at']);
        });
    }
};