// src/pages/register/_components/RegisterFilters.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  X,
  GraduationCap,
  Building,
  MapPin,
  Activity,
  Loader2
} from 'lucide-react';
import { registrantService } from '@/services/registrantService';
import type { FilterOptions } from '@/types/registrant';

interface RegisterFiltersProps {
  searchTerm: string;
  selectedProgram: string;
  selectedSchool: string;
  selectedStatus: string;
  selectedLocation: string;
  onSearchChange: (value: string) => void;
  onProgramChange: (value: string) => void;
  onSchoolChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  loading?: boolean;
}

function RegisterFilters({
  searchTerm,
  selectedProgram,
  selectedSchool,
  selectedStatus,
  selectedLocation,
  onSearchChange,
  onProgramChange,
  onSchoolChange,
  onStatusChange,
  onLocationChange,
  onClearFilters,
  hasActiveFilters,
  loading = false,
}: RegisterFiltersProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [optionsLoading, setOptionsLoading] = useState(true);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const options = await registrantService.getFilterOptions();
        setFilterOptions(options);
      } catch (error) {
        console.error('Failed to fetch filter options:', error);
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  // Default options while loading
  const defaultOptions = {
    activity_types: [
      { value: 'all', label: 'Semua Program' },
      { value: 'magang', label: 'Magang/Praktik Kerja' },
      { value: 'penelitian', label: 'Penelitian' },
      { value: 'pertukaran', label: 'Pertukaran Mahasiswa' },
      { value: 'kewirausahaan', label: 'Kewirausahaan' },
      { value: 'mengajar', label: 'Mengajar di Sekolah' },
      { value: 'kkn', label: 'KKN Tematik' },
    ],
    study_programs: [
      { value: 'all', label: 'Semua Program Studi' },
    ],
    locations: [
      { value: 'all', label: 'Semua Lokasi' },
      { value: 'Kendari', label: 'Kendari' },
      { value: 'Makassar', label: 'Makassar' },
      { value: 'Baubau', label: 'Baubau' },
      { value: 'Jakarta', label: 'Jakarta' },
      { value: 'Yogyakarta', label: 'Yogyakarta' },
    ]
  };

  const programs = filterOptions?.activity_types || defaultOptions.activity_types;
  const schools = filterOptions?.study_programs || defaultOptions.study_programs;
  const locations = filterOptions?.locations || defaultOptions.locations;

  const statuses = [
    { value: 'all', label: 'Semua Status' },
    { value: 'pending_payment', label: 'Menunggu Pembayaran' },
    { value: 'active', label: 'Aktif' },
    { value: 'awaiting_assessment', label: 'Menunggu Penilaian' },
    { value: 'completed', label: 'Selesai' },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Cari berdasarkan NIM, nama, atau lokasi..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onClearFilters}
                className="gap-2"
                disabled={loading}
              >
                <X className="h-4 w-4" />
                Hapus Filter
              </Button>
            )}
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              Filter:
              {optionsLoading && <Loader2 className="h-3 w-3 animate-spin ml-1" />}
            </div>

            {/* Program Filter */}
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={selectedProgram} 
                onValueChange={onProgramChange}
                disabled={loading || optionsLoading}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Pilih Program" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.value} value={program.value}>
                      {program.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Study Program Filter */}
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={selectedSchool} 
                onValueChange={onSchoolChange}
                disabled={loading || optionsLoading}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Pilih Program Studi" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.value} value={school.value}>
                      {school.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={selectedStatus} 
                onValueChange={onStatusChange}
                disabled={loading}
              >
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Pilih Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Filter */}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={selectedLocation} 
                onValueChange={onLocationChange}
                disabled={loading || optionsLoading}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Pilih Lokasi" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Indicator */}
          {hasActiveFilters && !loading && (
            <div className="text-sm text-muted-foreground">
              Menampilkan hasil yang difilter
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default RegisterFilters;