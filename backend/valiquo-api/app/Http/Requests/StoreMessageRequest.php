<?php

namespace App\Http\Requests;

use App\Enums\MessageExpediteur;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'contenu' => ['required', 'string'],
            'expediteur' => ['required', 'string', Rule::enum(MessageExpediteur::class)],
        ];
    }
}
