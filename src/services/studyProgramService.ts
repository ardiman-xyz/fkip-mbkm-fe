import apiClient from "@/config/api";

export type { StudyProgramList } from "../types/studyProgram";

export const studyProgramService = {
  async getAllStudyProgram(): Promise<any> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: any;
      }>("/admin/study-program/");

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Gagal mengambil data prodi");
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Gagal mengambil data prodi"
        );
      }
      throw new Error("Network error. Periksa koneksi server.");
    }
  },
};
