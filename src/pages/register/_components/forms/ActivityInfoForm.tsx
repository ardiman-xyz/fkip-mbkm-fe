// src/pages/register/_components/forms/ActivityInfoForm.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, AlertCircle, Loader2 } from 'lucide-react';
import type { Place } from '@/types/place';
import type { Program } from '@/types/program';

interface ActivityInfoFormProps {
  data: {
    jenis_kegiatan: string;
    id_tempat: string;
    tanggal_bayar: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
  loading?: boolean;
  placesLoading?: boolean;
  programsLoading?: boolean;
  programs: Program[];
  places: Place[];
}

function ActivityInfoForm({
  data,
  errors,
  onChange,
  disabled = false,
  loading = false,
  placesLoading = false,
  programsLoading = false,
  programs,
  places,
}: ActivityInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Building className="h-4 w-4" />
          Informasi Kegiatan
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {/* Activity Type - From Programs */}
        <div className="space-y-2">
          <Label htmlFor="jenis_kegiatan">Jenis Kegiatan *</Label>
          <Select 
            value={data.jenis_kegiatan} 
            onValueChange={(value) => onChange('jenis_kegiatan', value)}
            disabled={disabled || loading || programsLoading}
          >
            <SelectTrigger className={errors.jenis_kegiatan ? 'border-red-500' : ''}>
              <SelectValue placeholder="Pilih jenis kegiatan" />
            </SelectTrigger>
            <SelectContent>
              {programs.map((program) => (
                <SelectItem key={program.id} value={program.id.toString()}>
                  <div className="flex flex-col">
                    <span className="font-medium">{program.nama_program}</span>
                    <span className="text-xs text-muted-foreground">
                      {program.deskripsi}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.jenis_kegiatan && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors.jenis_kegiatan}
            </div>
          )}
          {programsLoading && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Memuat program...
            </div>
          )}
        </div>

        {/* Place Selection */}
        <div className="space-y-2">
          <Label htmlFor="id_tempat">Tempat Kegiatan *</Label>
          <Select 
            value={data.id_tempat} 
            onValueChange={(value) => onChange('id_tempat', value)}
            disabled={disabled || placesLoading}
          >
            <SelectTrigger className={errors.id_tempat ? 'border-red-500' : ''}>
              <SelectValue placeholder="Pilih tempat kegiatan" />
            </SelectTrigger>
            <SelectContent>
              {places.map((place) => (
                <SelectItem key={place.id} value={place.id.toString()}>
                  <div className="flex flex-col">
                    <span className="font-medium">{place.nama_sekolah}</span>
                    <span className="text-xs text-muted-foreground">
                      {place.kota} - Kuota: {place.sisa_kuota}/{place.kuota_tersedia}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.id_tempat && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors.id_tempat}
            </div>
          )}
          {placesLoading && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Memuat tempat...
            </div>
          )}
        </div>

        {/* Payment Date */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tanggal_bayar">Tanggal Bayar *</Label>
          <Input
            id="tanggal_bayar"
            type="date"
            value={data.tanggal_bayar}
            onChange={(e) => onChange('tanggal_bayar', e.target.value)}
            className={errors.tanggal_bayar ? 'border-red-500' : ''}
            disabled={disabled}
          />
          {errors.tanggal_bayar && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors.tanggal_bayar}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ActivityInfoForm;