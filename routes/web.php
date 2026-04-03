<?php

use App\Http\Controllers\PublicGroupController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::get('/groups', [PublicGroupController::class, 'index'])->name('groups.index');
Route::get('/groups/{group}', [PublicGroupController::class, 'show'])->name('groups.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
