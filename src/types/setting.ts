export interface Setting {
  id: number;
  tahun: number;
  tahun_akademik: string;
  formatted_tahun_akademik: string;
  semester: 'Ganjil' | 'Genap';
  semester_text: string;
  tgl_mulai: string;
  tgl_berakhir: string;
  tgl_pembekalan?: string;
  tgl_penarikan?: string;
  ket?: string;
  status: 'Y' | 'N';
  status_text: string;
  status_sekolah: 'Y' | 'N';
  status_sekolah_text: string;
  updated_at: string;
  is_active_period?: boolean;
  is_registration_open?: boolean;
  days_remaining?: number;
  period_duration?: number;
}

export interface SettingsResponse {
  settings: {
    data: Setting[];
    pagination: PaginationData;
  };
  statistics: SettingStatistics;
  filters: SettingFilters;
}

export interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface SettingStatistics {
  total_settings: number;
  active_settings: number;
  inactive_settings: number;
  current_year_settings: number;
  active_periods: number;
  active_percentage: number;
}

export interface SettingFilters {
  years: number[];
  academic_years: string[];
  semesters: FilterOption[];
  statuses: FilterOption[];
  school_statuses: FilterOption[];
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface SettingsParams {
  per_page?: number;
  page?: number;
  tahun?: string;
  semester?: string;
  status?: string;
  status_sekolah?: string;
  date_from?: string;
  date_to?: string;
}

export interface CreateSettingData {
  tahun: number;
  tahun_akademik: string;
  semester: 'Ganjil' | 'Genap';
  tgl_mulai: string;
  tgl_berakhir: string;
  tgl_pembekalan?: string;
  tgl_penarikan?: string;
  ket?: string;
  status?: 'Y' | 'N';
  status_sekolah?: 'Y' | 'N';
}

export interface UpdateSettingData extends Partial<CreateSettingData> {}