import React, { useState } from 'react';
import { useTitle } from '@/hooks/useTitle';
import { toast } from 'sonner';
import { usePlaceList } from '@/hooks/usePlaceList';
import { placeService } from '@/services/placeService';
import { PlaceStats } from './_components/PlaceStats';
import { PlaceFilters } from './_components/PlaceFilters';
import { PlaceTable } from './_components/PlaceTable';
import { PlacePagination } from './_components/PlacePagination';
import { PlaceErrorState } from './_components/PlaceErrorState';
import { PlaceEditModal } from './_components/PlaceEditModal';
import { PlaceAddModal } from './_components/PlaceAddModal';
import { PlaceDeleteModal } from './_components/PlaceDeleteModal';
import type { Place } from '@/types/place';

const PlacesList = () => {
  useTitle('Daftar Tempat - Admin Dashboard');

  const {
    places,
    pagination,
    statistics,
    loading,
    error,
    params,
    togglingStatusId,
    actions,
  } = usePlaceList();

  // Modal states
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletePlace, setDeletePlace] = useState<Place | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingPlace, setIsDeletingPlace] = useState<number | null>(null);

  // Action handlers
  const handleView = (place: Place) => {
    toast.info(`Melihat detail: ${place.nama_sekolah}`);
  };

  const handleEdit = (place: Place) => {
    setEditingPlace(place);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (updatedPlace: Place) => {
    // Refresh the place list to get updated data
    actions.refreshData();
    toast.success(`Tempat "${updatedPlace.nama_sekolah}" berhasil diperbarui`);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setEditingPlace(null);
  };

  const handleAddNew = () => {
    setIsAddModalOpen(true);
  };

  const handleAddSuccess = (newPlace: Place) => {
    // Refresh the place list to get updated data
    actions.refreshData();
    toast.success(`Tempat "${newPlace.nama_sekolah}" berhasil ditambahkan`);
  };

  const handleAddClose = () => {
    setIsAddModalOpen(false);
  };

  const handleDelete = (place: Place) => {
    setDeletePlace(place);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async (placeId: number, confirmText: string, forceDelete: boolean) => {
    setIsDeletingPlace(placeId);

    try {
      await placeService.deletePlace(placeId);
      
      // Refresh data
      actions.refreshData();
      
      // Show success message
      const place = places.find(p => p.id === placeId);
      toast.success(`Tempat "${place?.nama_sekolah}" berhasil dihapus`, {
        description: forceDelete ? 'Tempat dihapus permanen' : 'Tempat dipindahkan ke recycle bin',
        duration: 4000,
      });

      // Close modal
      setIsDeleteModalOpen(false);
      setDeletePlace(null);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus tempat';
      toast.error('Gagal menghapus tempat', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsDeletingPlace(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setDeletePlace(null);
  };

  // Render error state
  if (error && !loading) {
    return <PlaceErrorState error={error} onRetry={actions.refreshData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daftar Tempat</h1>
          <p className="text-muted-foreground">
            Kelola tempat magang dan praktik mahasiswa.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <PlaceStats statistics={statistics} loading={loading} />

      {/* Filters */}
      <PlaceFilters
        searchQuery={params.search}
        statusFilter={params.status}
        quotaFilter={params.quota}
        onSearchChange={actions.handleSearch}
        onStatusChange={actions.handleStatusFilter}
        onQuotaChange={actions.handleQuotaFilter}
        onClearFilters={actions.clearFilters}
        onAddNew={handleAddNew}
      />

      {/* Places Table */}
      <PlaceTable
        places={places}
        loading={loading}
        currentPage={pagination?.current_page || 1}
        perPage={pagination?.per_page || 15}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={actions.togglePlaceStatus}
        togglingStatusId={togglingStatusId}
      />

      {/* Pagination */}
      {pagination && !loading && (
        <PlacePagination
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
      <PlaceAddModal
        open={isAddModalOpen}
        onClose={handleAddClose}
        onSuccess={handleAddSuccess}
      />

      {/* Edit Modal */}
      <PlaceEditModal
        place={editingPlace}
        open={isEditModalOpen}
        onClose={handleEditClose}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Modal */}
      <PlaceDeleteModal
        place={deletePlace}
        open={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeletingPlace === deletePlace?.id}
      />
    </div>
  );
};

export default PlacesList;