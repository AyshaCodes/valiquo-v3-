<?php

use App\Http\Controllers\Api\CoachController;
use App\Http\Controllers\Api\ConsultationController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\CountryController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:web'])->get('/user', function (Request $request) {
    return new UserResource($request->user());
});

// Public auth endpoints (Sanctum stateful - no CSRF for API)
Route::post('/auth/register', [RegisteredUserController::class, 'store']);
Route::post('/auth/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/auth/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth');

// Public consultation endpoint for demo purposes
Route::post('/consultations/public', [ConsultationController::class, 'storePublic']);
Route::get('/consultations/{consultation}', [ConsultationController::class, 'show']);

Route::middleware(['auth:web'])->group(function () {
    Route::post('/consultations', [ConsultationController::class, 'store']);
    Route::get('/consultations', [ConsultationController::class, 'index']);

    Route::post('/conversations', [ConversationController::class, 'store']);
    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::get('/conversations/{conversation}', [ConversationController::class, 'show']);
    Route::post('/conversations/{conversation}/messages', [ConversationController::class, 'storeMessage']);
});

Route::prefix('countries')->group(function () {
    Route::get('/', [CountryController::class, 'index']);
    Route::get('/{code}', [CountryController::class, 'show']);
    Route::post('/', [CountryController::class, 'store']);
    Route::put('/{code}', [CountryController::class, 'update']);
    Route::delete('/{code}', [CountryController::class, 'destroy']);
});

Route::middleware(['auth:sanctum'])->post('/coach/chat', [CoachController::class, 'chat']);
