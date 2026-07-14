<?php

require __DIR__ . '/../vendor/autoload.php';

use Illuminate\Support\Facades\Http;

// Bootstrap Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== TESTING AUTHENTICATION FLOW ===\n\n";

// Step 1: Get CSRF cookie
echo "Step 1: GET /sanctum/csrf-cookie\n";
try {
    $response = Http::withOptions(['verify' => false])->get('http://localhost:8000/sanctum/csrf-cookie');
    echo "Status: " . $response->status() . "\n";
    echo "Cookies: " . json_encode($response->cookies()) . "\n\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n\n";
}

// Step 2: Login
echo "Step 2: POST /login\n";
try {
    $response = Http::withOptions(['verify' => false])
        ->asForm()
        ->post('http://localhost:8000/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);
    echo "Status: " . $response->status() . "\n";
    echo "Body: " . $response->body() . "\n";
    echo "Cookies: " . json_encode($response->cookies()) . "\n\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n\n";
}

// Step 3: Get user
echo "Step 3: GET /api/user\n";
try {
    $response = Http::withOptions(['verify' => false])
        ->withCookies([
            'laravel_session' => 'test'
        ], 'localhost')
        ->get('http://localhost:8000/api/user');
    echo "Status: " . $response->status() . "\n";
    echo "Body: " . $response->body() . "\n\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n\n";
}

echo "=== TEST COMPLETE ===\n";
