import React, { useState } from 'react';
import { useTitle } from '@/hooks/useTitle';
import { toast } from 'sonner';

import type { Program } from '@/types/program';
import { useProgramList } from '@/hooks/useProgramList';
import { ProgramFilters, ProgramPagination, ProgramStats, ProgramTable } from './_components/ProgramListComponent';
import { ProgramEditModal } from './_components/ProgramEditModal';

const ProgramList = () => {
  useTitle('Programs - Admin Dashboard');

    const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);


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

  const handleDelete = (program: Program) => {
    console.log('Delete program:', program);
    toast.warning(`Delete program: ${program.name}`);
  };

  const handleClone = (program: Program) => {
    console.log('Clone program:', program);
    // TODO: Implement clone functionality
    toast.info(`Cloning program: ${program.name}`);
  };

  const handleToggleStatus = (program: Program) => {
    console.log('Toggle status:', program);
    // TODO: Implement toggle status functionality
    const newStatus = program.status === 'Y' ? 'inactive' : 'active';
    toast.success(`Program ${program.name} is now ${newStatus}`);
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
      <ProgramStats statistics={statistics} loading={loading} />

      {/* Filters */}
      <ProgramFilters
        searchQuery={params.search || ''}
        statusFilter={params.status || 'all'}
        typeFilter={params.type || 'all'}
        onSearchChange={actions.handleSearch}
        onStatusChange={actions.handleStatusFilter}
        onTypeChange={actions.handleTypeFilter}
        onClearFilters={actions.clearFilters}
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
    </div>
  );
};

export default ProgramList;