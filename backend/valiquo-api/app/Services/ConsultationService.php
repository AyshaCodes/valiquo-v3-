<?php

namespace App\Services;

use App\Contracts\GeminiServiceInterface;
use App\Enums\ConsultationStatut;
use App\Enums\MessageExpediteur;
use App\Models\Consultation;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ConsultationService
{
    public function __construct(
        private readonly GeminiServiceInterface $geminiService,
        private readonly FallbackResponseService $fallbackService,
    ) {}

    /**
     * Create a consultation and process it synchronously.
     * Uses fallback response for all thematiques (Gemini quota exhausted).
     */
    public function create(User $user, array $data): Consultation
    {
        // Check for cached response from similar consultations
        $cached = $this->findCachedResponse($data['question'], $data['thematique'], $data['ville'] ?? null);
        
        if ($cached) {
            return Consultation::create([
                'user_id' => $user->id,
                'question' => $data['question'],
                'thematique' => $data['thematique'],
                'ville' => $data['ville'] ?? null,
                'reponse' => $cached,
                'statut' => ConsultationStatut::Terminee,
            ]);
        }

        $consultation = Consultation::create([
            'user_id' => $user->id,
            'question' => $data['question'],
            'thematique' => $data['thematique'],
            'ville' => $data['ville'] ?? null,
            'reponse' => null,
            'statut' => ConsultationStatut::EnCours,
        ]);

        // Use fallback directly for all thematiques (Gemini quota exhausted)
        return $this->processWithFallback($consultation);
    }

    /**
     * Find a cached response from a similar consultation (same question, thematique, and ville)
     */
    private function findCachedResponse(string $question, string $thematique, ?string $ville): ?string
    {
        $similar = Consultation::where('question', $question)
            ->where('thematique', $thematique)
            ->where('ville', $ville)
            ->where('statut', ConsultationStatut::Terminee)
            ->whereNotNull('reponse')
            ->where('reponse', '!=', '')
            ->orderByDesc('created_at')
            ->first();

        return $similar?->reponse;
    }

    /**
     * Process "Création d'entreprise" consultations with limited text for Gemini.
     * Falls back to predefined responses if Gemini fails.
     */
    private function processWithGeminiForCreation(Consultation $consultation): Consultation
    {
        try {
            $reponse = $this->geminiService->generateConsultationResponse($consultation);

            $consultation->update([
                'reponse' => $reponse,
                'statut' => ConsultationStatut::Terminee,
            ]);
        } catch (\Throwable $e) {
            \Log::info('Gemini failed for Création d\'entreprise, using fallback', [
                'consultation_id' => $consultation->id,
                'error' => $e->getMessage(),
            ]);
            
            return $this->processWithFallback($consultation);
        }

        return $consultation->fresh();
    }

    /**
     * Process consultation using fallback response directly.
     */
    private function processWithFallback(Consultation $consultation): Consultation
    {
        $fallbackResponse = $this->fallbackService->generateFallbackResponse(
            $consultation->question,
            $consultation->thematique,
            $consultation->ville
        );

        $consultation->update([
            'reponse' => $fallbackResponse,
            'statut' => ConsultationStatut::Terminee,
        ]);

        return $consultation->fresh();
    }

    /**
     * Process a consultation through Gemini and persist the response.
     * Falls back to predefined responses if Gemini fails (quota, timeout, etc).
     * @deprecated Use processWithGeminiForCreation or processWithFallback instead
     */
    public function processWithGemini(Consultation $consultation): Consultation
    {
        try {
            $reponse = $this->geminiService->generateConsultationResponse($consultation);

            $consultation->update([
                'reponse' => $reponse,
                'statut' => ConsultationStatut::Terminee,
            ]);
        } catch (\Throwable $e) {
            \Log::info('Gemini unavailable, using fallback response', [
                'consultation_id' => $consultation->id,
                'error' => $e->getMessage(),
            ]);
            
            // Use fallback service when Gemini fails (quota exceeded, timeout, etc)
            $fallbackResponse = $this->fallbackService->generateFallbackResponse(
                $consultation->question,
                $consultation->thematique,
                $consultation->ville
            );

            $consultation->update([
                'reponse' => $fallbackResponse,
                'statut' => ConsultationStatut::Terminee,
            ]);
        }

        return $consultation->fresh();
    }

    public function paginateForUser(User $user, int $perPage = 10): LengthAwarePaginator
    {
        return $user->consultations()
            ->orderByDesc('created_at')
            ->paginate($perPage);
    }
}
