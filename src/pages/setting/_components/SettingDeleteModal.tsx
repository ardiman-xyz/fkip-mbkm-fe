// src/pages/settings/_components/SettingDeleteModal.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Loader2, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  School,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { settingService } from '@/services/settingService';
import type { Setting } from '@/types/setting';

interface SettingDeleteModalProps {
  setting: Setting | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SettingDeleteModal({ 
  setting, 
  open, 
  onClose, 
  onSuccess 
}: SettingDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string>('');

  const handleDelete = async () => {
    if (!setting) return;

    setIsDeleting(true);
    setError('');

    try {
      await settingService.deleteSetting(setting.id);
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal menghapus pengaturan';
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setError('');
      onClose();
    }
  };

  if (!setting) return null;

  // Check for potential issues before deletion
  const hasActiveStatus = setting.status === 'Y';
  const hasActiveSchoolStatus = setting.status_sekolah === 'Y';
  const isActivePeriod = setting.is_active_period;
  
  const warnings = [];
  if (hasActiveStatus) {
    warnings.push('Pengaturan ini masih dalam status aktif');
  }
  if (hasActiveSchoolStatus) {
    warnings.push('Status sekolah masih aktif');
  }
  if (isActivePeriod) {
    warnings.push('Ini adalah periode yang sedang berjalan');
  }

  const hasWarnings = warnings.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Hapus Pengaturan
          </DialogTitle>
          <DialogDescription>
            Tindakan ini tidak dapat dibatalkan. Pengaturan akan dihapus secara permanen.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Warning Alert */}
          {hasWarnings && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Peringatan:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {warnings.map((warning, index) => (
                      <li key={index} className="text-sm">{warning}</li>
                    ))}
                  </ul>
                  <p className="text-sm mt-2">
                    Pastikan untuk menonaktifkan pengaturan terlebih dahulu sebelum menghapus.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Setting Details */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
            <h4 className="font-medium text-sm">Detail Pengaturan yang akan dihapus:</h4>
            
            <div className="grid grid-cols-1 gap-3">
              {/* Basic Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{setting.tahun_akademik}</p>
                  <p className="text-sm text-muted-foreground">
                    {setting.semester_text} - Tahun {setting.tahun}
                  </p>
                </div>
              </div>

              {/* Period Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Periode</p>
                  <p className="text-sm text-muted-foreground">
                    {setting.tgl_mulai} s/d {setting.tgl_berakhir}
                  </p>
                  {setting.is_active_period && (
                    <Badge className="mt-1 text-xs bg-green-100 text-green-800">
                      Periode Aktif
                    </Badge>
                  )}
                </div>
              </div>

              {/* Status Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <School className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Status</p>
                  <div className="flex gap-2 mt-1">
                    <Badge 
                      variant={setting.status === 'Y' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {setting.status_text}
                    </Badge>
                    <Badge 
                      variant={setting.status_sekolah === 'Y' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      Sekolah: {setting.status_sekolah_text}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {setting.ket && (
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium">Keterangan:</p>
                  <p className="text-sm text-muted-foreground mt-1">{setting.ket}</p>
                </div>
              )}
            </div>
          </div>

          {/* Confirmation Text */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              <strong>Konfirmasi:</strong> Apakah Anda yakin ingin menghapus pengaturan 
              "<strong>{setting.tahun_akademik} {setting.semester}</strong>"? 
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Batal
          </Button>
          <Button 
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Ya, Hapus
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}