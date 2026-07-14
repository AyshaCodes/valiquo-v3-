<?php

require __DIR__ . '/../vendor/autoload.php';

use App\Services\ConsultationService;
use App\Models\User;
use Illuminate\Support\Facades\DB;

// Bootstrap Laravel
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== TESTING ALL THEMATIQUES WITH FALLBACK ===\n\n";

// Get or create a test user
$user = User::first();
if (!$user) {
    echo "ERROR: No user found in database. Please create one first.\n";
    exit(1);
}

$consultationService = app(ConsultationService::class);

$thematiques = [
    'Création d\'entreprise' => [
        'question' => 'Comment créer une SARL à Agadir avec 2 associés ?',
        'ville' => 'Agadir',
    ],
    'Fiscalité' => [
        'question' => 'Quels sont les taux d\'IS pour une SA à Fès ?',
        'ville' => 'Fès',
    ],
    'Statuts juridiques' => [
        'question' => 'Quelle est la différence entre SARL et SAS au Maroc ?',
        'ville' => 'Tanger',
    ],
    'Procédures OMPIC' => [
        'question' => 'Comment obtenir un certificat négatif à Oujda ?',
        'ville' => 'Oujda',
    ],
    'CNSS & Social' => [
        'question' => 'Comment afficher un salarié à la CNSS à Meknès ?',
        'ville' => 'Meknès',
    ],
    'Autre' => [
        'question' => 'Quels sont les organismes pour créer une entreprise au Maroc ?',
        'ville' => 'Rabat',
    ],
];

foreach ($thematiques as $thematique => $data) {
    echo "TEST: {$thematique}\n";
    echo "--------------------------------------------------------\n";
    
    try {
        $consultation = $consultationService->create($user, [
            'question' => $data['question'],
            'thematique' => $thematique,
            'ville' => $data['ville'],
        ]);
        
        echo "✓ Consultation ID: {$consultation->id}\n";
        echo "✓ Statut: {$consultation->statut->value}\n";
        echo "✓ Response length: " . mb_strlen($consultation->reponse) . " characters\n";
        echo "✓ Has ville: " . ($consultation->ville ? 'Yes' : 'No') . "\n";
        
        // Check if response contains expected keywords
        $keywords = ['OMPIC', 'DGI', 'CNSS', 'CRI', 'Loi', 'MAD'];
        $foundKeywords = array_filter($keywords, fn($k) => str_contains($consultation->reponse, $k));
        echo "✓ Found " . count($foundKeywords) . " reference keywords\n";
        
        echo "\n--- RESPONSE PREVIEW (first 500 chars) ---\n";
        echo mb_substr($consultation->reponse, 0, 500) . "...\n\n";
        
    } catch (\Exception $e) {
        echo "✗ ERROR: " . $e->getMessage() . "\n\n";
    }
}

echo "\n=== ALL TESTS COMPLETE ===\n";
