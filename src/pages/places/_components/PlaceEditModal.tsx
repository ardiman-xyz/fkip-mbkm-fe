// src/pages/places/_components/PlaceEditModal.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, Building, MapPin, Users, Activity } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { placeService } from '@/services/placeService';
import type { Place, UpdatePlaceData } from '@/types/place';

interface PlaceEditModalProps {
  place: Place | null;
  open: boolean;
  onClose: () => void;
  onSuccess: (updatedPlace: Place) => void;
}

interface FormData {
  nama_sekolah: string;
  alamat: string;
  kuota: number;
  status: '1' | '0';
}

interface FormErrors {
  nama_sekolah?: string;
  alamat?: string;
  kuota?: string;
  status?: string;
  general?: string;
}

export function PlaceEditModal({ 
  place, 
  open, 
  onClose, 
  onSuccess 
}: PlaceEditModalProps) {
  const [formData, setFormData] = useState<FormData>({
    nama_sekolah: '',
    alamat: '',
    kuota: 0,
    status: '1',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when place changes
  useEffect(() => {
    if (place) {
      setFormData({
        nama_sekolah: place.nama_sekolah || '',
        alamat: place.alamat || '',
        kuota: place.kuota || 0,
        status: place.status || '1',
      });
      setErrors({});
    } else {
      setFormData({
        nama_sekolah: '',
        alamat: '',
        kuota: 0,
        status: '1',
      });
      setErrors({});
    }
  }, [place]);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nama_sekolah.trim()) {
      newErrors.nama_sekolah = 'Nama tempat wajib diisi';
    } else if (formData.nama_sekolah.length > 100) {
      newErrors.nama_sekolah = 'Nama tempat tidak boleh lebih dari 100 karakter';
    }

    if (!formData.alamat.trim()) {
      newErrors.alamat = 'Alamat wajib diisi';
    } else if (formData.alamat.length > 255) {
      newErrors.alamat = 'Alamat tidak boleh lebih dari 255 karakter';
    }

    if (formData.kuota < 0) {
      newErrors.kuota = 'Kuota tidak boleh negatif';
    } else if (formData.kuota > 999) {
      newErrors.kuota = 'Kuota tidak boleh lebih dari 999';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!place || !validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const updateData: UpdatePlaceData = {
        nama_sekolah: formData.nama_sekolah.trim(),
        alamat: formData.alamat.trim(),
        kuota: formData.kuota,
        status: formData.status,
      };

      const updatedPlace = await placeService.updatePlace(place.id, updateData);
      
      onSuccess(updatedPlace);
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal memperbarui tempat';
      
      // Check if it's a validation error
      if (errorMessage.includes('sudah ada') || errorMessage.includes('already exists')) {
        if (errorMessage.toLowerCase().includes('nama') || errorMessage.toLowerCase().includes('name')) {
          setErrors({ nama_sekolah: 'Nama tempat sudah ada' });
        } else {
          setErrors({ general: errorMessage });
        }
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!place) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Edit Tempat
          </DialogTitle>
          <DialogDescription>
            Perbarui informasi tempat. Perubahan akan disimpan langsung.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error */}
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Place Info Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium">Informasi Tempat</h4>
              <Badge variant="outline" className="text-xs">
                ID: {place.id}
              </Badge>
            </div>

            {/* Nama Tempat */}
            <div className="space-y-2">
              <Label htmlFor="nama_sekolah">
                Nama Tempat <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama_sekolah"
                value={formData.nama_sekolah}
                onChange={(e) => handleInputChange('nama_sekolah', e.target.value)}
                placeholder="Masukkan nama tempat"
                className={errors.nama_sekolah ? 'border-red-500' : ''}
                maxLength={100}
              />
              {errors.nama_sekolah && (
                <p className="text-sm text-red-500">{errors.nama_sekolah}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.nama_sekolah.length}/100 karakter
              </p>
            </div>

            {/* Alamat */}
            <div className="space-y-2">
              <Label htmlFor="alamat">
                Alamat <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="alamat"
                value={formData.alamat}
                onChange={(e) => handleInputChange('alamat', e.target.value)}
                placeholder="Masukkan alamat lengkap tempat"
                className={`min-h-[80px] ${errors.alamat ? 'border-red-500' : ''}`}
                maxLength={255}
                rows={3}
              />
              {errors.alamat && (
                <p className="text-sm text-red-500">{errors.alamat}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.alamat.length}/255 karakter
              </p>
            </div>

            {/* Kuota */}
            <div className="space-y-2">
              <Label htmlFor="kuota">
                Kuota <span className="text-red-500">*</span>
              </Label>
              <Input
                id="kuota"
                type="number"
                value={formData.kuota}
                onChange={(e) => handleInputChange('kuota', parseInt(e.target.value) || 0)}
                placeholder="0"
                className={errors.kuota ? 'border-red-500' : ''}
                min={0}
                max={999}
              />
              {errors.kuota && (
                <p className="text-sm text-red-500">{errors.kuota}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Jumlah mahasiswa yang dapat diterima di tempat ini
              </p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>
                Status <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: '1' | '0') => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Aktif
                    </div>
                  </SelectItem>
                  <SelectItem value="0">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      Tidak Aktif
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Tempat aktif akan terlihat oleh mahasiswa
              </p>
            </div>
          </div>

          {/* Current Data Preview */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Data Saat Ini</h4>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Nama Tempat</p>
                <p className="text-sm font-medium">{place.formatted_name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge 
                  variant={place.status === '1' ? "default" : "secondary"}
                  className="text-xs"
                >
                  {place.status_text}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Alamat</p>
                <p className="text-sm truncate">{place.alamat}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kuota</p>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm font-medium">{place.kuota}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Changes */}
          {(formData.nama_sekolah !== place.nama_sekolah || 
            formData.alamat !== place.alamat ||
            formData.kuota !== place.kuota ||
            formData.status !== place.status) && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-blue-600">Preview Perubahan</h4>
              <div className="grid grid-cols-1 gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                {formData.nama_sekolah !== place.nama_sekolah && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      <span className="font-medium">Nama:</span> {formData.nama_sekolah}
                    </span>
                  </div>
                )}
                {formData.alamat !== place.alamat && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      <span className="font-medium">Alamat:</span> {formData.alamat.substring(0, 50)}{formData.alamat.length > 50 ? '...' : ''}
                    </span>
                  </div>
                )}
                {formData.kuota !== place.kuota && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      <span className="font-medium">Kuota:</span> {formData.kuota}
                    </span>
                  </div>
                )}
                {formData.status !== place.status && (
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      <span className="font-medium">Status:</span> {formData.status === '1' ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memperbarui...
                </>
              ) : (
                'Perbarui Tempat'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}