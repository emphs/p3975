<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ModerationController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Illuminate\Support\Facades\Http;

Route::get('/debug-models', function () {
    $token = config('services.github_models.token');

    $response = Http::acceptJson()
        ->withToken($token)
        ->withHeaders([
            'X-GitHub-Api-Version' => config('services.github_models.api_version', '2026-03-10'),
        ])
        ->when(app()->environment('local'), fn ($request) => $request->withoutVerifying())
        ->get('https://models.github.ai/catalog/models');

    return response()->json([
        'status' => $response->status(),
        'body' => $response->json(),
    ]);
});
// --- Default Application Routes (Fortify/Inertia) ---
Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('/', 'book-search')->name('home');
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('book', 'book-search')->name('book');
});

// --- Role 3: Admin Web Routes ---
Route::middleware(['auth', 'is_admin'])->prefix('admin')->group(function () {

    // The main admin dashboard
    Route::get('/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');

    // The moderation queue (View)
    Route::get('/reports', [ModerationController::class, 'index'])->name('admin.reports');

    // The moderation action (Delete)
    Route::delete('/reports/{id}', [ModerationController::class, 'destroy'])->name('admin.reports.destroy');
});

require __DIR__.'/settings.php';
