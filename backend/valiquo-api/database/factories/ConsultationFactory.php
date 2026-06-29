<?php

namespace Database\Factories;

use App\Enums\ConsultationStatut;
use App\Models\Consultation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Consultation>
 */
class ConsultationFactory extends Factory
{
    protected $model = Consultation::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'question' => fake()->sentence(),
            'reponse' => null,
            'thematique' => fake()->randomElement([
                'Création d\'entreprise',
                'Fiscalité',
                'CNSS & Social',
            ]),
            'ville' => fake()->randomElement(['Casablanca', 'Rabat', 'Marrakech']),
            'statut' => ConsultationStatut::EnCours,
        ];
    }
}
