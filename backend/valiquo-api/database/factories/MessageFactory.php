<?php

namespace Database\Factories;

use App\Enums\MessageExpediteur;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Message>
 */
class MessageFactory extends Factory
{
    protected $model = Message::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'conversation_id' => Conversation::factory(),
            'contenu' => fake()->paragraph(),
            'expediteur' => fake()->randomElement(MessageExpediteur::cases()),
        ];
    }
}
