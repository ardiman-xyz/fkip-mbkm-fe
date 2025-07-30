import type { AdminLoginFormData, AdminLoginResponse } from "@/types/authAdmin";
import apiClient from "../config/api";

export const adminAuthService = {
  async login(credentials: AdminLoginFormData): Promise<AdminLoginResponse> {
    try {
      const response = await apiClient.post<AdminLoginResponse>(
        "/admin/login",
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
      await apiClient.post("/admin/logout");
    } catch (error) {
      console.error("Admin logout error:", error);
    }
  },

  async refreshToken(): Promise<AdminLoginResponse> {
    const response = await apiClient.post<AdminLoginResponse>("/admin/refresh");
    return response.data;
  },
};
