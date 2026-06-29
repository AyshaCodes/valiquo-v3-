<?php

namespace App\Contracts;

use App\Models\Consultation;
use App\Models\Conversation;

interface GeminiServiceInterface
{
    /**
     * Generate a regulatory response from PDF context.
     */
    public function generateResponse(string $question, string $thematique, ?string $ville): string;

    /**
     * Generate a regulatory response for the given consultation.
     */
    public function generateConsultationResponse(Consultation $consultation): string;

    /**
     * Generate a coach reply using conversation history.
     */
    public function generateCoachResponse(Conversation $conversation, string $userMessage): string;
}
