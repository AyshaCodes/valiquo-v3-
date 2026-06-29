<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GeminiIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    public function test_consultation_store_processes_with_gemini_response(): void
    {
        Http::fake([
            '*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => '1. Rédiger les statuts de la SARL.'],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $user = User::factory()->create();
        $user->assignRole('user');

        $response = $this->actingAs($user)->postJson('/api/consultations', [
            'question' => 'Je veux créer une SARL à Casablanca, quelles sont les étapes ?',
            'thematique' => 'Création d\'entreprise',
            'ville' => 'Casablanca',
        ]);

        $response->assertCreated()
            ->assertJsonPath('statut', 'terminee')
            ->assertJsonPath('reponse', '1. Rédiger les statuts de la SARL.');

        Http::assertSent(fn ($request) => str_contains($request->url(), 'generativelanguage.googleapis.com'));
    }

    public function test_user_message_triggers_coach_reply(): void
    {
        Http::fake([
            '*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => 'Voici les étapes pour créer une SARL au Maroc.'],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $user = User::factory()->create();
        $user->assignRole('user');

        $conversation = $this->actingAs($user)->postJson('/api/conversations', [
            'titre' => 'Création SARL',
        ])->json('id');

        $this->actingAs($user)->postJson("/api/conversations/{$conversation}/messages", [
            'contenu' => 'Comment créer une SARL ?',
            'expediteur' => 'user',
        ])->assertCreated();

        $this->actingAs($user)->getJson("/api/conversations/{$conversation}")
            ->assertSuccessful()
            ->assertJsonCount(2, 'messages')
            ->assertJsonPath('messages.1.expediteur', 'coach')
            ->assertJsonPath('messages.1.contenu', 'Voici les étapes pour créer une SARL au Maroc.');
    }

    public function test_consultation_marks_error_when_gemini_fails(): void
    {
        Http::fake([
            '*' => Http::response([
                'error' => ['message' => 'API key not valid. Please pass a valid API key.'],
            ], 400),
        ]);

        $user = User::factory()->create();
        $user->assignRole('user');

        $response = $this->actingAs($user)->postJson('/api/consultations', [
            'question' => 'Test question',
            'thematique' => 'Fiscalité',
        ]);

        $response->assertCreated()
            ->assertJsonPath('statut', 'erreur')
            ->assertJsonPath('reponse', null);
    }
}
