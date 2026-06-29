<?php

namespace Tests\Unit;

use App\Services\RegulatoryDocumentSelector;
use Tests\TestCase;

class RegulatoryDocumentSelectorTest extends TestCase
{
    public function test_creation_thematique_selects_primary_document_only(): void
    {
        $selector = new RegulatoryDocumentSelector;

        $primary = $selector->selectPrimaryForThematique('Création d\'entreprise');

        $this->assertSame('Guide-de-creation-dentreprise-OMPIC.pdf', $primary);
    }

    public function test_unknown_thematique_falls_back_to_first_catalog_document(): void
    {
        $selector = new RegulatoryDocumentSelector;

        $primary = $selector->selectPrimaryForThematique('Autre');

        $this->assertSame(config('gemini.documents.0'), $primary);
    }

    public function test_resolve_primary_path_finds_existing_pdf(): void
    {
        $selector = new RegulatoryDocumentSelector;

        $path = $selector->resolvePrimaryPath('Création d\'entreprise');

        $this->assertNotNull($path);
        $this->assertFileExists($path);
    }
}
