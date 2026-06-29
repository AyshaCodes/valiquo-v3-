<?php

namespace App\Services;

class RegulatoryDocumentSelector
{
    /**
     * Return the single most relevant PDF for the given thematique.
     */
    public function selectPrimaryForThematique(string $thematique): ?string
    {
        $candidates = $this->selectCandidatesForThematique($thematique);

        return $candidates[0] ?? null;
    }

    /**
     * @return list<string> Ordered PDF filenames for the given thematique.
     */
    public function selectCandidatesForThematique(string $thematique): array
    {
        $mapped = config("gemini.thematique_documents.{$thematique}");

        if (is_array($mapped) && $mapped !== []) {
            return $mapped;
        }

        $documents = config('gemini.documents', []);

        return is_array($documents) ? $documents : [];
    }

    /**
     * Resolve the primary PDF path for a thematique.
     */
    public function resolvePrimaryPath(string $thematique): ?string
    {
        $filename = $this->selectPrimaryForThematique($thematique);

        if ($filename === null) {
            return null;
        }

        $paths = $this->resolvePaths([$filename]);

        return $paths[0] ?? null;
    }

    /**
     * @return list<string> Absolute paths to existing PDF files.
     */
    public function resolvePaths(array $filenames): array
    {
        $basePath = config('gemini.documents_path');
        $available = glob($basePath.DIRECTORY_SEPARATOR.'*.pdf') ?: [];
        $paths = [];

        foreach ($filenames as $filename) {
            $path = $basePath.DIRECTORY_SEPARATOR.$filename;

            if (is_file($path)) {
                $paths[] = $path;
                continue;
            }

            $normalizedTarget = $this->normalizeFilename($filename);

            foreach ($available as $candidate) {
                if ($this->normalizeFilename(basename($candidate)) === $normalizedTarget) {
                    $paths[] = $candidate;
                    break;
                }
            }
        }

        return array_values(array_unique($paths));
    }

    private function normalizeFilename(string $filename): string
    {
        $ascii = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $filename);

        return strtolower(preg_replace('/[^a-z0-9]+/i', '', $ascii ?: $filename) ?? '');
    }
}
