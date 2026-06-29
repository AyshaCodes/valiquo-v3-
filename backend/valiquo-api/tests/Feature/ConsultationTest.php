<?php

namespace Tests\Feature;

use App\Enums\ConsultationStatut;
use App\Enums\MessageExpediteur;
use App\Models\Consultation;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ConsultationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
        $this->fakeGeminiSuccess('Réponse réglementaire de test.');
    }

    private function fakeGeminiSuccess(string $text): void
    {
        Http::fake([
            '*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => $text],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);
    }

    public function test_unauthenticated_users_cannot_access_consultations(): void
    {
        $this->postJson('/api/consultations', [
            'question' => 'Test?',
            'thematique' => 'Fiscalité',
        ])->assertUnauthorized();

        $this->getJson('/api/consultations')->assertUnauthorized();
    }

    public function test_user_can_create_consultation(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $response = $this->actingAs($user)->postJson('/api/consultations', [
            'question' => 'Comment créer une SARL ?',
            'thematique' => 'Création d\'entreprise',
            'ville' => 'Casablanca',
        ]);

        $response->assertCreated()
            ->assertJsonPath('question', 'Comment créer une SARL ?')
            ->assertJsonPath('thematique', 'Création d\'entreprise')
            ->assertJsonPath('ville', 'Casablanca')
            ->assertJsonPath('statut', 'terminee')
            ->assertJsonPath('reponse', 'Réponse réglementaire de test.');

        $this->assertDatabaseHas('consultations', [
            'user_id' => $user->id,
            'statut' => ConsultationStatut::Terminee->value,
        ]);
    }

    public function test_create_consultation_requires_validation(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $this->actingAs($user)->postJson('/api/consultations', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['question', 'thematique']);
    }

    public function test_user_can_list_own_consultations_newest_first_paginated(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $older = Consultation::factory()->for($user)->create(['created_at' => now()->subDay()]);
        $newer = Consultation::factory()->for($user)->create(['created_at' => now()]);

        Consultation::factory()->count(10)->create();

        $response = $this->actingAs($user)->getJson('/api/consultations');

        $response->assertSuccessful()
            ->assertJsonPath('meta.per_page', 10)
            ->assertJsonPath('data.0.id', $newer->id)
            ->assertJsonPath('data.1.id', $older->id);
    }

    public function test_user_can_view_own_consultation(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $consultation = Consultation::factory()->for($user)->create();

        $this->actingAs($user)->getJson("/api/consultations/{$consultation->id}")
            ->assertSuccessful()
            ->assertJsonPath('id', $consultation->id);
    }

    public function test_user_cannot_view_another_users_consultation(): void
    {
        $user = User::factory()->create();
        $user->assignRole('user');

        $otherUser = User::factory()->create();
        $consultation = Consultation::factory()->for($otherUser)->create();

        $this->actingAs($user)->getJson("/api/consultations/{$consultation->id}")
            ->assertForbidden();
    }

    public function test_user_consultations_relationship(): void
    {
        $user = User::factory()->create();
        Consultation::factory()->count(2)->for($user)->create();

        $this->assertCount(2, $user->consultations);
    }
}
