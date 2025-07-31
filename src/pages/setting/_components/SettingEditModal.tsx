// src/pages/settings/_components/SettingEditModal.tsx
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
import { Loader2, AlertCircle, Calendar, Settings, Clock, School, Edit, Activity } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { settingService } from '@/services/settingService';
import type { Setting, UpdateSettingData } from '@/types/setting';

interface SettingEditModalProps {
  setting: Setting | null;
  open: boolean;
  onClose: () => void;
  onSuccess: (updatedSetting: Setting) => void;
}

interface FormData {
  tahun: number;
  tahun_akademik: string;
  semester: 'Ganjil' | 'Genap';
  tgl_mulai: string;
  tgl_berakhir: string;
  tgl_pembekalan: string;
  tgl_penarikan: string;
  ket: string;
  status: 'Y' | 'N';
  status_sekolah: 'Y' | 'N';
}

interface FormErrors {
  tahun?: string;
  tahun_akademik?: string;
  semester?: string;
  tgl_mulai?: string;
  tgl_berakhir?: string;
  tgl_pembekalan?: string;
  tgl_penarikan?: string;
  ket?: string;
  general?: string;
}

export function SettingEditModal({ 
  setting, 
  open, 
  onClose, 
  onSuccess 
}: SettingEditModalProps) {
  const [formData, setFormData] = useState<FormData>({
    tahun: new Date().getFullYear(),
    tahun_akademik: '',
    semester: 'Ganjil',
    tgl_mulai: '',
    tgl_berakhir: '',
    tgl_pembekalan: '',
    tgl_penarikan: '',
    ket: '',
    status: 'Y',
    status_sekolah: 'Y',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when setting changes
  useEffect(() => {
    if (setting) {
      setFormData({
        tahun: setting.tahun || new Date().getFullYear(),
        tahun_akademik: setting.tahun_akademik || '',
        semester: setting.semester || 'Ganjil',
        tgl_mulai: setting.tgl_mulai || '',
        tgl_berakhir: setting.tgl_berakhir || '',
        tgl_pembekalan: setting.tgl_pembekalan || '',
        tgl_penarikan: setting.tgl_penarikan || '',
        ket: setting.ket || '',
        status: setting.status || 'Y',
        status_sekolah: setting.status_sekolah || 'Y',
      });
      setErrors({});
    }
  }, [setting]);

  // Auto-generate academic year when year changes
  const handleYearChange = (year: number) => {
    setFormData(prev => ({
      ...prev,
      tahun: year,
      tahun_akademik: `${year}/${year + 1}`
    }));
    
    if (errors.tahun) {
      setErrors(prev => ({ ...prev, tahun: undefined }));
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Tahun validation
    if (!formData.tahun) {
      newErrors.tahun = 'Tahun wajib diisi';
    } else if (formData.tahun < 2020 || formData.tahun > 2050) {
      newErrors.tahun = 'Tahun harus antara 2020-2050';
    }

    // Tahun akademik validation
    if (!formData.tahun_akademik.trim()) {
      newErrors.tahun_akademik = 'Tahun akademik wajib diisi';
    } else if (formData.tahun_akademik.length > 20) {
      newErrors.tahun_akademik = 'Tahun akademik maksimal 20 karakter';
    }

    // Semester validation
    if (!formData.semester) {
      newErrors.semester = 'Semester wajib dipilih';
    }

    // Date validations
    if (!formData.tgl_mulai) {
      newErrors.tgl_mulai = 'Tanggal mulai wajib diisi';
    }

    if (!formData.tgl_berakhir) {
      newErrors.tgl_berakhir = 'Tanggal berakhir wajib diisi';
    }

    // Check if end date is after start date
    if (formData.tgl_mulai && formData.tgl_berakhir) {
      const startDate = new Date(formData.tgl_mulai);
      const endDate = new Date(formData.tgl_berakhir);
      
      if (endDate <= startDate) {
        newErrors.tgl_berakhir = 'Tanggal berakhir harus setelah tanggal mulai';
      }
    }

    // Optional date validations
    if (formData.tgl_pembekalan && formData.tgl_mulai) {
      const pembelalanDate = new Date(formData.tgl_pembekalan);
      const startDate = new Date(formData.tgl_mulai);
      
      if (pembelalanDate > startDate) {
        newErrors.tgl_pembekalan = 'Tanggal pembekalan sebaiknya sebelum tanggal mulai';
      }
    }

    if (formData.tgl_penarikan && formData.tgl_berakhir) {
      const penarikanDate = new Date(formData.tgl_penarikan);
      const endDate = new Date(formData.tgl_berakhir);
      
      if (penarikanDate < endDate) {
        newErrors.tgl_penarikan = 'Tanggal penarikan sebaiknya setelah tanggal berakhir';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDuration = () => {
    if (formData.tgl_mulai && formData.tgl_berakhir) {
      const startDate = new Date(formData.tgl_mulai);
      const endDate = new Date(formData.tgl_berakhir);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const getChangedFields = () => {
    if (!setting) return [];
    
    const changes = [];
    
    if (formData.tahun !== setting.tahun) {
      changes.push({ field: 'Tahun', old: setting.tahun, new: formData.tahun });
    }
    if (formData.tahun_akademik !== setting.tahun_akademik) {
      changes.push({ field: 'Tahun Akademik', old: setting.tahun_akademik, new: formData.tahun_akademik });
    }
    if (formData.semester !== setting.semester) {
      changes.push({ field: 'Semester', old: setting.semester, new: formData.semester });
    }
    if (formData.tgl_mulai !== setting.tgl_mulai) {
      changes.push({ field: 'Tanggal Mulai', old: setting.tgl_mulai, new: formData.tgl_mulai });
    }
    if (formData.tgl_berakhir !== setting.tgl_berakhir) {
      changes.push({ field: 'Tanggal Berakhir', old: setting.tgl_berakhir, new: formData.tgl_berakhir });
    }
    if (formData.tgl_pembekalan !== (setting.tgl_pembekalan || '')) {
      changes.push({ field: 'Tanggal Pembekalan', old: setting.tgl_pembekalan || 'Tidak diisi', new: formData.tgl_pembekalan || 'Tidak diisi' });
    }
    if (formData.tgl_penarikan !== (setting.tgl_penarikan || '')) {
      changes.push({ field: 'Tanggal Penarikan', old: setting.tgl_penarikan || 'Tidak diisi', new: formData.tgl_penarikan || 'Tidak diisi' });
    }
    if (formData.ket !== (setting.ket || '')) {
      changes.push({ field: 'Keterangan', old: setting.ket || 'Tidak diisi', new: formData.ket || 'Tidak diisi' });
    }
    if (formData.status !== setting.status) {
      changes.push({ field: 'Status', old: setting.status_text, new: formData.status === 'Y' ? 'Aktif' : 'Tidak Aktif' });
    }
    if (formData.status_sekolah !== setting.status_sekolah) {
      changes.push({ field: 'Status Sekolah', old: setting.status_sekolah_text, new: formData.status_sekolah === 'Y' ? 'Aktif' : 'Tidak Aktif' });
    }
    
    return changes;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!setting || !validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const updateData: UpdateSettingData = {
        tahun: formData.tahun,
        tahun_akademik: formData.tahun_akademik.trim(),
        semester: formData.semester,
        tgl_mulai: formData.tgl_mulai,
        tgl_berakhir: formData.tgl_berakhir,
        tgl_pembekalan: formData.tgl_pembekalan || undefined,
        tgl_penarikan: formData.tgl_penarikan || undefined,
        ket: formData.ket.trim() || undefined,
        status: formData.status,
        status_sekolah: formData.status_sekolah,
      };

      const updatedSetting = await settingService.updateSetting(setting.id, updateData);
      
      onSuccess(updatedSetting);
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal memperbarui pengaturan';
      
      // Check if it's a validation error
      if (errorMessage.includes('sudah ada') || errorMessage.includes('kombinasi')) {
        if (errorMessage.toLowerCase().includes('tahun') && errorMessage.toLowerCase().includes('semester')) {
          setErrors({ 
            tahun: 'Kombinasi tahun dan semester sudah ada',
            semester: 'Kombinasi tahun dan semester sudah ada'
          });
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

  if (!setting) return null;

  const duration = calculateDuration();
  const changes = getChangedFields();
  const hasChanges = changes.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Pengaturan
          </DialogTitle>
          <DialogDescription>
            Perbarui pengaturan periode pembimbingan akademik. Perubahan akan disimpan langsung.
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

          {/* Current Setting Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium">Pengaturan Saat Ini</h4>
              <Badge variant="outline" className="text-xs">
                ID: {setting.id}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Periode</p>
                <p className="text-sm font-medium">{setting.tahun_akademik} {setting.semester}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant={setting.status === 'Y' ? "default" : "secondary"} className="text-xs">
                  {setting.status_text}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status Sekolah</p>
                <Badge variant={setting.status_sekolah === 'Y' ? "default" : "secondary"} className="text-xs">
                  {setting.status_sekolah_text}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Periode Aktif</p>
                <Badge variant={setting.is_active_period ? "default" : "outline"} className="text-xs">
                  {setting.is_active_period ? 'Ya' : 'Tidak'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Basic Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium">Informasi Dasar</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tahun */}
              <div className="space-y-2">
                <Label htmlFor="tahun">
                  Tahun <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.tahun.toString()} 
                  onValueChange={(value) => handleYearChange(parseInt(value))}
                >
                  <SelectTrigger className={errors.tahun ? 'border-red-500' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tahun && (
                  <p className="text-sm text-red-500">{errors.tahun}</p>
                )}
              </div>

              {/* Semester */}
              <div className="space-y-2">
                <Label htmlFor="semester">
                  Semester <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.semester} 
                  onValueChange={(value: 'Ganjil' | 'Genap') => handleInputChange('semester', value)}
                >
                  <SelectTrigger className={errors.semester ? 'border-red-500' : ''}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ganjil">Semester Ganjil</SelectItem>
                    <SelectItem value="Genap">Semester Genap</SelectItem>
                  </SelectContent>
                </Select>
                {errors.semester && (
                  <p className="text-sm text-red-500">{errors.semester}</p>
                )}
              </div>
            </div>

            {/* Tahun Akademik */}
            <div className="space-y-2">
              <Label htmlFor="tahun_akademik">
                Tahun Akademik <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tahun_akademik"
                value={formData.tahun_akademik}
                onChange={(e) => handleInputChange('tahun_akademik', e.target.value)}
                placeholder="2024/2025"
                className={errors.tahun_akademik ? 'border-red-500' : ''}
                maxLength={20}
              />
              {errors.tahun_akademik && (
                <p className="text-sm text-red-500">{errors.tahun_akademik}</p>
              )}
            </div>
          </div>

          {/* Date Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium">Periode Waktu</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tanggal Mulai */}
              <div className="space-y-2">
                <Label htmlFor="tgl_mulai">
                  Tanggal Mulai <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tgl_mulai"
                  type="date"
                  value={formData.tgl_mulai}
                  onChange={(e) => handleInputChange('tgl_mulai', e.target.value)}
                  className={errors.tgl_mulai ? 'border-red-500' : ''}
                />
                {errors.tgl_mulai && (
                  <p className="text-sm text-red-500">{errors.tgl_mulai}</p>
                )}
              </div>

              {/* Tanggal Berakhir */}
              <div className="space-y-2">
                <Label htmlFor="tgl_berakhir">
                  Tanggal Berakhir <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tgl_berakhir"
                  type="date"
                  value={formData.tgl_berakhir}
                  onChange={(e) => handleInputChange('tgl_berakhir', e.target.value)}
                  className={errors.tgl_berakhir ? 'border-red-500' : ''}
                  min={formData.tgl_mulai || undefined}
                />
                {errors.tgl_berakhir && (
                  <p className="text-sm text-red-500">{errors.tgl_berakhir}</p>
                )}
              </div>
            </div>

            {/* Duration Info */}
            {duration > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Durasi Periode:</strong> {duration} hari
                  {duration > 120 && (
                    <span className="text-orange-600 ml-2">(Periode cukup panjang)</span>
                  )}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tanggal Pembekalan */}
              <div className="space-y-2">
                <Label htmlFor="tgl_pembekalan">Tanggal Pembekalan</Label>
                <Input
                  id="tgl_pembekalan"
                  type="date"
                  value={formData.tgl_pembekalan}
                  onChange={(e) => handleInputChange('tgl_pembekalan', e.target.value)}
                  className={errors.tgl_pembekalan ? 'border-red-500' : ''}
                />
                {errors.tgl_pembekalan && (
                  <p className="text-sm text-red-500">{errors.tgl_pembekalan}</p>
                )}
              </div>

              {/* Tanggal Penarikan */}
              <div className="space-y-2">
                <Label htmlFor="tgl_penarikan">Tanggal Penarikan</Label>
                <Input
                  id="tgl_penarikan"
                  type="date"
                  value={formData.tgl_penarikan}
                  onChange={(e) => handleInputChange('tgl_penarikan', e.target.value)}
                  className={errors.tgl_penarikan ? 'border-red-500' : ''}
                />
                {errors.tgl_penarikan && (
                  <p className="text-sm text-red-500">{errors.tgl_penarikan}</p>
                )}
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <School className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-medium">Pengaturan Status</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status */}
              <div className="space-y-2">
                <Label>Status Umum</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: 'Y' | 'N') => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Aktif
                      </div>
                    </SelectItem>
                    <SelectItem value="N">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        Tidak Aktif
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Sekolah */}
              <div className="space-y-2">
                <Label>Status Sekolah</Label>
                <Select 
                  value={formData.status_sekolah} 
                  onValueChange={(value: 'Y' | 'N') => handleInputChange('status_sekolah', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Y">
                      <div className="flex items-center gap-2">
                        <School className="w-3 h-3 text-blue-500" />
                        Aktif
                      </div>
                    </SelectItem>
                    <SelectItem value="N">
                      <div className="flex items-center gap-2">
                        <School className="w-3 h-3 text-gray-400" />
                        Tidak Aktif
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <Label htmlFor="ket">Keterangan</Label>
            <Textarea
              id="ket"
              value={formData.ket}
              onChange={(e) => handleInputChange('ket', e.target.value)}
              placeholder="Masukkan keterangan atau catatan khusus untuk periode ini..."
              className="min-h-[80px]"
              rows={3}
            />
          </div>

          {/* Changes Preview */}
          {hasChanges && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-blue-600 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Preview Perubahan
              </h4>
              <div className="space-y-2 p-4 bg-blue-50 border border-blue-200 rounded-lg max-h-40 overflow-y-auto">
                {changes.map((change, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{change.field}:</span>
                    <span className="ml-2 text-red-600 line-through">{change.old}</span>
                    <span className="mx-2">→</span>
                    <span className="text-green-600 font-medium">{change.new}</span>
                  </div>
                ))}
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
            <Button type="submit" disabled={isSubmitting || !hasChanges}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memperbarui...
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Perbarui Pengaturan
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}