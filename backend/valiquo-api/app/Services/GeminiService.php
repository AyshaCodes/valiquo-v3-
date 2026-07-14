<?php

namespace App\Services;

use App\Contracts\GeminiServiceInterface;
use App\Enums\MessageExpediteur;
use App\Exceptions\GeminiException;
use App\Models\Consultation;
use App\Models\Conversation;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

class GeminiService implements GeminiServiceInterface
{
    public function __construct(
        private readonly RegulatoryDocumentSelector $documentSelector,
        private readonly RegulatoryDocumentTextExtractor $textExtractor,
    ) {}

    public function generateConsultationResponse(Consultation $consultation): string
    {
        return $this->generateResponse(
            $consultation->question,
            $consultation->thematique,
            $consultation->ville,
        );
    }

    public function generateCoachResponse(Conversation $conversation, string $userMessage): string
    {
        $history = $conversation->messages()
            ->orderBy('created_at')
            ->get()
            ->map(function ($message) {
                $speaker = $message->expediteur === MessageExpediteur::User ? 'Utilisateur' : 'Coach';

                return "{$speaker}: {$message->contenu}";
            })
            ->implode("\n");

        $question = trim("Historique de la conversation:\n{$history}\n\nDernière question de l'utilisateur:\n{$userMessage}");

        return $this->generateResponse($question, 'Autre', null);
    }

    public function generateResponse(string $question, string $thematique, ?string $ville): string
    {
        $apiKeys = config('gemini.api_keys', []);
        
        if (empty($apiKeys)) {
            $apiKey = config('gemini.api_key');
            if (empty($apiKey)) {
                throw GeminiException::missingApiKey();
            }
            $apiKeys = [$apiKey];
        }

        $primaryPath = $this->documentSelector->resolvePrimaryPath($thematique);

        if ($primaryPath === null) {
            throw GeminiException::noDocumentsAvailable($thematique);
        }

        $documents = $this->textExtractor->getTextsForPaths([$primaryPath]);

        // Limit text to 1500 characters for "Création d'entreprise" to avoid quota
        if ($thematique === 'Création d\'entreprise') {
            foreach ($documents as &$doc) {
                if (mb_strlen($doc['text']) > 1500) {
                    $doc['text'] = mb_substr($doc['text'], 0, 1500) . '…';
                }
            }
        }

        $prompt = $this->buildPrompt($question, $thematique, $ville, $documents);

        $model = config('gemini.model');
        $url = sprintf(
            '%s/models/%s:generateContent',
            rtrim(config('gemini.base_url'), '/'),
            $model,
        );

        $lastError = null;

        foreach ($apiKeys as $apiKey) {
            try {
                $response = Http::timeout(config('gemini.timeout'))
                    ->acceptJson()
                    ->withQueryParameters(['key' => $apiKey])
                    ->post($url, [
                        'system_instruction' => [
                            'parts' => [
                                ['text' => config('gemini.system_instruction')],
                            ],
                        ],
                        'contents' => [
                            [
                                'role' => 'user',
                                'parts' => [
                                    ['text' => $prompt],
                                ],
                            ],
                        ],
                        'generationConfig' => [
                            'temperature' => 0.3,
                            'maxOutputTokens' => 4096,
                        ],
                    ]);

                if ($response->failed()) {
                    $message = $response->json('error.message') ?? $response->body();
                    $lastError = "API Key failed: {$message}";
                    
                    // Try next key if rate limited
                    if ($response->status() === 429) {
                        continue;
                    }
                    
                    throw GeminiException::apiError((string) $message, $response->status());
                }

                $text = data_get($response->json(), 'candidates.0.content.parts.0.text');

                if (! is_string($text) || trim($text) === '') {
                    throw GeminiException::emptyResponse();
                }

                return trim($text);
            } catch (ConnectionException $e) {
                $lastError = $e->getMessage();
                continue;
            }
        }

        throw GeminiException::apiError($lastError ?? 'All API keys failed', 429);
    }

    /**
     * @param  list<array{source: string, text: string}>  $documents
     */
    private function buildPrompt(string $question, string $thematique, ?string $ville, array $documents): string
    {
        $lines = [
            "Thématique: {$thematique}",
        ];

        if ($ville) {
            $lines[] = "Ville: {$ville}";
        }

        $lines[] = '';
        $lines[] = 'Documents officiels de référence (texte extrait):';

        foreach ($documents as $document) {
            $lines[] = '';
            $lines[] = "--- Document: {$document['source']} ---";
            $lines[] = $document['text'];
        }

        $lines[] = '';
        $lines[] = 'Question:';
        $lines[] = $question;

        return implode("\n", $lines);
    }
}
