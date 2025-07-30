import type { 
  Program, 
  DetailedProgram, 
  ProgramsResponse, 
  ProgramsParams,
  CreateProgramData,
  UpdateProgramData,
  BulkActionData,
  ProgramStatistics,
  ProgramTypesDistribution,
  DashboardSummary,
  ProgramType
} from "@/types/program";
import apiClient from "../config/api";

export const programService = {
  // Get programs with pagination and filters
  async getPrograms(params: ProgramsParams = {}): Promise<ProgramsResponse> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: ProgramsResponse;
      }>("/admin/programs", { params });
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch programs");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to fetch programs");
      }
      throw new Error("Network error. Please check if the server is running.");
    }
  },

  // Get program by ID
  async getProgramById(id: number): Promise<DetailedProgram> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: DetailedProgram;
      }>(`/admin/programs/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch program");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Program not found");
      }
      throw new Error("Network error. Please check if the server is running.");
    }
  },

  // Get active programs for dropdown
  async getActivePrograms(): Promise<Program[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: Program[];
      }>("/admin/programs/active");
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch active programs");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to fetch active programs");
      }
      throw new Error("Network error. Please check if the server is running.");
    }
  },

  // Search programs
  async searchPrograms(query: string): Promise<Program[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: Program[];
      }>("/admin/programs/search", { 
        params: { q: query } 
      });
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to search programs");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to search programs");
      }
      throw new Error("Network error. Please check if the server is running.");
    }
  },

  // Get programs by type
  async getProgramsByType(type: ProgramType): Promise<Program[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: Program[];
      }>(`/admin/programs/type/${type}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch programs by type");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to fetch programs by type");
      }
      throw new Error("Network error. Please check if the server is running.");
    }
  },

  // Get programs with statistics
  async getProgramsWithStats(): Promise<Program[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: Program[];
      }>("/admin/programs/with-stats");
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch programs with stats");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to fetch programs with stats");
      }
      throw new Error("Network error. Please check if the server is running.");
    }
  },

  // Get most popular programs
  async getMostPopularPrograms(limit: number = 5): Promise<Program[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: Program[];
      }>("/admin/programs/popular", { 
        params: { limit } 
      });
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch popular programs");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to fetch popular programs");
      }
      throw new Error("Network error. Please check if the server is running.");
    }
  },

  // Get program types distribution
  async getProgramTypesDistribution(): Promise<ProgramTypesDistribution[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: ProgramTypesDistribution[];
      }>("/admin/programs/types-distribution");
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch types distribution");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to fetch types distribution");
      }
      throw new Error("Network error. Please check if the server is running.");
    }
  },

  // Get dashboard summary
  async getDashboardSummary(): Promise<DashboardSummary> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: DashboardSummary;
      }>("/admin/programs/dashboard-summary");
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch dashboard summary");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to fetch dashboard summary");
      }
      throw new Error("Network error. Please check if the server is running.");
    }
  },

  // Get program statistics
  async getProgramStatistics(): Promise<ProgramStatistics> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: ProgramStatistics;
      }>("/admin/programs/statistics");
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch statistics");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to fetch statistics");
      }
      throw new Error("Network error. Please check if the server is running.");
    }
  },

  // Create program
  async createProgram(data: CreateProgramData): Promise<DetailedProgram> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: DetailedProgram;
      }>("/admin/programs", data);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to create program");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to create program");
      }
      throw new Error("Network error. Please check if the server is running.");
    }
  },

  // Update program
  async updateProgram(id: number, data: UpdateProgramData): Promise<DetailedProgram> {
    try {
      const response = await apiClient.put<{
        success: boolean;
        message: string;
        data: DetailedProgram;
      }>(`/admin/programs/${id}`, data);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update program");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to update program");
      }
      throw new Error("Network error. Please check if the server is running.");
    }
  },

  // Delete program
  async deleteProgram(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<{
        success: boolean;
        message: string;
      }>(`/admin/programs/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete program");
      }
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to delete program");
      }
      throw new Error("Network error. Please check if the server is running.");
    }
  },

  // Toggle program status
  async toggleProgramStatus(id: number): Promise<{ id: number; status: 'Y' | 'N'; status_text: string }> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: { id: number; status: 'Y' | 'N'; status_text: string };
      }>(`/admin/programs/${id}/toggle-status`);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to toggle program status");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to toggle program status");
      }
      throw new Error("Network error. Please check if the server is running.");
    }
  },

  // Clone program
  async cloneProgram(id: number, overrides: Partial<CreateProgramData> = {}): Promise<DetailedProgram> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: DetailedProgram;
      }>(`/admin/programs/${id}/clone`, overrides);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to clone program");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to clone program");
      }
      throw new Error("Network error. Please check if the server is running.");
    }
  },

  // Bulk update status
  async bulkUpdateStatus(data: BulkActionData & { status: 'Y' | 'N' }): Promise<string> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
      }>("/admin/programs/bulk/update-status", data);
      
      if (response.data.success) {
        return response.data.message;
      }
      throw new Error(response.data.message || "Failed to bulk update status");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to bulk update status");
      }
      throw new Error("Network error. Please check if the server is running.");
    }
  },

  // Bulk delete programs
  async bulkDeletePrograms(data: BulkActionData): Promise<string> {
    try {
      const response = await apiClient.delete<{
        success: boolean;
        message: string;
      }>("/admin/programs/bulk/delete", { data });
      
      if (response.data.success) {
        return response.data.message;
      }
      throw new Error(response.data.message || "Failed to bulk delete programs");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to bulk delete programs");
      }
      throw new Error("Network error. Please check if the server is running.");
    }
  },

  // Export programs
  async exportPrograms(params: ProgramsParams = {}): Promise<any[]> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: any[];
      }>("/admin/programs/export", params);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to export programs");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Failed to export programs");
      }
      throw new Error("Network error. Please check if the server is running.");
    }
  }
};