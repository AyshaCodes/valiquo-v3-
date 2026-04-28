<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\AsArrayObject;

class Country extends Model
{
    protected $fillable = [
        'code',
        'name',
        'currency',
        'language',
        'cities',
        'sectors',
        'economic_data',
    ];

    protected $casts = [
        'cities' => 'json',
        'sectors' => 'json',
        'economic_data' => 'json',
    ];
}
