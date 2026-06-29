<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreConversationRequest;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\ConversationResource;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Services\ConversationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ConversationController extends Controller
{
    public function store(StoreConversationRequest $request, ConversationService $conversationService): JsonResponse
    {
        $conversation = $conversationService->create(
            $request->user(),
            $request->validated(),
        );

        return (new ConversationResource($conversation))
            ->response()
            ->setStatusCode(201);
    }

    public function index(Request $request, ConversationService $conversationService): AnonymousResourceCollection
    {
        $conversations = $conversationService->listForUser($request->user());

        return ConversationResource::collection($conversations);
    }

    public function show(Conversation $conversation, ConversationService $conversationService): ConversationResource
    {
        $this->authorize('view', $conversation);

        return new ConversationResource(
            $conversationService->findWithMessages($conversation),
        );
    }

    public function storeMessage(
        StoreMessageRequest $request,
        Conversation $conversation,
        ConversationService $conversationService,
    ): JsonResponse {
        $this->authorize('addMessage', $conversation);

        $message = $conversationService->addMessage(
            $conversation,
            $request->validated(),
        );

        return (new MessageResource($message))
            ->response()
            ->setStatusCode(201);
    }
}
