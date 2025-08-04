// src/types/registrant.ts

import z from "zod";

export interface Registrant {
  id: number;
  nim: string;
  student_name: string;
  study_program: string;
  tahun_akademik: string;
  semester: string;
  jenis_kegiatan: string;
  formatted_activity_type: string;
  jenis_kepesertaan?: string;
  lokasi: string;
  location_city: string;
  no_hp: string;
  status: RegistrantStatus;
  status_text: string;
  status_color: string;
  payment_status: PaymentStatus;
  payment_status_text: string;
  report_status: ReportStatus;
  report_status_text: string;
  grade?: string;
  created_at: string;
}

export interface DetailedRegistrant extends Registrant {
  ukuran_baju?: string;
  bukti_bayar?: string;
  bukti_bayar2?: string;
  tgl_bayar?: string;
  laporan?: string;
  link_kegiatan_magang?: string;
  btq?: string;
  nilai?: string;
  registration_duration: number;
  is_active_period: boolean;
  updated_at: string;
  student?: StudentInfo;
  logbooks_count: number;
}

export interface StudentInfo {
  nim: string;
  nama_lengkap: string;
  email?: string;
  jenis_kelamin?: string;
}

export type RegistrantStatus =
  | "pending_payment"
  | "active"
  | "awaiting_assessment"
  | "completed";
export type PaymentStatus = "paid" | "unpaid";
export type ReportStatus = "submitted" | "not_submitted";

export interface RegistrantsResponse {
  registrants: {
    data: Registrant[];
    pagination: PaginationInfo;
  };
  statistics: RegistrantStatistics;
  filters: FilterOptions;
}

export interface PaginationInfo {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number | null;
  to?: number | null;
}

export interface RegistrantStatistics {
  total_registrants: number;
  active_registrants: number;
  pending_payment: number;
  completed_registrants: number;
  awaiting_assessment: number;
  male_registrants: number;
  female_registrants: number;
  completion_rate: number;
  payment_rate: number;
}

export interface FilterOptions {
  academic_years: FilterOption[];
  semesters: FilterOption[];
  activity_types: FilterOption[];
  study_programs: FilterOption[];
  locations: FilterOption[];
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface RegistrantsParams {
  page?: number;
  per_page?: number;
  tahun_akademik?: string;
  semester?: string;
  jenis_kegiatan?: string;
  lokasi?: string;
  id_prodi?: string;
  status?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
}

export interface CreateRegistrantData {
  nim: string;
  id_prodi: number;
  tahun_akademik: string;
  semester: "Ganjil" | "Genap";
  jenis_kegiatan: string;
  jenis_kepesertaan?: string;
  lokasi: string;
  no_hp: string;
  ukuran_baju?: string;
  btq?: string;
  link_kegiatan_magang?: string;
  tanggal_bayar: string;
}

export interface UpdateRegistrantData extends Partial<CreateRegistrantData> {
  nilai?: string;
}

export interface ActivityTypeDistribution {
  activity_type: string;
  formatted_name: string;
  total: number;
  paid: number;
  completed: number;
  pending: number;
}

export interface LocationDistribution {
  location: string;
  city: string;
  total: number;
}

export interface MonthlyTrend {
  year: number;
  month: number;
  month_name: string;
  total: number;
  paid: number;
  unpaid: number;
}

export interface DashboardSummary {
  statistics: RegistrantStatistics;
  activity_types_distribution: ActivityTypeDistribution[];
  top_locations: LocationDistribution[];
  monthly_trends: MonthlyTrend[];
}

export interface BulkActionData {
  registrant_ids: number[];
  status?: "approve" | "reject" | "activate";
}

export interface UploadResponse {
  file_path: string;
  registrant: DetailedRegistrant;
}

export interface RegistrantsResponse {
  registrants: {
    data: Registrant[];
    pagination: PaginationInfo;
  };
  statistics: RegistrantStatistics;
  filters: FilterOptions;
  active_setting?: {
    tahun_akademik: string;
    semester: string;
    tgl_mulai: string;
    tgl_berakhir: string;
  };
}

export const registrantSchema = z.object({
  nim: z
    .string()
    .min(1, "NIM wajib diisi")
    .regex(/^\d{8}$/, "NIM harus berupa angka 8 digit"),
  student_name: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  no_hp: z
    .string()
    .min(1, "Nomor HP wajib diisi")
    .regex(
      /^(\+62|62|0)[0-9]{9,13}$/,
      "Format nomor HP tidak valid (contoh: 08123456789)"
    ),
  ukuran_baju: z.string().min(1, "Ukuran baju wajib diisi"),
  id_prodi: z.string().min(1, "Program studi wajib dipilih"),
  tahun_akademik: z.string().min(1, "Tahun akademik wajib dipilih"),
  semester: z.string().min(1, "Semester wajib dipilih"),
  jenis_kegiatan: z.string().min(1, "Jenis kegiatan wajib dipilih"),
  id_tempat: z.string().min(1, "Tempat kegiatan wajib dipilih"),
  tanggal_bayar: z
    .string()
    .min(1, "Tanggal bayar wajib diisi")
    .refine((date) => {
      const paymentDate = new Date(date);
      const today = new Date();
      return paymentDate <= today;
    }, "Tanggal bayar tidak boleh lebih dari hari ini"),
  lokasi: z
    .string()
    .min(3, "Lokasi minimal 3 karakter")
    .max(100, "Lokasi maksimal 100 karakter"),
  alamat_lokasi: z
    .string()
    .min(10, "Alamat minimal 10 karakter")
    .max(255, "Alamat maksimal 255 karakter"),
  keterangan: z
    .string()
    .max(500, "Keterangan maksimal 500 karakter")
    .optional(),
});

export const fileSchema = z.object({
  bukti_bayar: z
    .instanceof(File, { message: "Bukti pembayaran wajib diupload" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran file maksimal 5MB")
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(
          file.type
        ),
      "Format file harus JPG, PNG, atau PDF"
    ),
  bukti_btq: z
    .instanceof(File, { message: "Bukti BTQ wajib diupload" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran file maksimal 5MB")
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(
          file.type
        ),
      "Format file harus JPG, PNG, atau PDF"
    ),
  surat_rekomendasi: z
    .instanceof(File, { message: "Surat rekomendasi wajib diupload" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran file maksimal 5MB")
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(
          file.type
        ),
      "Format file harus JPG, PNG, atau PDF"
    ),
});
