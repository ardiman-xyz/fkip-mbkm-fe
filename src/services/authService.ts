import type { LoginFormData, LoginResponse } from "@/types/auth";
import apiClient from "../config/api";

export const authService = {
  async login(credentials: LoginFormData): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        "/student/login",
        credentials
      );
      return response.data;
    } catch (error: any) {
      // Handle axios error
      if (error.response?.data) {
        return error.response.data;
      }

      // Handle network error
      throw new Error("Network error. Please check if the server is running.");
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  async refreshToken(): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/refresh");
    return response.data;
  },
};
