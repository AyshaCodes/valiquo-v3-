<?php

namespace App\Enums;

enum ConsultationStatut: string
{
    case EnCours = 'en_cours';
    case Terminee = 'terminee';
    case Erreur = 'erreur';
}
