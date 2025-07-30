import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Trash2, 
  AlertTriangle, 
  Building, 
  MapPin, 
  Users,
  Loader2,
  FileText
} from 'lucide-react';
import type { Place } from '@/types/place';

interface PlaceDeleteModalProps {
  place: Place | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (placeId: number, confirmText: string, forceDelete: boolean) => void;
  isDeleting?: boolean;
}

export function PlaceDeleteModal({ 
  place, 
  open, 
  onClose, 
  onConfirm,
  isDeleting = false
}: PlaceDeleteModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [forceDelete, setForceDelete] = useState(false);
  const [understoodRisks, setUnderstoodRisks] = useState(false);

  if (!place) return null;

  const hasQuota = place.kuota > 0;
  const isConfirmTextValid = confirmText === place.nama_sekolah;
  const canDelete = isConfirmTextValid && (!hasQuota || understoodRisks);

  const handleConfirm = () => {
    if (canDelete) {
      onConfirm(place.id, confirmText, forceDelete);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText('');
      setForceDelete(false);
      setUnderstoodRisks(false);
      onClose();
    }
  };

  const getDangerLevel = () => {
    if (hasQuota) return 'high';
    return 'medium';
  };

  const getDangerColor = () => {
    const level = getDangerLevel();
    return level === 'high' ? 'border-red-500 bg-red-50' : 'border-orange-500 bg-orange-50';
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Hapus Tempat
          </DialogTitle>
          <DialogDescription>
            Tindakan ini tidak dapat dibatalkan. Tempat dan semua data terkait akan dihapus secara permanen.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Place Info */}
          <div className={`p-4 rounded-lg border-2 ${getDangerColor()}`}>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Building className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{place.formatted_name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    ID: <Badge variant="outline">{place.id}</Badge>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 truncate">{place.alamat}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className={hasQuota ? 'text-red-600 font-medium' : 'text-gray-600'}>
                    {place.kuota} kuota
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge 
                  variant={place.status === '1' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {place.status_text}
                </Badge>
                {hasQuota && (
                  <Badge variant="destructive" className="text-xs">
                    Memiliki Kuota
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Danger Warnings */}
          {hasQuota && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div>
                  <strong>Peringatan: Tempat ini memiliki kuota!</strong>
                  <p className="mt-2">Menghapus tempat ini akan:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Menghapus {place.kuota} slot kuota yang tersedia</li>
                    <li>Menghapus semua data terkait tempat ini</li>
                    <li>Mempengaruhi pendaftaran mahasiswa jika ada yang terdaftar</li>
                    <li>Tidak dapat dipulihkan setelah dihapus</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Data yang Terpengaruh */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Data yang akan dihapus:
            </h4>
            <div className="grid grid-cols-1 gap-2 text-sm pl-6">
              <div className="flex justify-between">
                <span>Informasi tempat</span>
                <Badge variant="outline">1 record</Badge>
              </div>
              <div className="flex justify-between">
                <span>Data alamat dan lokasi</span>
                <Badge variant="outline">1 record</Badge>
              </div>
              {hasQuota && (
                <div className="flex justify-between">
                  <span>Kuota yang tersedia</span>
                  <Badge variant="destructive">{place.kuota} slot</Badge>
                </div>
              )}
              <div className="flex justify-between">
                <span>Riwayat perubahan</span>
                <Badge variant="outline">Multiple records</Badge>
              </div>
            </div>
          </div>

          {/* Risk Acknowledgment */}
          {hasQuota && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="understand-risks" 
                  checked={understoodRisks}
                  onCheckedChange={(checked) => setUnderstoodRisks(checked as boolean)}
                />
                <Label htmlFor="understand-risks" className="text-sm">
                  Saya memahami risiko dan konsekuensi menghapus tempat ini yang memiliki {place.kuota} kuota
                </Label>
              </div>
            </div>
          )}

          {/* Force Delete Option */}
          {hasQuota && understoodRisks && (
            <div className="space-y-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="force-delete" 
                      checked={forceDelete}
                      onCheckedChange={(checked) => setForceDelete(checked as boolean)}
                    />
                    <Label htmlFor="force-delete" className="text-sm font-medium text-red-800">
                      Paksa hapus (Tanpa backup)
                    </Label>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    Ini akan menghapus tempat beserta semua kuota tanpa backup
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Text */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="confirm-text" className="text-sm font-medium">
                Ketik nama tempat untuk konfirmasi: <span className="font-mono bg-gray-100 px-1 rounded">{place.nama_sekolah}</span>
              </Label>
              <Input
                id="confirm-text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Ketik nama tempat di sini"
                className={`mt-1 ${isConfirmTextValid ? 'border-green-500 bg-green-50' : 'border-red-300'}`}
                disabled={isDeleting}
              />
              {confirmText && !isConfirmTextValid && (
                <p className="text-xs text-red-500 mt-1">
                  Nama tempat tidak sesuai
                </p>
              )}
            </div>
          </div>

          {/* Impact Summary */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <h5 className="font-medium text-sm text-gray-800 mb-2">Ringkasan Dampak:</h5>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Tempat yang dihapus:</span>
                <span className="font-medium">1 tempat</span>
              </div>
              <div className="flex justify-between">
                <span>Kuota yang hilang:</span>
                <span className={`font-medium ${hasQuota ? 'text-red-600' : ''}`}>
                  {place.kuota} slot
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status saat ini:</span>
                <span className="font-medium">{place.status_text}</span>
              </div>
            </div>
          </div>

          {/* Backup Information */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Informasi Backup:</p>
                <p className="mt-1">
                  {forceDelete 
                    ? "Data akan dihapus permanen tanpa backup." 
                    : "Data akan dibackup otomatis sebelum dihapus dan dapat dipulihkan dalam 30 hari oleh Super Admin."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isDeleting}
          >
            Batal
          </Button>
          <Button 
            variant="destructive"
            onClick={handleConfirm}
            disabled={!canDelete || isDeleting}
            className="min-w-[120px]"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Tempat
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
