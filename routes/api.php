<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LearningResourceController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\ReportController;

/* Public Routes (No login required) */
Route::get('/resources', [LearningResourceController::class, 'index']);
Route::get('/resources/{id}', [LearningResourceController::class, 'show']);

/* Protected Routes (Requires Sanctum Authentication Token) */
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/resources', [LearningResourceController::class, 'store']);
    Route::post('/reviews', [ReviewController::class, 'store']);

    // New Routes
    Route::post('/reviews/{review_id}/like', [LikeController::class, 'toggle']);
    Route::post('/reports', [ReportController::class, 'store']);
});
