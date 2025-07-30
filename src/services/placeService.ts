import type { 
  Place, 
  PlacesResponse, 
  PlacesParams,
  CreatePlaceData,
  UpdatePlaceData,
  BulkPlaceActionData,
  PlaceStatistics
} from "@/types/place";
import apiClient from "../config/api";

export const placeService = {
  // Get places with pagination and filters
  async getPlaces(params: PlacesParams = {}): Promise<PlacesResponse> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: PlacesResponse;
      }>("/admin/places", { params });
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal mengambil data tempat");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal mengambil data tempat");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Get place by ID
  async getPlaceById(id: number): Promise<Place> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: Place;
      }>(`/admin/places/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Tempat tidak ditemukan");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Tempat tidak ditemukan");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Get active places for dropdown
  async getActivePlaces(): Promise<Place[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: Place[];
      }>("/admin/places/active");
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal mengambil tempat aktif");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal mengambil tempat aktif");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Search places
  async searchPlaces(query: string): Promise<Place[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: Place[];
      }>("/admin/places/search", { 
        params: { q: query } 
      });
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal mencari tempat");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal mencari tempat");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Get places with available quota
  async getPlacesWithQuota(): Promise<Place[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: Place[];
      }>("/admin/places/with-quota");
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal mengambil tempat dengan kuota");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal mengambil tempat dengan kuota");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Get place statistics
  async getPlaceStatistics(): Promise<PlaceStatistics> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: PlaceStatistics;
      }>("/admin/places/statistics");
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal mengambil statistik");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal mengambil statistik");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Create place
  async createPlace(data: CreatePlaceData): Promise<Place> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: Place;
      }>("/admin/places", data);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal membuat tempat");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal membuat tempat");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Update place
  async updatePlace(id: number, data: UpdatePlaceData): Promise<Place> {
    try {
      const response = await apiClient.put<{
        success: boolean;
        message: string;
        data: Place;
      }>(`/admin/places/${id}`, data);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal memperbarui tempat");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal memperbarui tempat");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Delete place
  async deletePlace(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<{
        success: boolean;
        message: string;
      }>(`/admin/places/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Gagal menghapus tempat");
      }
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal menghapus tempat");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Toggle place status
  async togglePlaceStatus(id: number): Promise<{ id: number; status: '1' | '0'; status_text: string }> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: { id: number; status: '1' | '0'; status_text: string };
      }>(`/admin/places/${id}/toggle-status`);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal mengubah status tempat");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal mengubah status tempat");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Bulk update status
  async bulkUpdateStatus(data: BulkPlaceActionData & { status: '1' | '0' }): Promise<string> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
      }>("/admin/places/bulk/update-status", data);
      
      if (response.data.success) {
        return response.data.message;
      }
      throw new Error(response.data.message || "Gagal memperbarui status");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal memperbarui status");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Bulk delete places
  async bulkDeletePlaces(data: BulkPlaceActionData): Promise<string> {
    try {
      const response = await apiClient.delete<{
        success: boolean;
        message: string;
      }>("/admin/places/bulk/delete", { data });
      
      if (response.data.success) {
        return response.data.message;
      }
      throw new Error(response.data.message || "Gagal menghapus tempat");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal menghapus tempat");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Batch operations
  async batchActivatePlaces(placeIds: number[]): Promise<string> {
    return this.bulkUpdateStatus({ place_ids: placeIds, status: '1' });
  },

  async batchDeactivatePlaces(placeIds: number[]): Promise<string> {
    return this.bulkUpdateStatus({ place_ids: placeIds, status: '0' });
  }
};