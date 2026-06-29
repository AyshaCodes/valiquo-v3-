<?php

require __DIR__.'/../vendor/autoload.php';
$app = require __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$key = config('gemini.api_key');
$response = Illuminate\Support\Facades\Http::get('https://generativelanguage.googleapis.com/v1beta/models', [
    'key' => $key,
]);

if ($response->failed()) {
    echo 'ERROR: '.$response->body().PHP_EOL;
    exit(1);
}

foreach ($response->json('models', []) as $model) {
    $name = $model['name'] ?? '';
    $methods = implode(',', $model['supportedGenerationMethods'] ?? []);
    if (str_contains($name, 'flash') && str_contains($methods, 'generateContent')) {
        echo str_replace('models/', '', $name).PHP_EOL;
    }
}
