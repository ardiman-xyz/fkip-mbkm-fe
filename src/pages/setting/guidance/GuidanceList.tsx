// src/pages/settings/guidance/GuidanceList.tsx
import React, { useState } from 'react';
import { useTitle } from '@/hooks/useTitle';
import { toast } from 'sonner';
import { useSettingList } from '@/hooks/useSettingList';
import { SettingStats } from '../_components/SettingStats';
import { SettingFilters } from '../_components/SettingFilters';
import { SettingTable } from '../_components/SettingTable';
import { SettingPagination } from '../_components/SettingPagination';
import { SettingErrorState } from '../_components/SettingErrorState';
import { SettingAddModal } from '../_components/SettingAddModal';
import { SettingEditModal } from '../_components/SettingEditModal';
import type { Setting } from '@/types/setting';

const GuidanceList = () => {
  useTitle('Pengaturan Pembimbingan - Admin Dashboard');

  const {
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
  } = useSettingList();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Action handlers
  const handleView = (setting: Setting) => {
    toast.info(`Melihat detail: ${setting.tahun_akademik} ${setting.semester}`);
  };

  const handleEdit = (setting: Setting) => {
    setEditingSetting(setting);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (updatedSetting: Setting) => {
    actions.refreshData();
    toast.success(`Pengaturan "${updatedSetting.tahun_akademik} ${updatedSetting.semester}" berhasil diperbarui`);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setEditingSetting(null);
  };

  const handleDelete = (setting: Setting) => {
    toast.warning(`Hapus pengaturan: ${setting.tahun_akademik} ${setting.semester}`);
  };

  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSuccess = () => {
    actions.refreshData();
    toast.success('Pengaturan berhasil dibuat!');
    setIsAddModalOpen(false);
  };

  const handleAddClose = () => {
    setIsAddModalOpen(false);
  };

  // Render error state
  if (error && !loading) {
    return <SettingErrorState error={error} onRetry={actions.refreshData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pengaturan Pembimbingan</h1>
          <p className="text-muted-foreground">
            Kelola periode dan pengaturan pembimbingan akademik.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <SettingStats statistics={statistics} loading={loading} />

      {/* Filters */}
      <SettingFilters
        yearFilter={params.tahun}
        semesterFilter={params.semester}
        statusFilter={params.status}
        schoolStatusFilter={params.status_sekolah}
        years={years}
        onYearChange={actions.handleYearFilter}
        onSemesterChange={actions.handleSemesterFilter}
        onStatusChange={actions.handleStatusFilter}
        onSchoolStatusChange={actions.handleSchoolStatusFilter}
        onClearFilters={actions.clearFilters}
        onAddNew={handleAddNew}
      />

      {/* Settings Table */}
      <SettingTable
        settings={settings}
        loading={loading}
        currentPage={pagination?.current_page || 1}
        perPage={pagination?.per_page || 15}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={actions.toggleSettingStatus}
        onToggleSchoolStatus={actions.toggleSchoolStatus}
        onActivate={actions.activateSetting}
        togglingStatusId={togglingStatusId}
        togglingSchoolStatusId={togglingSchoolStatusId}
        activatingId={activatingId}
      />

      {/* Pagination */}
      {pagination && !loading && (
        <SettingPagination
          currentPage={pagination.current_page}
          lastPage={pagination.last_page}
          perPage={pagination.per_page}
          total={pagination.total}
          from={pagination.from}
          to={pagination.to}
          onPageChange={actions.handlePageChange}
          onPerPageChange={actions.handlePerPageChange}
        />
      )}

      {/* Add Modal */}
      <SettingAddModal
        open={isAddModalOpen}
        onClose={handleAddClose}
        onSuccess={handleAddSuccess}
      />

      {/* Edit Modal */}
      <SettingEditModal
        setting={editingSetting}
        open={isEditModalOpen}
        onClose={handleEditClose}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default GuidanceList;