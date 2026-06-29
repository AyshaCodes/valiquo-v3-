<?php

namespace App\Models;

use App\Enums\MessageExpediteur;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    /** @use HasFactory<\Database\Factories\MessageFactory> */
    use HasFactory;

    protected $fillable = [
        'conversation_id',
        'contenu',
        'expediteur',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'expediteur' => MessageExpediteur::class,
        ];
    }

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }
}
