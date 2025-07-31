// src/services/registrantService.ts
import type { 
  Registrant,
  DetailedRegistrant,
  RegistrantsResponse, 
  RegistrantsParams,
  CreateRegistrantData,
  UpdateRegistrantData,
  RegistrantStatistics,
  ActivityTypeDistribution,
  LocationDistribution,
  MonthlyTrend,
  DashboardSummary,
  BulkActionData,
  UploadResponse,
  FilterOptions
} from "@/types/registrant";
import apiClient from "../config/api";


export const registrantService = {

  async getActiveRegistrants(params: Omit<RegistrantsParams, 'tahun_akademik' | 'semester'> = {}): Promise<RegistrantsResponse> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: RegistrantsResponse;
      }>("/admin/registrants/active", { params });
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal mengambil data pendaftar aktif");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal mengambil data pendaftar aktif");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Get registrants with pagination and filters
  async getRegistrants(params: RegistrantsParams = {}): Promise<RegistrantsResponse> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: RegistrantsResponse;
      }>("/admin/registrants", { params });
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal mengambil data pendaftar");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal mengambil data pendaftar");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Get registrant by ID
  async getRegistrantById(id: number): Promise<DetailedRegistrant> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: DetailedRegistrant;
      }>(`/admin/registrants/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Pendaftar tidak ditemukan");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Pendaftar tidak ditemukan");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Create registrant
  async createRegistrant(data: CreateRegistrantData): Promise<DetailedRegistrant> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: DetailedRegistrant;
      }>("/admin/registrants", data);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal membuat pendaftar");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal membuat pendaftar");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Update registrant
  async updateRegistrant(id: number, data: UpdateRegistrantData): Promise<DetailedRegistrant> {
    try {
      const response = await apiClient.put<{
        success: boolean;
        message: string;
        data: DetailedRegistrant;
      }>(`/admin/registrants/${id}`, data);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal memperbarui pendaftar");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal memperbarui pendaftar");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Delete registrant
  async deleteRegistrant(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<{
        success: boolean;
        message: string;
      }>(`/admin/registrants/${id}`);
      
      if (!response.data.success) {
        throw new Error(response.data.message || "Gagal menghapus pendaftar");
      }
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal menghapus pendaftar");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Get statistics
  async getStatistics(params: RegistrantsParams = {}): Promise<RegistrantStatistics> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: RegistrantStatistics;
      }>("/admin/registrants/statistics", { params });
      
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

  // Get activity types distribution
  async getActivityTypesDistribution(params: RegistrantsParams = {}): Promise<ActivityTypeDistribution[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: ActivityTypeDistribution[];
      }>("/admin/registrants/activity-types-distribution", { params });
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal mengambil distribusi jenis kegiatan");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal mengambil distribusi jenis kegiatan");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Get locations distribution
  async getLocationsDistribution(params: RegistrantsParams = {}): Promise<LocationDistribution[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: LocationDistribution[];
      }>("/admin/registrants/locations-distribution", { params });
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal mengambil distribusi lokasi");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal mengambil distribusi lokasi");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Get monthly trends
  async getMonthlyTrends(months: number = 12, params: RegistrantsParams = {}): Promise<MonthlyTrend[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: MonthlyTrend[];
      }>("/admin/registrants/monthly-trends", { 
        params: { ...params, months } 
      });
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal mengambil tren bulanan");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal mengambil tren bulanan");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Search registrants
  async searchRegistrants(query: string): Promise<Registrant[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: Registrant[];
      }>("/admin/registrants/search", { 
        params: { q: query } 
      });
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal mencari pendaftar");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal mencari pendaftar");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Upload payment proof
  async uploadPaymentProof(id: number, file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('payment_proof', file);

      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: UploadResponse;
      }>(`/admin/registrants/${id}/upload-payment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal upload bukti bayar");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal upload bukti bayar");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Upload report
  async uploadReport(id: number, file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('report', file);

      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: UploadResponse;
      }>(`/admin/registrants/${id}/upload-report`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal upload laporan");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal upload laporan");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Verify payment
  async verifyPayment(id: number): Promise<DetailedRegistrant> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: DetailedRegistrant;
      }>(`/admin/registrants/${id}/verify-payment`);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal verifikasi pembayaran");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal verifikasi pembayaran");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Reject payment
  async rejectPayment(id: number, reason: string): Promise<DetailedRegistrant> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: { registrant: DetailedRegistrant };
      }>(`/admin/registrants/${id}/reject-payment`, { reason });
      
      if (response.data.success) {
        return response.data.data.registrant;
      }
      throw new Error(response.data.message || "Gagal tolak pembayaran");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal tolak pembayaran");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Grade registrant
  async gradeRegistrant(id: number, grade: string): Promise<DetailedRegistrant> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: DetailedRegistrant;
      }>(`/admin/registrants/${id}/grade`, { grade });
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal beri nilai");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal beri nilai");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Bulk update status
  async bulkUpdateStatus(data: BulkActionData): Promise<{ updated_count: number }> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: { updated_count: number };
      }>("/admin/registrants/bulk/update-status", data);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal update status massal");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal update status massal");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Bulk delete
  async bulkDelete(registrant_ids: number[]): Promise<{ deleted_count: number }> {
    try {
      const response = await apiClient.delete<{
        success: boolean;
        message: string;
        data: { deleted_count: number };
      }>("/admin/registrants/bulk/delete", { 
        data: { registrant_ids } 
      });
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal hapus massal");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal hapus massal");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Export registrants
  async exportRegistrants(params: RegistrantsParams = {}): Promise<any[]> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: any[];
      }>("/admin/registrants/export", params);
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal export data");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal export data");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Get dashboard summary
  async getDashboardSummary(): Promise<DashboardSummary> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: DashboardSummary;
      }>("/admin/registrants/dashboard-summary");
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal mengambil ringkasan dashboard");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal mengambil ringkasan dashboard");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Get current period registrants
  async getCurrentPeriodRegistrants(): Promise<RegistrantsResponse & { current_setting: any }> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: RegistrantsResponse & { current_setting: any };
      }>("/admin/registrants/current-period");
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal mengambil data periode aktif");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal mengambil data periode aktif");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },

  // Get filter options
  async getFilterOptions(): Promise<FilterOptions> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: FilterOptions;
      }>("/admin/registrants/filter-options");
      
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal mengambil opsi filter");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Gagal mengambil opsi filter");
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },
};