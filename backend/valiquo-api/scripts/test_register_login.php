<?php

require __DIR__ . '/../vendor/autoload.php';

use Illuminate\Support\Facades\Http;

// Bootstrap Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== TESTING REGISTRATION AND LOGIN ===\n\n";

$testEmail = 'testauth' . time() . '@example.com';
$testPassword = 'password123';

// Step 1: Get CSRF cookie
echo "Step 1: GET /sanctum/csrf-cookie\n";
try {
    $response = Http::withOptions(['verify' => false])->get('http://localhost:8000/sanctum/csrf-cookie');
    echo "Status: " . $response->status() . "\n";
    echo "Cookies: " . json_encode($response->cookies()) . "\n\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n\n";
    exit(1);
}

// Step 2: Register
echo "Step 2: POST /register\n";
echo "Email: {$testEmail}\n";
try {
    $response = Http::withOptions(['verify' => false])
        ->asJson()
        ->post('http://localhost:8000/register', [
            'name' => 'Test Auth User',
            'email' => $testEmail,
            'password' => $testPassword,
            'password_confirmation' => $testPassword,
        ]);
    
    echo "Status: " . $response->status() . "\n";
    echo "Body: " . $response->body() . "\n";
    echo "Cookies: " . json_encode($response->cookies()) . "\n\n";
    
    if ($response->successful()) {
        echo "✓ Registration successful\n\n";
    } else {
        echo "✗ Registration failed\n\n";
    }
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n\n";
    exit(1);
}

// Step 3: Login
echo "Step 3: POST /login\n";
try {
    $response = Http::withOptions(['verify' => false])
        ->asJson()
        ->post('http://localhost:8000/login', [
            'email' => $testEmail,
            'password' => $testPassword,
        ]);
    
    echo "Status: " . $response->status() . "\n";
    echo "Body: " . $response->body() . "\n";
    echo "Cookies: " . json_encode($response->cookies()) . "\n\n";
    
    if ($response->successful()) {
        echo "✓ Login successful\n\n";
    } else {
        echo "✗ Login failed\n\n";
    }
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n\n";
    exit(1);
}

// Step 4: Get user (with session cookie)
echo "Step 4: GET /api/user\n";
try {
    $response = Http::withOptions(['verify' => false])
        ->withCookies([
            'laravel_session' => 'test'
        ], 'localhost')
        ->acceptJson()
        ->get('http://localhost:8000/api/user');
    
    echo "Status: " . $response->status() . "\n";
    echo "Body: " . $response->body() . "\n\n";
    
    if ($response->successful()) {
        echo "✓ User endpoint accessible\n\n";
    } else {
        echo "✗ User endpoint failed (expected - needs proper session)\n\n";
    }
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n\n";
}

echo "=== TEST COMPLETE ===\n";
