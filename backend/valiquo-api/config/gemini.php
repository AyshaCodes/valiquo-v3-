<?php

return [

    'api_key' => env('GEMINI_API_KEY'),

    'model' => env('GEMINI_MODEL', 'gemini-2.0-flash-lite'),

    'base_url' => env('GEMINI_BASE_URL', 'https://generativelanguage.googleapis.com/v1beta'),

    'timeout' => (int) env('GEMINI_TIMEOUT', 120),

    'max_document_chars' => (int) env('GEMINI_MAX_DOCUMENT_CHARS', 120_000),

    'documents_path' => storage_path('app/regulatory-docs'),

    'text_cache_path' => storage_path('app/regulatory-docs-text'),

    'system_instruction' => <<<'TEXT'
Tu es Coach Valiquo, un assistant spécialisé en droit des affaires et réglementation marocaine. Réponds uniquement en te basant sur les documents officiels fournis. Réponds en français, de façon claire et structurée avec des étapes numérotées quand c'est pertinent. Si l'information n'est pas dans les documents fournis, dis-le clairement plutôt que d'inventer.
TEXT,

    /*
    |--------------------------------------------------------------------------
    | Regulatory document catalogue
    |--------------------------------------------------------------------------
    */
    'documents' => [
        'CG-2024-fr.pdf',
        'CRI-Invest-Guide-utilisateur-v-28-10-2020-1-32.pdf',
        'Guide-Auto-entrepreneur-Fr-1_1.pdf',
        'Guide-de-creation-dentreprise-OMPIC.pdf',
        'loi 5-96 sarl.pdf',
        'Loi n° 17-95.pdf',
        'Note-Circulaire735LF2024.pdf',
    ],

    /*
    |--------------------------------------------------------------------------
    | Thematique → relevant PDF filenames
    |--------------------------------------------------------------------------
    */
    'thematique_documents' => [
        'Création d\'entreprise' => [
            'Guide-de-creation-dentreprise-OMPIC.pdf',
            'CRI-Invest-Guide-utilisateur-v-28-10-2020-1-32.pdf',
        ],
        'Fiscalité' => [
            'Note-Circulaire735LF2024.pdf',
            'CG-2024-fr.pdf',
        ],
        'Statuts juridiques' => [
            'loi 5-96 sarl.pdf',
            'Loi n° 17-95.pdf',
        ],
        'Procédures OMPIC' => [
            'Guide-de-creation-dentreprise-OMPIC.pdf',
        ],
        'CNSS & Social' => [
            'Guide-Auto-entrepreneur-Fr-1_1.pdf',
        ],
    ],

];
