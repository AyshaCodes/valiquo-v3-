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
    ) {}

    /**
     * Create a consultation and process it synchronously through Gemini.
     * In production, dispatch a queued job instead of calling processWithGemini inline.
     */
    public function create(User $user, array $data): Consultation
    {
        $consultation = Consultation::create([
            'user_id' => $user->id,
            'question' => $data['question'],
            'thematique' => $data['thematique'],
            'ville' => $data['ville'] ?? null,
            'reponse' => null,
            'statut' => ConsultationStatut::EnCours,
        ]);

        return $this->processWithGemini($consultation);
    }

    /**
     * Process a consultation through Gemini and persist the response.
     */
    public function processWithGemini(Consultation $consultation): Consultation
    {
        try {
            $reponse = $this->geminiService->generateConsultationResponse($consultation);

            $consultation->update([
                'reponse' => $reponse,
                'statut' => ConsultationStatut::Terminee,
            ]);
        } catch (\Throwable) {
            $consultation->update([
                'statut' => ConsultationStatut::Erreur,
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
