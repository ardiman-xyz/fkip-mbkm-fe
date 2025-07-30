export interface Student {
  id: number;
  name: string;
  email: string;
  department_id?: number;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginFormData {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    student: Student;
    token: string;
  };
  error?: string;
}
