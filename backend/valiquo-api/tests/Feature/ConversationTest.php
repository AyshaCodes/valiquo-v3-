<?php

namespace Tests\Feature;

use App\Enums\MessageExpediteur;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ConversationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);

        Http::fake([
            '*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => 'Réponse coach simulée.'],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);
    }

    public function test_unauthenticated_users_cannot_access_conversations(): void
    {
        $this->postJson('/api/conversations', ['titre' => 'Test'])->assertUnauthorized();
        $this->getJson('/api/conversations')->assertUnauthorized();
    }

    public function test_user_can_create_conversation(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $response = $this->actingAs($user)->postJson('/api/conversations', [
            'titre' => 'Création SARL',
        ]);

        $response->assertCreated()
            ->assertJsonPath('titre', 'Création SARL');

        $this->assertDatabaseHas('conversations', [
            'user_id' => $user->id,
            'titre' => 'Création SARL',
        ]);
    }

    public function test_create_conversation_requires_titre(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $this->actingAs($user)->postJson('/api/conversations', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['titre']);
    }

    public function test_user_can_list_conversations_with_metadata(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $conversation = Conversation::factory()->for($user)->create(['titre' => 'Fiscalité']);
        $latest = Message::factory()->for($conversation)->create([
            'contenu' => 'Dernier message',
            'expediteur' => MessageExpediteur::Coach,
            'created_at' => now(),
        ]);
        Message::factory()->for($conversation)->create([
            'created_at' => now()->subHour(),
        ]);

        Conversation::factory()->count(2)->create();

        $response = $this->actingAs($user)->getJson('/api/conversations');

        $response->assertSuccessful()
            ->assertJsonCount(1)
            ->assertJsonPath('0.id', $conversation->id)
            ->assertJsonPath('0.messages_count', 2)
            ->assertJsonPath('0.latest_message.contenu', 'Dernier message');
    }

    public function test_user_can_view_conversation_with_messages_in_order(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $conversation = Conversation::factory()->for($user)->create();
        $first = Message::factory()->for($conversation)->create(['created_at' => now()->subMinutes(2)]);
        $second = Message::factory()->for($conversation)->create(['created_at' => now()->subMinute()]);

        $response = $this->actingAs($user)->getJson("/api/conversations/{$conversation->id}");

        $response->assertSuccessful()
            ->assertJsonPath('id', $conversation->id)
            ->assertJsonPath('messages.0.id', $first->id)
            ->assertJsonPath('messages.1.id', $second->id);
    }

    public function test_user_cannot_view_another_users_conversation(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $conversation = Conversation::factory()->create();

        $this->actingAs($user)->getJson("/api/conversations/{$conversation->id}")
            ->assertForbidden();
    }

    public function test_user_can_add_message_to_own_conversation(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $conversation = Conversation::factory()->for($user)->create();

        $response = $this->actingAs($user)->postJson("/api/conversations/{$conversation->id}/messages", [
            'contenu' => 'Comment créer une SARL ?',
            'expediteur' => 'user',
        ]);

        $response->assertCreated()
            ->assertJsonPath('contenu', 'Comment créer une SARL ?')
            ->assertJsonPath('expediteur', 'user');

        $this->assertDatabaseHas('messages', [
            'conversation_id' => $conversation->id,
            'contenu' => 'Comment créer une SARL ?',
        ]);
    }

    public function test_add_message_requires_validation(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $conversation = Conversation::factory()->for($user)->create();

        $this->actingAs($user)->postJson("/api/conversations/{$conversation->id}/messages", [
            'expediteur' => 'invalid',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['contenu', 'expediteur']);
    }

    public function test_user_cannot_add_message_to_another_users_conversation(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $conversation = Conversation::factory()->create();

        $this->actingAs($user)->postJson("/api/conversations/{$conversation->id}/messages", [
            'contenu' => 'Test',
            'expediteur' => 'user',
        ])->assertForbidden();
    }

    public function test_conversation_relationships(): void
    {
        $user = User::factory()->create();
        $conversation = Conversation::factory()->for($user)->create();
        Message::factory()->count(3)->for($conversation)->create();

        $this->assertCount(1, $user->conversations);
        $this->assertCount(3, $conversation->messages);
        $this->assertNotNull($conversation->latestMessage);
    }
}
