<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CoachController extends Controller
{
    /**
     * Coach IA endpoint
     */
    public function chat(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $message = strtolower($request->message);
        $response = $this->generateCoachResponse($message);

        return response()->json([
            'response' => $response,
            'timestamp' => now()->toISOString(),
        ]);
    }

    /**
     * Génère une réponse du coach en fonction du message
     */
    private function generateCoachResponse(string $message): string
    {
        // Réponses prédéfinies selon les mots-clés
        if (str_contains($message, 'score') || str_contains($message, 'validation') || str_contains($message, 'résultat')) {
            return 'Un bon score de validation se situe au-delà de 70/100. En dessous de 60, je recommande de revoir le positionnement ou de tester un pivot avant d\'investir davantage.';
        }

        if (str_contains($message, 'marché') || str_contains($message, 'maroc') || str_contains($message, 'secteur') || str_contains($message, 'tendance')) {
            return 'Chaque marché a ses spécificités. Le Maroc est en pleine transformation digitale, la France a un écosystème mature, et le Canada combine innovation et accès au marché américain.';
        }

        if (str_contains($message, 'prix') || str_contains($message, 'tarif') || str_contains($message, 'facturer') || str_contains($message, 'combien')) {
            return 'Les prix varient selon les marchés : Maroc (150-500 MAD), France (15-50€), Canada (20-80 CAD). Adapte toujours au pouvoir d\'achat local.';
        }

        if (str_contains($message, 'pivot') || str_contains($message, 'changer') || str_contains($message, 'repositionner')) {
            return 'Un pivot n\'est pas un échec. C\'est une décision stratégique. Je recommande de conserver la technologie ou l\'expertise, et de tester un nouveau segment ou problème adjacent.';
        }

        if (str_contains($message, 'finance') || str_contains($message, 'invest') || str_contains($message, 'fonds') || str_contains($message, 'subvention')) {
            return 'Explore les programmes locaux : Maroc PME/Innov Invest, France Bpifrance, Canada SR&ED. Le bootstrapping reste la première étape recommandée.';
        }

        if (str_contains($message, 'client') || str_contains($message, 'utilisateur') || str_contains($message, 'cible') || str_contains($message, 'prospect')) {
            return 'Pour tes premiers clients, cible ton réseau immédiat, les groupes professionnels locaux, et propose une offre pilote avec accompagnement personnalisé.';
        }

        if (str_contains($message, 'international') || str_contains($message, 'étranger') || str_contains($message, 'global') || str_contains($message, 'pays')) {
            return 'L\'internationalisation demande une validation pays par pays. Commence par un marché où tu as des avantages (langue, réseau, connaissance) avant de t\'étendre.';
        }

        // Réponse par défaut
        return 'C\'est une excellente question. Je recommande de commencer par une validation terrain avec au minimum 15 entretiens qualitatifs. Cela te donnera des données concrètes pour affiner ton approche avant tout investissement majeur.';
    }
}
