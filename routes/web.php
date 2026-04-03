<?php

use App\Http\Controllers\GroupController;
use App\Http\Controllers\GroupJoinRequestController;
use App\Http\Controllers\PublicGroupController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::get('/groups', [PublicGroupController::class, 'index'])->name('groups.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/my/groups', [GroupController::class, 'myDrpIndex'])->name('my-groups.index');
    Route::get('/groups/create', [GroupController::class, 'create'])->name('groups.create');
    Route::post('/groups', [GroupController::class, 'store'])->name('groups.store');
    Route::post('/groups/{group}/join-requests', [GroupJoinRequestController::class, 'store'])->name('groups.join-requests.store');
    Route::post('/groups/{group}/join-requests/{joinRequest}/accept', [GroupJoinRequestController::class, 'accept'])->name('groups.join-requests.accept');
    Route::post('/groups/{group}/join-requests/{joinRequest}/decline', [GroupJoinRequestController::class, 'decline'])->name('groups.join-requests.decline');
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::get('/groups/{group}', [PublicGroupController::class, 'show'])->name('groups.show');

require __DIR__.'/settings.php';
