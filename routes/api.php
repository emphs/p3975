<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LearningResourceController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\Api\AuthController;

/* Public Routes (No login required) */
Route::post('/login', [AuthController::class, 'login']);
Route::get('/resources', [LearningResourceController::class, 'index']);
Route::get('/resources/{id}', [LearningResourceController::class, 'show']);
Route::post('/reviews/preview-summary', [ReviewController::class, 'previewSummary']);

/* Protected Routes (Requires Sanctum Authentication Token) */
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/resources', [LearningResourceController::class, 'store']);
    Route::post('/resources/{id}/summarize', [LearningResourceController::class, 'summarize']);
    Route::post('/reviews', [ReviewController::class, 'store']);

    Route::post('/reviews/{review_id}/like', [LikeController::class, 'toggle']);
    Route::post('/reports', [ReportController::class, 'store']);
});