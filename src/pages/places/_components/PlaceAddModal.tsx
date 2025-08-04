// src/pages/places/_components/PlaceAddModal.tsx
import React, { useState } from 'react';
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
import { Loader2, AlertCircle, Building, MapPin, Users, Activity, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { placeService } from '@/services/placeService';
import type { Place, CreatePlaceData } from '@/types/place';

interface PlaceAddModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (newPlace: Place) => void;
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

export function PlaceAddModal({ 
  open, 
  onClose, 
  onSuccess 
}: PlaceAddModalProps) {
  const [formData, setFormData] = useState<FormData>({
    nama_sekolah: '',
    alamat: '',
    kuota: 0,
    status: '1',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      nama_sekolah: '',
      alamat: '',
      kuota: 0,
      status: '1',
    });
    setErrors({});
  };

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
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const createData: CreatePlaceData = {
        nama_sekolah: formData.nama_sekolah.trim(),
        alamat: formData.alamat.trim(),
        kuota: formData.kuota,
        status: formData.status,
      };

      const newPlace = await placeService.createPlace(createData);
      
      onSuccess(newPlace);
      resetForm();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal menambah tempat';
      
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
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Tambah Tempat Baru
          </DialogTitle>
          <DialogDescription>
            Tambahkan tempat magang/praktik baru untuk mahasiswa.
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

          {/* Preview */}
          {(formData.nama_sekolah || formData.alamat || formData.kuota > 0) && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-blue-600">Preview Tempat Baru</h4>
              <div className="grid grid-cols-1 gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                {formData.nama_sekolah && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      <span className="font-medium">Nama:</span> {formData.nama_sekolah}
                    </span>
                  </div>
                )}
                {formData.alamat && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      <span className="font-medium">Alamat:</span> {formData.alamat.substring(0, 50)}{formData.alamat.length > 50 ? '...' : ''}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    <span className="font-medium">Kuota:</span> {formData.kuota} mahasiswa
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    <span className="font-medium">Status:</span> {formData.status === '1' ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <h5 className="font-medium text-sm text-green-800 mb-2">Tips Menambah Tempat:</h5>
            <ul className="space-y-1 text-xs text-green-700">
              <li>• Pastikan nama tempat jelas dan mudah dikenali</li>
              <li>• Tulis alamat lengkap agar mudah ditemukan</li>
              <li>• Set kuota sesuai kapasitas tempat yang tersedia</li>
              <li>• Tempat aktif akan langsung terlihat oleh mahasiswa</li>
            </ul>
          </div>

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
                  Menambah...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Tempat
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}