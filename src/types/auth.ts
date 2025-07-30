export interface User {
  id: number;
  name: string;
  email: string;
  department_id?: number;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}
