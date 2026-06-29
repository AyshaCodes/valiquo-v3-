<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreConsultationRequest;
use App\Http\Resources\ConsultationResource;
use App\Models\Consultation;
use App\Services\ConsultationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ConsultationController extends Controller
{
    public function store(StoreConsultationRequest $request, ConsultationService $consultationService): JsonResponse
    {
        $consultation = $consultationService->create(
            $request->user(),
            $request->validated(),
        );

        return (new ConsultationResource($consultation))
            ->response()
            ->setStatusCode(201);
    }

    public function index(Request $request, ConsultationService $consultationService): AnonymousResourceCollection
    {
        $consultations = $consultationService->paginateForUser($request->user());

        return ConsultationResource::collection($consultations);
    }

    public function show(Consultation $consultation): ConsultationResource
    {
        $this->authorize('view', $consultation);

        return new ConsultationResource($consultation);
    }
}
