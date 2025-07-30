import React, { useState } from 'react';
import { useTitle } from '@/hooks/useTitle';
import { toast } from 'sonner';

import type { Program } from '@/types/program';
import { useProgramList } from '@/hooks/useProgramList';
import { ProgramFilters, ProgramPagination, ProgramStats, ProgramTable } from './_components/ProgramListComponent';
import { ProgramEditModal } from './_components/ProgramEditModal';
import { ProgramStatusModal } from './_components/ProgramStatusModal';
import { programService } from '@/services/programService';
import { ProgramDeleteModal } from './_components/ProgramDeleteModal';
import { useNavigate } from 'react-router';

const ProgramList = () => {
  useTitle('Programs - Admin Dashboard');

  const navigate = useNavigate()

  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [statusProgram, setStatusProgram] = useState<Program | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState<number | null>(null);
  const [deleteProgram, setDeleteProgram] = useState<Program | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingProgram, setIsDeletingProgram] = useState<number | null>(null);


  const {
    programs,
    pagination,
    statistics,
    loading,
    error,
    params,
    actions,
  } = useProgramList();
  

  const handleView = (program: Program) => {
    console.log('View program:', program);
    toast.info(`Viewing program: ${program.name}`);
  };

   const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (updatedProgram: Program) => {
    // Refresh the program list to get updated data
    actions.refreshData();
    toast.success(`Program "${updatedProgram.name}" updated successfully`);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setEditingProgram(null);
  };


  const handleClone = (program: Program) => {
    console.log('Clone program:', program);
    // TODO: Implement clone functionality
    toast.info(`Cloning program: ${program.name}`);
  };

 const handleToggleStatus = async (program: Program) => {
    // Show confirmation modal for critical status changes
    if (program.status === 'Y' && program.registration_count > 0) {
      setStatusProgram(program);
      setIsStatusModalOpen(true);
      return;
    }

    await performStatusToggle(program);
  };

  const performStatusToggle = async (program: Program) => {
    setIsTogglingStatus(program.id);

    try {
      const result = await programService.toggleProgramStatus(program.id);
      
      const newStatus = result.status;
      const statusText = result.status_text;
      
      actions.refreshData();
      
      const action = newStatus === 'Y' ? 'activated' : 'deactivated';
      toast.success(`Program "${program.name}" has been ${action} successfully`, {
        description: `Status changed to: ${statusText}`,
        duration: 3000,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update program status';
      toast.error('Failed to update status', {
        description: errorMessage,
        duration: 5000,
      });
      console.error('Toggle status error:', error);
    } finally {
      setIsTogglingStatus(null);
    }
  };

  const handleStatusConfirm = async () => {
    if (statusProgram) {
      await performStatusToggle(statusProgram);
    }
    setIsStatusModalOpen(false);
    setStatusProgram(null);
  };

  const handleStatusCancel = () => {
    setIsStatusModalOpen(false);
    setStatusProgram(null);
  };

   const handleDelete = (program: Program) => {
    setDeleteProgram(program);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (programId: number, confirmText: string, forceDelete: boolean) => {
    setIsDeletingProgram(programId);

    try {
      await programService.deleteProgram(programId);
      
      actions.refreshData();
      
      const program = programs.find(p => p.id === programId);
      toast.success(`Program "${program?.name}" berhasil dihapus`, {
        description: forceDelete ? 'Program dihapus permanen' : 'Program dipindahkan ke recycle bin',
        duration: 4000,
      });

      setIsDeleteModalOpen(false);
      setDeleteProgram(null);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus program';
      toast.error('Gagal menghapus program', {
        description: errorMessage,
        duration: 5000,
      });
      console.error('Delete error:', error);
    } finally {
      setIsDeletingProgram(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setDeleteProgram(null);
  };

  // Handle error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Programs</h1>
          <p className="text-muted-foreground">
            Manage MBKM programs and activities.
          </p>
        </div>

        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-600">Error Loading Programs</h3>
            <p className="text-muted-foreground mt-2">{error}</p>
            <button
              onClick={actions.refreshData}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAdd = () => navigate("/programs/add");


  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Programs</h1>
        <p className="text-muted-foreground">
          Manage MBKM programs and activities.
        </p>
      </div>

      {/* Statistics */}
      <ProgramStats statistics={statistics} loading={loading}   />

      {/* Filters */}
      <ProgramFilters
        searchQuery={params.search || ''}
        statusFilter={params.status || 'all'}
        typeFilter={params.type || 'all'}
        onSearchChange={actions.handleSearch}
        onStatusChange={actions.handleStatusFilter}
        onTypeChange={actions.handleTypeFilter}
        onClearFilters={actions.clearFilters}
        onAddNew={handleAdd}
      />

      {/* Programs Table */}
      <ProgramTable
        programs={programs}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onClone={handleClone}
        onToggleStatus={handleToggleStatus}
      />

      {/* Pagination */}
      {pagination && !loading && (
        <ProgramPagination
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

       <ProgramEditModal
        program={editingProgram}
        open={isEditModalOpen}
        onClose={handleEditClose}
        onSuccess={handleEditSuccess}
      />
      <ProgramStatusModal
        program={statusProgram}
        open={isStatusModalOpen}
        onConfirm={handleStatusConfirm}
        onCancel={handleStatusCancel}
      />

<ProgramDeleteModal
        program={deleteProgram}
        open={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeletingProgram === deleteProgram?.id}
      />

    </div>
  );
};

export default ProgramList;