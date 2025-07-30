import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus } from 'lucide-react';

interface PlaceFiltersProps {
  searchQuery: string;
  statusFilter: string;
  quotaFilter: string;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: string) => void;
  onQuotaChange: (quota: string) => void;
  onClearFilters: () => void;
  onAddNew?: () => void;
}

export function PlaceFilters({
  searchQuery,
  statusFilter,
  quotaFilter,
  onSearchChange,
  onStatusChange,
  onQuotaChange,
  onClearFilters,
  onAddNew,
}: PlaceFiltersProps) {
  const hasActiveFilters = searchQuery || statusFilter !== 'all' || quotaFilter !== 'all';

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari tempat..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Tidak Aktif</SelectItem>
          </SelectContent>
        </Select>

        <Select value={quotaFilter} onValueChange={onQuotaChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Kuota" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kuota</SelectItem>
            <SelectItem value="available">Ada Kuota</SelectItem>
            <SelectItem value="full">Kuota Penuh</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            Hapus Filter
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        {onAddNew && (
          <Button onClick={onAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Tempat
          </Button>
        )}
      </div>
    </div>
  );
}
