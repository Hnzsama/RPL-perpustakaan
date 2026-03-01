<?php

use App\Http\Controllers\Library\BookController;
use App\Http\Controllers\Library\BorrowingController;
use App\Http\Controllers\Library\CategoryController;
use App\Http\Controllers\Library\FineController;
use App\Http\Controllers\Library\MemberController;
use App\Http\Controllers\Library\SettingController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('members', MemberController::class)->except(['create', 'edit', 'show']);
    Route::resource('categories', CategoryController::class)->except(['create', 'edit', 'show']);
    Route::resource('books', BookController::class)->except(['create', 'edit', 'show']);
    Route::resource('borrowings', BorrowingController::class)->except(['create', 'edit', 'show']);
    Route::resource('fines', FineController::class)->except(['create', 'edit', 'show']);
    Route::get('settings/library', [SettingController::class, 'index'])->name('library-settings.index');
    Route::put('settings/library/{id}', [SettingController::class, 'update'])->name('library-settings.update');
});
