import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { settingService } from '@/services/settingService';
import type { Setting, SettingStatistics } from '@/types/setting';

interface SettingsParams {
  page: number;
  per_page: number;
  tahun: string;
  semester: string;
  status: string;
  status_sekolah: string;
}

export function useSettingList() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [statistics, setStatistics] = useState<SettingStatistics | null>(null);
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [params, setParams] = useState<SettingsParams>({
    page: 1,
    per_page: 15,
    tahun: 'all',
    semester: 'all',
    status: 'all',
    status_sekolah: 'all'
  });

  // Action states
  const [togglingStatusId, setTogglingStatusId] = useState<number | null>(null);
  const [togglingSchoolStatusId, setTogglingSchoolStatusId] = useState<number | null>(null);
  const [activatingId, setActivatingId] = useState<number | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await settingService.getSettings(params);
      
      setSettings(response.settings.data);
      setPagination(response.settings.pagination);
      setStatistics(response.statistics);
      setYears(response.filters.years);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil data pengaturan';
      setError(errorMessage);
      toast.error('Error', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [params]);

  const actions = {
    handleYearFilter: (value: string) => {
      setParams(prev => ({ ...prev, tahun: value, page: 1 }));
    },

    handleSemesterFilter: (value: string) => {
      setParams(prev => ({ ...prev, semester: value, page: 1 }));
    },

    handleStatusFilter: (value: string) => {
      setParams(prev => ({ ...prev, status: value, page: 1 }));
    },

    handleSchoolStatusFilter: (value: string) => {
      setParams(prev => ({ ...prev, status_sekolah: value, page: 1 }));
    },

    handlePageChange: (page: number) => {
      setParams(prev => ({ ...prev, page }));
    },

    handlePerPageChange: (perPage: number) => {
      setParams(prev => ({ ...prev, per_page: perPage, page: 1 }));
    },

    clearFilters: () => {
      setParams(prev => ({
        ...prev,
        tahun: 'all',
        semester: 'all',
        status: 'all',
        status_sekolah: 'all',
        page: 1
      }));
    },

    toggleSettingStatus: async (setting: Setting) => {
      setTogglingStatusId(setting.id);

      try {
        const result = await settingService.toggleSettingStatus(setting.id);
        
        setSettings(prev => prev.map(s => 
          s.id === setting.id 
            ? { ...s, status: result.status, status_text: result.status_text }
            : s
        ));
        
        const action = result.status === 'Y' ? 'diaktifkan' : 'dinonaktifkan';
        toast.success(`Pengaturan ${setting.tahun_akademik} ${setting.semester} berhasil ${action}`);
        
        fetchSettings();
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Gagal mengubah status';
        toast.error('Gagal mengubah status', {
          description: errorMessage,
          duration: 5000,
        });
      } finally {
        setTogglingStatusId(null);
      }
    },

    toggleSchoolStatus: async (setting: Setting) => {
      setTogglingSchoolStatusId(setting.id);

      try {
        const result = await settingService.toggleSchoolStatus(setting.id);
        
        setSettings(prev => prev.map(s => 
          s.id === setting.id 
            ? { ...s, status_sekolah: result.status_sekolah, status_sekolah_text: result.status_sekolah_text }
            : s
        ));
        
        const action = result.status_sekolah === 'Y' ? 'diaktifkan' : 'dinonaktifkan';
        toast.success(`Status sekolah ${setting.tahun_akademik} ${setting.semester} berhasil ${action}`);
        
        fetchSettings();
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Gagal mengubah status sekolah';
        toast.error('Gagal mengubah status sekolah', {
          description: errorMessage,
          duration: 5000,
        });
      } finally {
        setTogglingSchoolStatusId(null);
      }
    },

    activateSetting: async (setting: Setting) => {
      setActivatingId(setting.id);

      try {
        const result = await settingService.activateSetting(setting.id);
        
        toast.success(result, {
          description: `${setting.tahun_akademik} ${setting.semester} sekarang aktif`,
          duration: 4000,
        });
        
        fetchSettings();
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Gagal mengaktifkan pengaturan';
        toast.error('Gagal mengaktifkan pengaturan', {
          description: errorMessage,
          duration: 5000,
        });
      } finally {
        setActivatingId(null);
      }
    },

    refreshData: fetchSettings,
  };

  return {
    settings,
    pagination,
    statistics,
    years,
    loading,
    error,
    params,
    togglingStatusId,
    togglingSchoolStatusId,
    activatingId,
    actions,
  };
}