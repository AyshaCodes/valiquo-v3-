<?php

namespace App\Services;

use App\Contracts\GeminiServiceInterface;
use App\Enums\MessageExpediteur;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class ConversationService
{
    public function __construct(
        private readonly GeminiServiceInterface $geminiService,
    ) {}

    public function create(User $user, array $data): Conversation
    {
        return Conversation::create([
            'user_id' => $user->id,
            'titre' => $data['titre'],
        ]);
    }

    /**
     * @return Collection<int, Conversation>
     */
    public function listForUser(User $user): Collection
    {
        return $user->conversations()
            ->withCount('messages')
            ->with('latestMessage')
            ->orderByDesc('updated_at')
            ->get();
    }

    public function findWithMessages(Conversation $conversation): Conversation
    {
        return $conversation->load(['messages' => fn ($query) => $query->orderBy('created_at')]);
    }

    /**
     * Add a message and, for user messages, generate a coach reply via Gemini synchronously.
     * In production, the coach reply should be generated in a queued job.
     */
    public function addMessage(Conversation $conversation, array $data): Message
    {
        $message = $conversation->messages()->create([
            'contenu' => $data['contenu'],
            'expediteur' => $data['expediteur'],
        ]);

        $conversation->touch();

        if ($this->isUserMessage($data['expediteur'])) {
            $this->generateCoachReply($conversation, $data['contenu']);
        }

        return $message;
    }

    private function isUserMessage(MessageExpediteur|string $expediteur): bool
    {
        if ($expediteur instanceof MessageExpediteur) {
            return $expediteur === MessageExpediteur::User;
        }

        return $expediteur === MessageExpediteur::User->value;
    }

    private function generateCoachReply(Conversation $conversation, string $userMessage): void
    {
        try {
            $reply = $this->geminiService->generateCoachResponse($conversation, $userMessage);

            $conversation->messages()->create([
                'contenu' => $reply,
                'expediteur' => MessageExpediteur::Coach,
            ]);

            $conversation->touch();
        } catch (\Throwable) {
            // Coach reply failure is non-blocking; the user message is still persisted.
        }
    }
}
