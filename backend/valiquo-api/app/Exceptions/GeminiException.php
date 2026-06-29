<?php

namespace App\Exceptions;

use Exception;

class GeminiException extends Exception
{
    public static function missingApiKey(): self
    {
        return new self('GEMINI_API_KEY is not configured.');
    }

    public static function noDocumentsAvailable(string $thematique): self
    {
        return new self("No regulatory documents available for thematique: {$thematique}");
    }

    public static function documentNotFound(string $filename): self
    {
        return new self("Regulatory document not found: {$filename}");
    }

    public static function apiError(string $message, ?int $status = null): self
    {
        $prefix = $status ? "Gemini API error (HTTP {$status}): " : 'Gemini API error: ';

        return new self($prefix.$message);
    }

    public static function emptyResponse(): self
    {
        return new self('Gemini API returned an empty response.');
    }

    public static function timeout(): self
    {
        return new self('Gemini API request timed out.');
    }
}
