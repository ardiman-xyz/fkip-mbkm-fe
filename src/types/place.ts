export interface Place {
  id: number;
  nama_sekolah: string;
  formatted_name: string;
  alamat: string;
  kuota: number;
  status: '1' | '0';
  status_text: string;
  status_color: string;
  has_quota: boolean;
}

export interface PlacesResponse {
  places: {
    data: Place[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number;
      to: number;
    };
  };
  statistics: PlaceStatistics;
  filters: PlaceFilters;
}

export interface PlaceStatistics {
  total_places: number;
  active_places: number;
  inactive_places: number;
  places_with_quota: number;
  places_without_quota: number;
  total_quota: number;
  active_percentage: number;
  quota_percentage: number;
}

export interface PlaceFilters {
  statuses: FilterOption[];
  quotas: FilterOption[];
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface PlacesParams {
  per_page?: number;
  page?: number;
  search?: string;
  status?: string;
  quota?: string;
}

export interface CreatePlaceData {
  nama_sekolah: string;
  alamat: string;
  kuota: number;
  status?: '1' | '0';
}

export interface UpdatePlaceData extends Partial<CreatePlaceData> {}

export interface BulkPlaceActionData {
  place_ids: number[];
  status?: '1' | '0';
}
