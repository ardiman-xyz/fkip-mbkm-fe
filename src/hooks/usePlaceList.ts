import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { placeService } from '@/services/placeService';
import type { Place, PlaceStatistics } from '@/types/place';

interface PlacesParams {
  page: number;
  per_page: number;
  search: string;
  status: string;
  quota: string;
}

export function usePlaceList() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [statistics, setStatistics] = useState<PlaceStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [params, setParams] = useState<PlacesParams>({
    page: 1,
    per_page: 15,
    search: '',
    status: 'all',
    quota: 'all'
  });

  const [togglingStatusId, setTogglingStatusId] = useState<number | null>(null);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await placeService.getPlaces(params);
      
      setPlaces(response.places.data);
      setPagination(response.places.pagination);
      setStatistics(response.statistics);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengambil data tempat';
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
    fetchPlaces();
  }, [params]);

  const actions = {
    handleSearch: (value: string) => {
      setParams(prev => ({ ...prev, search: value, page: 1 }));
    },

    handleStatusFilter: (value: string) => {
      setParams(prev => ({ ...prev, status: value, page: 1 }));
    },

    handleQuotaFilter: (value: string) => {
      setParams(prev => ({ ...prev, quota: value, page: 1 }));
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
        search: '',
        status: 'all',
        quota: 'all',
        page: 1
      }));
    },

    togglePlaceStatus: async (place: Place) => {
      setTogglingStatusId(place.id);

      try {
        const result = await placeService.togglePlaceStatus(place.id);
        
        setPlaces(prev => prev.map(p => 
          p.id === place.id 
            ? { ...p, status: result.status, status_text: result.status_text }
            : p
        ));
        
        const action = result.status === '1' ? 'diaktifkan' : 'dinonaktifkan';
        toast.success(`Tempat "${place.nama_sekolah}" berhasil ${action}`);
        
        fetchPlaces();
        
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

    refreshData: fetchPlaces,
  };

  return {
    places,
    pagination,
    statistics,
    loading,
    error,
    params,
    togglingStatusId,
    actions,
  };
}