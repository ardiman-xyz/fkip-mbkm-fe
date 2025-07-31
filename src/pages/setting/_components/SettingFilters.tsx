import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarDays, Plus } from 'lucide-react';

interface SettingFiltersProps {
  yearFilter: string;
  semesterFilter: string;
  statusFilter: string;
  schoolStatusFilter: string;
  years: number[];
  onYearChange: (year: string) => void;
  onSemesterChange: (semester: string) => void;
  onStatusChange: (status: string) => void;
  onSchoolStatusChange: (status: string) => void;
  onClearFilters: () => void;
  onAddNew?: () => void;
}

export function SettingFilters({
  yearFilter,
  semesterFilter,
  statusFilter,
  schoolStatusFilter,
  years,
  onYearChange,
  onSemesterChange,
  onStatusChange,
  onSchoolStatusChange,
  onClearFilters,
  onAddNew,
}: SettingFiltersProps) {
  const hasActiveFilters = yearFilter !== 'all' || semesterFilter !== 'all' || statusFilter !== 'all' || schoolStatusFilter !== 'all';

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 gap-4">
        <Select value={yearFilter} onValueChange={onYearChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Tahun" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tahun</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={semesterFilter} onValueChange={onSemesterChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Semester</SelectItem>
            <SelectItem value="Ganjil">Ganjil</SelectItem>
            <SelectItem value="Genap">Genap</SelectItem>
          </SelectContent>
        </Select>
        
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

        <Select value={schoolStatusFilter} onValueChange={onSchoolStatusChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status Sekolah" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Tidak Aktif</SelectItem>
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
            Tambah Pengaturan
          </Button>
        )}
      </div>
    </div>
  );
}
