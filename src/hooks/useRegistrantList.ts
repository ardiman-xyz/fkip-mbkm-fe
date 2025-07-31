// src/hooks/useRegistrantList.ts
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { registrantService } from '@/services/registrantService';
import type { 
  Registrant, 
  RegistrantsParams, 
  RegistrantStatistics,
  PaginationInfo 
} from '@/types/registrant';

interface UseRegistrantListReturn {
  // Data states
  registrants: Registrant[];
  statistics: RegistrantStatistics | null;
  pagination: PaginationInfo | null;
  
  // Loading states
  loading: boolean;
  refreshing: boolean;
  error: string;
  
  // Filter states
  params: RegistrantsParams;
  
  // Actions
  actions: {
    setAcademicYear: (year: string) => void;
    setSemester: (semester: string) => void;
    setSearch: (search: string) => void;
    setProgram: (program: string) => void;
    setSchool: (school: string) => void;
    setStatus: (status: string) => void;
    setLocation: (location: string) => void;
    setCurrentPage: (page: number) => void;
    setPerPage: (perPage: number) => void;
    clearFilters: () => void;
    refresh: () => void;
    fetchData: (showLoading?: boolean) => Promise<void>;
    exportData: () => Promise<void>;
  };
}

export function useRegistrantList(): UseRegistrantListReturn {
  // Data states
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [statistics, setStatistics] = useState<RegistrantStatistics | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string>('');

  // Filter states
  const [params, setParams] = useState<RegistrantsParams>({
    page: 1,
    per_page: 15,
    tahun_akademik: '2024/2025',
    semester: 'Ganjil',
  });

  // Fetch data function
  const fetchData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError('');

      const response = await registrantService.getRegistrants(params);

      setRegistrants(response.registrants.data);
      setStatistics(response.statistics);
      setPagination(response.registrants.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal memuat data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [params]);

  // Initial load and when params change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounced search effect
  useEffect(() => {
    if (params.search !== undefined) {
      const timeoutId = setTimeout(() => {
        if (params.page === 1) {
          fetchData(false);
        } else {
          setParams(prev => ({ ...prev, page: 1 }));
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [params.search, params.jenis_kegiatan, params.id_prodi, params.status, params.lokasi]);

  // Actions
  const actions = {
    setAcademicYear: (tahun_akademik: string) => {
      setParams(prev => ({ 
        ...prev, 
        tahun_akademik: tahun_akademik === 'all' ? undefined : tahun_akademik,
        page: 1 
      }));
    },

    setSemester: (semester: string) => {
      setParams(prev => ({ 
        ...prev, 
        semester: semester === 'all' ? undefined : semester,
        page: 1 
      }));
    },

    setSearch: (search: string) => {
      setParams(prev => ({ 
        ...prev, 
        search: search || undefined,
        page: 1 
      }));
    },

    setProgram: (jenis_kegiatan: string) => {
      setParams(prev => ({ 
        ...prev, 
        jenis_kegiatan: jenis_kegiatan === 'all' ? undefined : jenis_kegiatan,
        page: 1 
      }));
    },

    setSchool: (id_prodi: string) => {
      setParams(prev => ({ 
        ...prev, 
        id_prodi: id_prodi === 'all' ? undefined : id_prodi,
        page: 1 
      }));
    },

    setStatus: (status: string) => {
      setParams(prev => ({ 
        ...prev, 
        status: status === 'all' ? undefined : status,
        page: 1 
      }));
    },

    setLocation: (lokasi: string) => {
      setParams(prev => ({ 
        ...prev, 
        lokasi: lokasi === 'all' ? undefined : lokasi,
        page: 1 
      }));
    },

    setCurrentPage: (page: number) => {
      setParams(prev => ({ ...prev, page }));
    },

    setPerPage: (per_page: number) => {
      setParams(prev => ({ ...prev, per_page, page: 1 }));
    },

    clearFilters: () => {
      setParams(prev => ({
        page: 1,
        per_page: prev.per_page,
        tahun_akademik: prev.tahun_akademik,
        semester: prev.semester,
      }));
    },

    refresh: () => {
      setRefreshing(true);
      fetchData(false);
    },

    fetchData,

    exportData: async () => {
      try {
        toast.info('Mengekspor data...');
        
        const exportParams = { ...params };
        delete exportParams.page;
        delete exportParams.per_page;
        
        const data = await registrantService.exportRegistrants(exportParams);
        
        // Convert to CSV and download
        if (data.length === 0) {
          toast.warning('Tidak ada data untuk diekspor');
          return;
        }

        const headers = Object.keys(data[0]);
        const csvHeaders = headers.join(',');
        const csvRows = data.map(row => 
          headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',') 
              ? `"${value}"` 
              : value;
          }).join(',')
        );
        
        const csv = [csvHeaders, ...csvRows].join('\n');
        
        // Download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `registrants-export-${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success(`Data berhasil diekspor (${data.length} records)`);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Gagal mengekspor data';
        toast.error(errorMessage);
      }
    },
  };

  return {
    // Data states
    registrants,
    statistics,
    pagination,
    
    // Loading states
    loading,
    refreshing,
    error,
    
    // Filter states
    params,
    
    // Actions
    actions,
  };
}