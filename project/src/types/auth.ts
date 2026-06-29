export interface User {
  id: number;
  name: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  city: string | null;
  roles: string[];
  permissions: string[];
  email_verified_at: string | null;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  city?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
