<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CountryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $countries = Country::all();
        return response()->json($countries);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $code): JsonResponse
    {
        $country = Country::where('code', $code)->first();
        
        if (!$country) {
            return response()->json(['error' => 'Country not found'], 404);
        }
        
        return response()->json($country);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|max:2|unique:countries',
            'name' => 'required|string|max:255',
            'currency' => 'required|string|max:3',
            'language' => 'required|string|max:2',
            'cities' => 'required|array',
            'sectors' => 'required|array',
            'economic_data' => 'required|array',
        ]);

        $country = Country::create($validated);
        return response()->json($country, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $code): JsonResponse
    {
        $country = Country::where('code', $code)->first();
        
        if (!$country) {
            return response()->json(['error' => 'Country not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'currency' => 'sometimes|string|max:3',
            'language' => 'sometimes|string|max:2',
            'cities' => 'sometimes|array',
            'sectors' => 'sometimes|array',
            'economic_data' => 'sometimes|array',
        ]);

        $country->update($validated);
        return response()->json($country);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $code): JsonResponse
    {
        $country = Country::where('code', $code)->first();
        
        if (!$country) {
            return response()->json(['error' => 'Country not found'], 404);
        }

        $country->delete();
        return response()->json(null, 204);
    }
}
