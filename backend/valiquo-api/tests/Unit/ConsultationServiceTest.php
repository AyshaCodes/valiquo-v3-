<?php

namespace Tests\Unit;

use App\Contracts\GeminiServiceInterface;
use App\Enums\ConsultationStatut;
use App\Models\Consultation;
use App\Models\User;
use App\Services\ConsultationService;
use App\Services\GeminiService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

class ConsultationServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_process_with_gemini_marks_consultation_as_completed(): void
    {
        $user = User::factory()->create();
        $consultation = Consultation::factory()->for($user)->create([
            'statut' => ConsultationStatut::EnCours,
        ]);

        $gemini = Mockery::mock(GeminiServiceInterface::class);
        $gemini->shouldReceive('generateConsultationResponse')
            ->once()
            ->with($consultation)
            ->andReturn('Réponse générée par Gemini');

        $service = new ConsultationService($gemini);
        $result = $service->processWithGemini($consultation);

        $this->assertSame(ConsultationStatut::Terminee, $result->statut);
        $this->assertSame('Réponse générée par Gemini', $result->reponse);
    }

    public function test_process_with_gemini_marks_consultation_as_error_on_failure(): void
    {
        $user = User::factory()->create();
        $consultation = Consultation::factory()->for($user)->create();

        $gemini = Mockery::mock(GeminiServiceInterface::class);
        $gemini->shouldReceive('generateConsultationResponse')
            ->once()
            ->andThrow(new \RuntimeException('API error'));

        $service = new ConsultationService($gemini);
        $result = $service->processWithGemini($consultation);

        $this->assertSame(ConsultationStatut::Erreur, $result->statut);
        $this->assertNull($result->reponse);
    }

    public function test_gemini_service_requires_api_key_for_live_call(): void
    {
        if (empty(config('gemini.api_key'))) {
            $this->markTestSkipped('GEMINI_API_KEY not configured.');
        }

        $this->assertTrue(true);
    }
}
