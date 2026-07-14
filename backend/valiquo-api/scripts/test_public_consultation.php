<?php

require __DIR__ . '/../vendor/autoload.php';

use Illuminate\Support\Facades\Http;

// Bootstrap Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== TESTING PUBLIC CONSULTATION ENDPOINT ===\n\n";

echo "Step: POST /api/consultations/public (no auth)\n";
try {
    $response = Http::withOptions(['verify' => false])
        ->asJson()
        ->post('http://localhost:8000/api/consultations/public', [
            'question' => 'Comment créer une SARL à Casablanca ?',
            'thematique' => 'Création d\'entreprise',
            'ville' => 'Casablanca',
        ]);
    
    echo "Status: " . $response->status() . "\n";
    echo "Body: " . json_encode($response->json(), JSON_PRETTY_PRINT) . "\n\n";
    
    if ($response->successful()) {
        echo "✓ SUCCESS: Public endpoint works without authentication\n";
    } else {
        echo "✗ FAILED: " . $response->body() . "\n";
    }
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n\n";
}

echo "=== TEST COMPLETE ===\n";
