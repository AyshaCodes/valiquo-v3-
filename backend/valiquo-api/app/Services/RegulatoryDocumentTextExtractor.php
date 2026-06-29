<?php

namespace App\Services;

use App\Exceptions\GeminiException;
use Smalot\PdfParser\Parser;

class RegulatoryDocumentTextExtractor
{
    public function __construct(
        private readonly Parser $parser,
    ) {}

    /**
     * Return cached plain text for a PDF, extracting when missing or stale.
     */
    public function getTextForPdf(string $pdfPath): string
    {
        if (! is_file($pdfPath)) {
            throw GeminiException::documentNotFound(basename($pdfPath));
        }

        $cachePath = $this->cachePathFor($pdfPath);
        $pdfModifiedAt = filemtime($pdfPath);

        if (
            is_file($cachePath)
            && filemtime($cachePath) >= $pdfModifiedAt
        ) {
            $cached = trim((string) file_get_contents($cachePath));

            if ($cached !== '') {
                return $cached;
            }
        }

        $text = $this->extractText($pdfPath);

        if ($text === '') {
            throw GeminiException::documentNotFound(basename($pdfPath).' (no extractable text)');
        }

        $this->writeCache($cachePath, $text);

        return $text;
    }

    /**
     * @param  list<string>  $pdfPaths
     * @return list<array{source: string, text: string}>
     */
    public function getTextsForPaths(array $pdfPaths): array
    {
        $documents = [];

        foreach ($pdfPaths as $path) {
            $documents[] = [
                'source' => basename($path),
                'text' => $this->getTextForPdf($path),
            ];
        }

        return $documents;
    }

    private function extractText(string $pdfPath): string
    {
        $pdf = $this->parser->parseFile($pdfPath);
        $text = trim(preg_replace('/\s+/u', ' ', $pdf->getText()) ?? '');

        return $this->truncate($text, (int) config('gemini.max_document_chars', 120_000));
    }

    private function cachePathFor(string $pdfPath): string
    {
        $cacheDir = config('gemini.text_cache_path');

        if (! is_dir($cacheDir)) {
            mkdir($cacheDir, 0755, true);
        }

        return $cacheDir.DIRECTORY_SEPARATOR.hash('sha256', basename($pdfPath)).'.txt';
    }

    private function writeCache(string $cachePath, string $text): void
    {
        file_put_contents($cachePath, $text);
    }

    private function truncate(string $text, int $maxChars): string
    {
        if (mb_strlen($text) <= $maxChars) {
            return $text;
        }

        return mb_substr($text, 0, $maxChars).'… [texte tronqué]';
    }
}
