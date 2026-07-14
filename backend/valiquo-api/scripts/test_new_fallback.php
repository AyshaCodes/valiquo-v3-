<?php

require __DIR__ . '/../vendor/autoload.php';

use App\Services\ConsultationService;
use App\Models\User;
use Illuminate\Support\Facades\DB;

// Bootstrap Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== TESTING NEW DETAILED FALLBACK RESPONSES ===\n\n";

// Get or create a test user
$user = User::first();
if (!$user) {
    echo "ERROR: No user found in database. Please create one first.\n";
    exit(1);
}

$consultationService = app(ConsultationService::class);

// Test 1: Création d'entreprise with NEW question
echo "TEST 1: Création d'entreprise (new question)\n";
echo "--------------------------------------------------------\n";
try {
    $consultation1 = $consultationService->create($user, [
        'question' => 'Comment créer une SARL à Marrakech avec 3 associés ?',
        'thematique' => 'Création d\'entreprise',
        'ville' => 'Marrakech',
    ]);
    
    echo "✓ Consultation created (ID: {$consultation1->id})\n";
    echo "✓ Statut: {$consultation1->statut->value}\n";
    echo "✓ Response length: " . mb_strlen($consultation1->reponse) . " characters\n";
    echo "\n--- FULL RESPONSE ---\n";
    echo $consultation1->reponse . "\n";
    echo "\n";
} catch (\Exception $e) {
    echo "✗ ERROR: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 2: Fiscalité with NEW question
echo "TEST 2: Fiscalité (new question)\n";
echo "--------------------------------------------------------\n";
try {
    $consultation2 = $consultationService->create($user, [
        'question' => 'Quels sont les taux d\'IS et TVA pour une PME à Tanger ?',
        'thematique' => 'Fiscalité',
        'ville' => 'Tanger',
    ]);
    
    echo "✓ Consultation created (ID: {$consultation2->id})\n";
    echo "✓ Statut: {$consultation2->statut->value}\n";
    echo "✓ Response length: " . mb_strlen($consultation2->reponse) . " characters\n";
    echo "\n--- FULL RESPONSE ---\n";
    echo $consultation2->reponse . "\n";
    echo "\n";
} catch (\Exception $e) {
    echo "✗ ERROR: " . $e->getMessage() . "\n";
}

echo "\n=== TEST COMPLETE ===\n";
