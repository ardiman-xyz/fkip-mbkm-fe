// src/pages/programs/_components/ProgramDeleteModal.tsx
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
  Users, 
  FileText, 
  Clock,
  Shield,
  Loader2 
} from 'lucide-react';
import type { Program } from '@/types/program';

interface ProgramDeleteModalProps {
  program: Program | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (programId: number, confirmText: string, forceDelete: boolean) => void;
  isDeleting?: boolean;
}

export function ProgramDeleteModal({ 
  program, 
  open, 
  onClose, 
  onConfirm,
  isDeleting = false
}: ProgramDeleteModalProps) {
  const [confirmText, setConfirmText] = useState('');
  const [forceDelete, setForceDelete] = useState(false);
  const [understoodRisks, setUnderstoodRisks] = useState(false);

  if (!program) return null;

  const hasRegistrations = program.registration_count > 0;
  const isConfirmTextValid = confirmText === program.name;
  const canDelete = isConfirmTextValid && (!hasRegistrations || understoodRisks);

  const handleConfirm = () => {
    if (canDelete) {
      onConfirm(program.id, confirmText, forceDelete);
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
    if (hasRegistrations) return 'high';
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
            Hapus Program
          </DialogTitle>
          <DialogDescription>
            Tindakan ini tidak dapat dibatalkan. Program dan semua data terkait akan dihapus secara permanen.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Info Program */}
          <div className={`p-4 rounded-lg border-2 ${getDangerColor()}`}>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900">{program.formatted_name || program.name}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Jenis: <Badge variant="outline">{program.type}</Badge>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className={hasRegistrations ? 'text-red-600 font-medium' : 'text-gray-600'}>
                    {program.registration_count} pendaftar
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    Dibuat {new Date(program.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Peringatan Bahaya */}
          {hasRegistrations && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div>
                  <strong>Peringatan: Program ini memiliki pendaftar aktif!</strong>
                  <p className="mt-2">Menghapus program ini akan:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Menghapus permanen semua {program.registration_count} pendaftaran mahasiswa</li>
                    <li>Menghapus semua dokumen dan file terkait</li>
                    <li>Menghapus semua tracking progress dan penilaian</li>
                    <li>Merusak referensi dalam laporan atau analitik</li>
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
                <span>Informasi dan pengaturan program</span>
                <Badge variant="outline">1 record</Badge>
              </div>
              {hasRegistrations && (
                <>
                  <div className="flex justify-between">
                    <span>Pendaftaran mahasiswa</span>
                    <Badge variant="destructive">{program.registration_count} records</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Dokumen terkait</span>
                    <Badge variant="outline">Multiple files</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Laporan progress</span>
                    <Badge variant="outline">Multiple records</Badge>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Konfirmasi Risiko */}
          {hasRegistrations && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="understand-risks" 
                  checked={understoodRisks}
                  onCheckedChange={(checked) => setUnderstoodRisks(checked as boolean)}
                />
                <Label htmlFor="understand-risks" className="text-sm">
                  Saya memahami risiko dan konsekuensi menghapus program ini yang memiliki pendaftar aktif
                </Label>
              </div>
            </div>
          )}

          {/* Opsi Force Delete */}
          {hasRegistrations && (
            <div className="space-y-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="force-delete" 
                      checked={forceDelete}
                      onCheckedChange={(checked) => setForceDelete(checked as boolean)}
                      disabled={!understoodRisks}
                    />
                    <Label htmlFor="force-delete" className="text-sm font-medium text-red-800">
                      Paksa hapus (Hanya untuk Super Admin)
                    </Label>
                  </div>
                  <p className="text-xs text-red-600 mt-1">
                    Ini akan menghapus program beserta semua data terkait tanpa backup
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Konfirmasi Teks */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="confirm-text" className="text-sm font-medium">
                Ketik nama program untuk konfirmasi: <span className="font-mono bg-gray-100 px-1 rounded">{program.name}</span>
              </Label>
              <Input
                id="confirm-text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="Ketik nama program di sini"
                className={`mt-1 ${isConfirmTextValid ? 'border-green-500 bg-green-50' : 'border-red-300'}`}
                disabled={isDeleting}
              />
              {confirmText && !isConfirmTextValid && (
                <p className="text-xs text-red-500 mt-1">
                  Nama program tidak sesuai
                </p>
              )}
            </div>
          </div>

          {/* Informasi Backup */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Informasi Backup:</p>
                <p className="mt-1">
                  Data akan dibackup otomatis sebelum dihapus dan dapat dipulihkan dalam 30 hari oleh Super Admin.
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
                Hapus Program
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}