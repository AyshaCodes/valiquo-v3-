import { ApiError } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

function getXsrfToken(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
  if (!match) return null;
  return decodeURIComponent(match[1]);
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      data.message ?? 'Une erreur est survenue',
      response.status,
      data.errors,
    );
  }

  return data as T;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const xsrf = getXsrfToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(xsrf ? { 'X-XSRF-TOKEN': xsrf } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers,
  });

  return parseResponse<T>(response);
}

export async function getCsrfCookie(): Promise<void> {
  await apiFetch('/sanctum/csrf-cookie');
}

export const authApi = {
  async getUser() {
    return apiFetch<import('../types/auth').User>('/api/user');
  },

  async login(email: string, password: string) {
    await getCsrfCookie();
    return apiFetch<void>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(data: import('../types/auth').RegisterData) {
    await getCsrfCookie();
    return apiFetch<void>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        password_confirmation: data.password,
      }),
    });
  },

  async logout() {
    await getCsrfCookie();
    return apiFetch<void>('/api/auth/logout', { method: 'POST' });
  },
};

export function formatValidationErrors(errors?: Record<string, string[]>): string {
  if (!errors) return '';
  return Object.values(errors).flat().join(' ');
}

export interface ConsultationData {
  id: number;
  question: string;
  thematique: string;
  ville: string;
  statut: 'en_attente' | 'en_cours' | 'terminee' | 'erreur';
  reponse: string | null;
  created_at: string;
}

export interface ConversationData {
  id: number;
  title: string | null;
  created_at: string;
}

export interface MessageData {
  id: number;
  content: string;
  role: 'user' | 'assistant';
  created_at: string;
}

export const consultationApi = {
  async create(data: { question: string; thematique: string; ville: string }): Promise<ConsultationData> {
    // Use authenticated endpoint when logged in
    return apiFetch<ConsultationData>('/api/consultations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async get(id: number): Promise<ConsultationData> {
    return apiFetch<ConsultationData>(`/api/consultations/${id}`);
  },
};

export const conversationApi = {
  async create(title?: string): Promise<ConversationData> {
    return apiFetch<ConversationData>('/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  },

  async getAll(): Promise<ConversationData[]> {
    return apiFetch<ConversationData[]>('/api/conversations');
  },

  async get(id: number): Promise<ConversationData & { messages: MessageData[] }> {
    return apiFetch<ConversationData & { messages: MessageData[] }>(`/api/conversations/${id}`);
  },

  async sendMessage(conversationId: number, content: string): Promise<MessageData> {
    return apiFetch<MessageData>(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
};
