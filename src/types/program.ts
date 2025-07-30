export interface Program {
  id: number;
  name: string;
  formatted_name: string;
  slug: string;
  description: string;
  background: string;
  type: ProgramType;
  icon: string;
  status: 'Y' | 'N';
  status_text: string;
  status_color: string;
  registration_count: number;
  is_popular: boolean;
  created_at: string;
  updated_at: string;
}

export interface DetailedProgram extends Program {
  active_registration_count: number;
  completed_registration_count: number;
  has_registrations: boolean;
  recent_registrations: RecentRegistration[];
  registration_trends: RegistrationTrend[];
}

export interface RecentRegistration {
  id: number;
  nim: string;
  student_name: string;
  status: RegistrationStatus;
  registered_at: string;
}

export interface RegistrationTrend {
  month: string;
  count: number;
}

export type ProgramType = 
  | 'internship'
  | 'community_service'
  | 'research'
  | 'exchange'
  | 'entrepreneurship'
  | 'teaching'
  | 'other';

export type RegistrationStatus = 
  | 'completed'
  | 'awaiting_assessment'
  | 'active'
  | 'pending_payment';

export interface ProgramsResponse {
  programs: {
    data: Program[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number;
      to: number;
    };
  };
  statistics: ProgramStatistics;
  filters: ProgramFilters;
}

export interface ProgramStatistics {
  total_programs: number;
  active_programs: number;
  inactive_programs: number;
  programs_with_registrations: number;
  programs_without_registrations: number;
  total_registrations: number;
  active_percentage: number;
  registration_percentage: number;
}

export interface ProgramFilters {
  statuses: FilterOption[];
  types: FilterOption[];
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface ProgramsParams {
  per_page?: number;
  page?: number;
  search?: string;
  status?: string;
  type?: string;
  date_from?: string;
  date_to?: string;
}

export interface CreateProgramData {
  nama_kegiatan: string;
  slug?: string;
  deskripsi?: string;
  background?: string;
  aktif?: 'Y' | 'N';
}

export interface UpdateProgramData extends Partial<CreateProgramData> {}

export interface BulkActionData {
  program_ids: number[];
  status?: 'Y' | 'N';
}

export interface ProgramTypesDistribution {
  type: ProgramType;
  count: number;
  programs: {
    id: number;
    name: string;
    status: 'Y' | 'N';
  }[];
}

export interface DashboardSummary {
  statistics: ProgramStatistics;
  popular_programs: Program[];
  recent_programs: Program[];
  types_distribution: ProgramTypesDistribution[];
}