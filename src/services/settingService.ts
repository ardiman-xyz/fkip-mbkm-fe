import type { 
  Setting, 
  SettingsResponse, 
  SettingsParams,
  CreateSettingData,
  UpdateSettingData,
  SettingStatistics
} from "@/types/setting";
import apiClient from "../config/api";

export const settingService = {
  // Get settings with pagination and filters
  async getSettings(params: SettingsParams = {}): Promise<SettingsResponse> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: SettingsResponse;
      }>("/admin/settings", { params });
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal mengambil data pengaturan");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal mengambil data pengaturan");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Get setting by ID
  async getSettingById(id: number): Promise<Setting> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: Setting;
      }>(`/admin/settings/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Pengaturan tidak ditemukan");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Pengaturan tidak ditemukan");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Get current active setting
  async getCurrentSetting(): Promise<Setting> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: Setting;
      }>("/admin/settings/current");
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Tidak ada pengaturan aktif");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Tidak ada pengaturan aktif");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Get latest setting
  async getLatestSetting(): Promise<Setting> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: Setting;
      }>("/admin/settings/latest");
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Tidak ada pengaturan ditemukan");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Tidak ada pengaturan ditemukan");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Get setting statistics
  async getSettingStatistics(): Promise<SettingStatistics> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: SettingStatistics;
      }>("/admin/settings/statistics");
      
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

  // Create setting
  async createSetting(data: CreateSettingData): Promise<Setting> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: Setting;
      }>("/admin/settings", data);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal membuat pengaturan");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal membuat pengaturan");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Update setting
  async updateSetting(id: number, data: UpdateSettingData): Promise<Setting> {
    try {
      const response = await apiClient.put<{
        success: boolean;
        message: string;
        data: Setting;
      }>(`/admin/settings/${id}`, data);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal memperbarui pengaturan");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal memperbarui pengaturan");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Delete setting
  async deleteSetting(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<{
        success: boolean;
        message: string;
      }>(`/admin/settings/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Gagal menghapus pengaturan");
      }
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal menghapus pengaturan");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Toggle setting status
  async toggleSettingStatus(id: number): Promise<{ id: number; status: 'Y' | 'N'; status_text: string }> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: { id: number; status: 'Y' | 'N'; status_text: string };
      }>(`/admin/settings/${id}/toggle-status`);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal mengubah status");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal mengubah status");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Toggle school status
  async toggleSchoolStatus(id: number): Promise<{ id: number; status_sekolah: 'Y' | 'N'; status_sekolah_text: string }> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: { id: number; status_sekolah: 'Y' | 'N'; status_sekolah_text: string };
      }>(`/admin/settings/${id}/toggle-school-status`);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal mengubah status sekolah");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal mengubah status sekolah");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Activate setting
  async activateSetting(id: number): Promise<string> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
      }>(`/admin/settings/${id}/activate`);
      
      if (response.data.success) {
        return response.data.message;
      }
      throw new Error(response.data.message || "Gagal mengaktifkan pengaturan");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal mengaktifkan pengaturan");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  }
};