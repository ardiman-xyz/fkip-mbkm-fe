// src/pages/register/RegisterList.tsx (Simplified Version)
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Download, 
  Plus,
  RefreshCw,
  AlertCircle,
  Calendar,
  Badge
} from 'lucide-react';
import AcademicYearFilter from './_components/AcademicYearFilter';
import RegisterFilters from './_components/RegisterFilters';
import RegisterStats from './_components/RegisterStats';
import RegisterTable from './_components/RegisterTable';
import RegisterPagination from './_components/RegisterPagination';
import { useRegistrantList } from '@/hooks/useRegistrantList';

function RegisterList() {
  const {
    // Data
    registrants,
    statistics,
    pagination,
    
    // Loading states
    loading,
    refreshing,
    error,
    
    // Filter params
    params,
    
   currentSetting,
    actions,
  } = useRegistrantList();

  

  const hasActiveFilters = 
    params.search || 
    (params.jenis_kegiatan && params.jenis_kegiatan !== 'all') ||
    (params.id_prodi && params.id_prodi !== 'all') ||
    (params.status && params.status !== 'all') ||
    (params.lokasi && params.lokasi !== 'all');

  // Error state
  if (error && !loading && !refreshing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Daftar Pendaftar</h1>
            <p className="text-muted-foreground">Kelola data pendaftar program MBKM</p>
          </div>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-red-600">Error Memuat Data</h3>
            <p className="text-muted-foreground mt-2 text-center">{error}</p>
            <Button onClick={() => actions.fetchData(true)} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daftar Pendaftar</h1>
          <p className="text-muted-foreground">
            Kelola data pendaftar program MBKM
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={actions.refresh}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            onClick={actions.exportData}
            disabled={loading || registrants.length === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Pendaftar
          </Button>
        </div>
      </div>

      {currentSetting && (
  <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar  className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-900">
            Menampilkan Periode Aktif: {currentSetting.tahun_akademik} {currentSetting.semester}
          </span>
          <Badge className="bg-green-100 text-green-700 text-xs">
            Auto Filter
          </Badge>
        </div>
        {currentSetting.tgl_mulai && currentSetting.tgl_berakhir && (
          <div className="text-sm text-green-700">
            {currentSetting.tgl_mulai} - {currentSetting.tgl_berakhir}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
)}

      {/* Academic Year & Semester Filter - Compact */}
{currentSetting && (
  <AcademicYearFilter
    academicYear={params.tahun_akademik || currentSetting.tahun_akademik}
    semester={params.semester || currentSetting.semester}
    onAcademicYearChange={actions.setAcademicYear}
    onSemesterChange={actions.setSemester}
    loading={loading}
  />
)}
      {/* Statistics Cards */}
      <RegisterStats 
        statistics={statistics} 
        loading={loading} 
      />

      {/* Main Filters */}
      <RegisterFilters
        searchTerm={params.search || ''}
        selectedProgram={params.jenis_kegiatan || 'all'}
        selectedSchool={params.id_prodi || 'all'}
        selectedStatus={params.status || 'all'}
        selectedLocation={params.lokasi || 'all'}
        onSearchChange={actions.setSearch}
        onProgramChange={actions.setProgram}
        onSchoolChange={actions.setSchool}
        onStatusChange={actions.setStatus}
        onLocationChange={actions.setLocation}
        onClearFilters={actions.clearFilters}
        hasActiveFilters={!!hasActiveFilters}
        loading={loading}
      />

      {/* Registrants Table */}
      <RegisterTable
        registrants={registrants}
        loading={loading}
        currentPage={pagination?.current_page || 1}
        perPage={pagination?.per_page || 15}
        onRefresh={actions.refresh}
      />

      {/* Pagination */}
      {pagination && !loading && pagination.total > 0 && (
        <RegisterPagination
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          perPage={pagination.per_page}
          total={pagination.total}
          from={pagination.from}
          to={pagination.to}
          onPageChange={actions.setCurrentPage}
          onPerPageChange={actions.setPerPage}
        />
      )}
    </div>
  );
}

export default RegisterList;