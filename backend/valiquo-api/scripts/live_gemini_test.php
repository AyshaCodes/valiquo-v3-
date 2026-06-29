<?php

use App\Models\User;
use App\Services\ConsultationService;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Contracts\Console\Kernel;

require __DIR__.'/../vendor/autoload.php';
$app = require __DIR__.'/../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

if (empty(config('gemini.api_key'))) {
    echo "ERROR: GEMINI_API_KEY not configured\n";
    exit(1);
}

$app->make(Kernel::class)->bootstrap();
(app()->bound('db') || true);

// Ensure roles exist
(new RolePermissionSeeder)->run();

$user = User::firstOrCreate(
    ['email' => 'gemini-live-test@valiquo.test'],
    ['name' => 'Gemini Test', 'password' => bcrypt('password123')]
);
if (! $user->hasRole('user')) {
    $user->assignRole('user');
}

echo "Calling ConsultationService with live Gemini API...\n";
echo "Model: ".config('gemini.model')."\n";
echo "Documents path: ".config('gemini.documents_path')."\n";

$selector = app(\App\Services\RegulatoryDocumentSelector::class);
$primary = $selector->resolvePrimaryPath('Création d\'entreprise');
echo "Primary PDF: ".($primary ? basename($primary) : 'none')."\n";

if ($primary) {
    $extractor = app(\App\Services\RegulatoryDocumentTextExtractor::class);
    $extracted = $extractor->getTextForPdf($primary);
    echo 'Extracted text length: '.strlen($extracted)." chars\n";
}

echo "\n";

try {
    $gemini = app(\App\Contracts\GeminiServiceInterface::class);
    $text = $gemini->generateResponse(
        'Je veux créer une SARL à Casablanca, quelles sont les étapes ?',
        'Création d\'entreprise',
        'Casablanca',
    );
    echo "=== DIRECT GEMINI RESPONSE ===\n";
    echo $text."\n\n";
} catch (Throwable $e) {
    echo "=== GEMINI ERROR ===\n";
    echo $e->getMessage()."\n\n";
}

$service = app(ConsultationService::class);

$start = microtime(true);
$consultation = $service->create($user, [
    'question' => 'Je veux créer une SARL à Casablanca, quelles sont les étapes ?',
    'thematique' => 'Création d\'entreprise',
    'ville' => 'Casablanca',
]);
$elapsed = round(microtime(true) - $start, 1);

echo "Statut: {$consultation->statut->value}\n";
echo "Duration: {$elapsed}s\n\n";

if ($consultation->reponse) {
    echo "=== GEMINI RESPONSE ===\n";
    echo $consultation->reponse."\n";
} else {
    echo "No response saved. Check logs for GeminiException details.\n";
}
