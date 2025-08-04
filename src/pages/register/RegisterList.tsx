// src/pages/register/RegisterList.tsx
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Download, Plus, RefreshCw, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import AcademicYearFilter from "./_components/AcademicYearFilter";
import RegisterFilters from "./_components/RegisterFilters";
import RegisterStats from "./_components/RegisterStats";
import RegisterTable from "./_components/RegisterTable";
import RegisterPagination from "./_components/RegisterPagination";
import { useRegistrantList } from "@/hooks/useRegistrantList";
import type { DetailedRegistrant } from "@/types/registrant";
import { useNavigate } from "react-router";

function RegisterList() {
  const {
    // Data
    registrants,
    statistics,
    pagination,
    currentSetting,

    // Loading states
    loading,
    refreshing,
    error,

    // Filter params
    params,

    // Actions
    actions,
  } = useRegistrantList();

  const navigate = useNavigate();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddNew = () => {
    navigate("/register/create");
  };

  const handleAddSuccess = (newRegistrant: DetailedRegistrant) => {
    actions.refresh();
    toast.success(
      `Pendaftar ${newRegistrant.student_name} berhasil ditambahkan`,
      {
        description: `NIM: ${newRegistrant.nim} - ${newRegistrant.formatted_activity_type}`,
        duration: 4000,
      }
    );
  };

  const handleAddClose = () => {
    setIsAddModalOpen(false);
  };

  // Derived states
  const hasActiveFilters =
    params.search ||
    (params.jenis_kegiatan && params.jenis_kegiatan !== "all") ||
    (params.id_prodi && params.id_prodi !== "all") ||
    (params.status && params.status !== "all") ||
    (params.lokasi && params.lokasi !== "all");

  // Error state
  if (error && !loading && !refreshing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Daftar Pendaftar
            </h1>
            <p className="text-muted-foreground">
              Kelola data pendaftar program MBKM
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-red-600">
              Error Memuat Data
            </h3>
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
          <h1 className="text-3xl font-bold tracking-tight">
            Daftar Pendaftar
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-muted-foreground">
              Kelola data pendaftar program MBKM
            </p>
            {params.tahun_akademik && params.semester && (
              <span className="text-sm text-blue-600 font-medium">
                • {params.tahun_akademik} {params.semester}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={actions.refresh}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
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
          <Button className="gap-2" onClick={handleAddNew}>
            <Plus className="h-4 w-4" />
            Tambah Pendaftar
          </Button>
        </div>
      </div>

      {/* Academic Year & Semester Filter */}
      <AcademicYearFilter
        academicYear={
          params.tahun_akademik || currentSetting?.tahun_akademik || "2025/2026"
        }
        semester={params.semester || currentSetting?.semester || "Ganjil"}
        onAcademicYearChange={actions.setAcademicYear}
        onSemesterChange={actions.setSemester}
        loading={loading}
      />

      {/* Statistics Cards */}
      <RegisterStats statistics={statistics} loading={loading} />

      {/* Main Filters */}
      <RegisterFilters
        searchTerm={params.search || ""}
        selectedProgram={params.jenis_kegiatan || "all"}
        selectedSchool={params.id_prodi || "all"}
        selectedStatus={params.status || "all"}
        selectedLocation={params.lokasi || "all"}
        onSearchChange={actions.setSearch}
        onProgramChange={actions.setProgram}
        onSchoolChange={actions.setSchool}
        onStatusChange={actions.setStatus}
        onLocationChange={actions.setLocation}
        onClearFilters={actions.clearFilters}
        hasActiveFilters={!!hasActiveFilters}
        loading={loading}
      />

      {/* Results Summary */}
      {!loading && registrants.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Menampilkan {pagination?.from || 0} - {pagination?.to || 0} dari{" "}
            {pagination?.total || 0} pendaftar
            {hasActiveFilters && " (difilter)"}
          </div>
          <div>
            Periode: {params.tahun_akademik || currentSetting?.tahun_akademik} -{" "}
            {params.semester || currentSetting?.semester}
          </div>
        </div>
      )}

      {/* Registrants Table */}
      <RegisterTable
        registrants={registrants}
        loading={loading}
        currentPage={pagination?.current_page || 1}
        perPage={pagination?.per_page || 15}
        onRefresh={actions.refresh}
      />

      {/* Pagination */}
      {pagination && !loading && (
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
