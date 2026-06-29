<?php

namespace Tests\Unit;

use App\Services\RegulatoryDocumentSelector;
use App\Services\RegulatoryDocumentTextExtractor;
use Smalot\PdfParser\Parser;
use Tests\TestCase;

class RegulatoryDocumentTextExtractorTest extends TestCase
{
    public function test_extracts_and_caches_pdf_text(): void
    {
        $selector = new RegulatoryDocumentSelector;
        $path = $selector->resolvePrimaryPath('Création d\'entreprise');

        if ($path === null) {
            $this->markTestSkipped('Regulatory PDFs not available in storage.');
        }

        $extractor = new RegulatoryDocumentTextExtractor(new Parser);

        $first = $extractor->getTextForPdf($path);
        $second = $extractor->getTextForPdf($path);

        $this->assertNotSame('', trim($first));
        $this->assertSame($first, $second);
    }
}
