<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CountryController;
use App\Http\Controllers\Api\CoachController;

Route::prefix('countries')->group(function () {
    Route::get('/', [CountryController::class, 'index']);
    Route::get('/{code}', [CountryController::class, 'show']);
    Route::post('/', [CountryController::class, 'store']);
    Route::put('/{code}', [CountryController::class, 'update']);
    Route::delete('/{code}', [CountryController::class, 'destroy']);
});

Route::post('/coach/chat', [CoachController::class, 'chat']);
