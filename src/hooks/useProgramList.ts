import { useState, useEffect, useCallback } from 'react';
import { programService } from '@/services/programService';
import type { Program, ProgramsResponse, ProgramsParams, ProgramStatistics } from '@/types/program';

interface UseProgramListState {
  programs: Program[];
  pagination: ProgramsResponse['programs']['pagination'] | null;
  statistics: ProgramStatistics | null;
  loading: boolean;
  error: string | null;
  params: ProgramsParams;
}

interface UseProgramListActions {
  setParams: (newParams: Partial<ProgramsParams>) => void;
  refreshData: () => Promise<void>;
  handleSearch: (query: string) => void;
  handleStatusFilter: (status: string) => void;
  handleTypeFilter: (type: string) => void;
  handlePageChange: (page: number) => void;
  handlePerPageChange: (perPage: number) => void;
  clearFilters: () => void;
}

export function useProgramList() {
  const [state, setState] = useState<UseProgramListState>({
    programs: [],
    pagination: null,
    statistics: null,
    loading: true,
    error: null,
    params: {
      page: 1,
      per_page: 15,
      search: '',
      status: 'all',
      type: 'all',
    },
  });

  const fetchPrograms = useCallback(async (params: ProgramsParams) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await programService.getPrograms(params);
      
      setState(prev => ({
        ...prev,
        programs: response.programs.data,
        pagination: response.programs.pagination,
        statistics: response.statistics,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));
    }
  }, []);

  const setParams = useCallback((newParams: Partial<ProgramsParams>) => {
    setState(prev => {
      const updatedParams = { ...prev.params, ...newParams };
      // Reset to page 1 when filters change (except when explicitly changing page)
      if (!newParams.page && (newParams.search !== undefined || newParams.status !== undefined || newParams.type !== undefined)) {
        updatedParams.page = 1;
      }
      return { ...prev, params: updatedParams };
    });
  }, []);

  const refreshData = useCallback(async () => {
    await fetchPrograms(state.params);
  }, [fetchPrograms, state.params]);

  const handleSearch = useCallback((query: string) => {
    setParams({ search: query, page: 1 });
  }, [setParams]);

  const handleStatusFilter = useCallback((status: string) => {
    setParams({ status, page: 1 });
  }, [setParams]);

  const handleTypeFilter = useCallback((type: string) => {
    setParams({ type, page: 1 });
  }, [setParams]);

  const handlePageChange = useCallback((page: number) => {
    setParams({ page });
  }, [setParams]);

  const handlePerPageChange = useCallback((perPage: number) => {
    setParams({ per_page: perPage, page: 1 });
  }, [setParams]);

  const clearFilters = useCallback(() => {
    setParams({
      search: '',
      status: 'all',
      type: 'all',
      date_from: undefined,
      date_to: undefined,
      page: 1,
    });
  }, [setParams]);

  // Fetch data when params change
  useEffect(() => {
    fetchPrograms(state.params);
  }, [fetchPrograms, state.params]);

  const actions: UseProgramListActions = {
    setParams,
    refreshData,
    handleSearch,
    handleStatusFilter,
    handleTypeFilter,
    handlePageChange,
    handlePerPageChange,
    clearFilters,
  };

  return {
    ...state,
    actions,
  };
}