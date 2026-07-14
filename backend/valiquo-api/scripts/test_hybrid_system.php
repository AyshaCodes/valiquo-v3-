<?php

require __DIR__ . '/../vendor/autoload.php';

use App\Services\ConsultationService;
use App\Models\User;
use App\Models\Consultation;
use Illuminate\Support\Facades\DB;

// Bootstrap Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== TESTING HYBRID RAG + FALLBACK SYSTEM ===\n\n";

// Get or create a test user
$user = User::first();
if (!$user) {
    echo "ERROR: No user found in database. Please create one first.\n";
    exit(1);
}

$consultationService = app(ConsultationService::class);

// Test 1: Création d'entreprise (should attempt Gemini)
echo "TEST 1: Création d'entreprise (should attempt Gemini)\n";
echo "--------------------------------------------------------\n";
try {
    $consultation1 = $consultationService->create($user, [
        'question' => 'Je veux créer une SARL à Casablanca, quelles sont les étapes ?',
        'thematique' => 'Création d\'entreprise',
        'ville' => 'Casablanca',
    ]);
    
    echo "✓ Consultation created (ID: {$consultation1->id})\n";
    echo "✓ Statut: {$consultation1->statut->value}\n";
    echo "✓ Response length: " . mb_strlen($consultation1->reponse) . " characters\n";
    echo "\n--- RESPONSE PREVIEW ---\n";
    echo mb_substr($consultation1->reponse, 0, 500) . "...\n";
    echo "\n";
} catch (\Exception $e) {
    echo "✗ ERROR: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 2: Fiscalité (should use fallback directly)
echo "TEST 2: Fiscalité (should use fallback directly)\n";
echo "--------------------------------------------------------\n";
try {
    $consultation2 = $consultationService->create($user, [
        'question' => 'Quels sont les taux d\'IS pour les entreprises au Maroc ?',
        'thematique' => 'Fiscalité',
        'ville' => 'Rabat',
    ]);
    
    echo "✓ Consultation created (ID: {$consultation2->id})\n";
    echo "✓ Statut: {$consultation2->statut->value}\n";
    echo "✓ Response length: " . mb_strlen($consultation2->reponse) . " characters\n";
    echo "\n--- RESPONSE PREVIEW ---\n";
    echo mb_substr($consultation2->reponse, 0, 500) . "...\n";
    echo "\n";
} catch (\Exception $e) {
    echo "✗ ERROR: " . $e->getMessage() . "\n";
}

echo "\n=== TEST COMPLETE ===\n";
