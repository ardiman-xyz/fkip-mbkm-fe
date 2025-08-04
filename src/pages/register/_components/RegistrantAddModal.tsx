// src/pages/register/_components/AddRegistrantModal.tsx (New Complete Version)
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Loader2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { registrantService } from '@/services/registrantService';
import { settingService } from '@/services/settingService';
import { placeService } from '@/services/placeService';
import { programService } from '@/services/programService';
import type { CreateRegistrantData, FilterOptions } from '@/types/registrant';
import type { Place } from '@/types/place';
import type { Program } from '@/types/program';

// Import form components
import PersonalInfoForm from './forms/PersonalInfoForm';
import AcademicInfoForm from './forms/AcademicInfoForm';
import ActivityInfoForm from './forms/ActivityInfoForm';
import LocationInfoForm from './forms/LocationInfoForm';
import FileUploadForm from './forms/FileUploadForm';
import AdditionalInfoForm from './forms/AdditionalInfoForm';

interface AddRegistrantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface FormData extends CreateRegistrantData {
  // File uploads
  bukti_btq?: File | null;
  bukti_bayar?: File | null;
  // Payment date
  tanggal_bayar?: string;
  // Place ID
  id_tempat?: string;
}

function AddRegistrantModal({ 
  open, 
  onOpenChange, 
  onSuccess 
}: AddRegistrantModalProps) {
  // Loading states
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [programsLoading, setProgramsLoading] = useState(true);

  // Data states
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [currentSetting, setCurrentSetting] = useState<any>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    nim: '',
    student_name: '',
    no_hp: '',
    email: '',
    jenis_kegiatan: '',
    id_prodi: '',
    id_tempat: '',
    lokasi: '',
    alamat_lokasi: '',
    keterangan: '',
    tahun_akademik: '',
    semester: '',
    tanggal_bayar: '',
    bukti_btq: null,
    bukti_bayar: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load initial data when modal opens
  useEffect(() => {
    if (open) {
      loadInitialData();
    } else {
      // Reset form when modal closes
      resetForm();
    }
  }, [open]);

  const loadInitialData = async () => {
    try {
      setOptionsLoading(true);
      setPlacesLoading(true);
      setProgramsLoading(true);
      
      // Load all required data in parallel
      const results = await Promise.allSettled([
        registrantService.getFilterOptions(),
        settingService.getCurrentSetting(),
        placeService.getActivePlaces(),
        programService.getActivePrograms()
      ]);

      // Handle filter options
      if (results[0].status === 'fulfilled') {
        setFilterOptions(results[0].value);
      } else {
        console.error('Failed to load filter options:', results[0].reason);
      }

      // Handle current setting
      if (results[1].status === 'fulfilled') {
        const setting = results[1].value;
        setCurrentSetting(setting);
        setFormData(prev => ({
          ...prev,
          tahun_akademik: setting.tahun_akademik,
          semester: setting.semester,
        }));
      } else {
        console.warn('No current setting found, using fallback');
        // Use fallback academic year
        if (results[0].status === 'fulfilled' && results[0].value.academic_years.length > 0) {
          setFormData(prev => ({
            ...prev,
            tahun_akademik: results[0].value.academic_years[0].value,
            semester: 'Ganjil',
          }));
        }
      }

      // Handle places
      if (results[2].status === 'fulfilled') {
        setPlaces(results[2].value);
      } else {
        console.error('Failed to load places:', results[2].reason);
        toast.warning('Gagal memuat data tempat, silakan refresh halaman');
      }

      // Handle programs
      if (results[3].status === 'fulfilled') {
        setPrograms(results[3].value);
      } else {
        console.error('Failed to load programs:', results[3].reason);
        toast.warning('Gagal memuat data program, silakan refresh halaman');
      }

    } catch (error) {
      console.error('Failed to load initial data:', error);
      toast.error('Gagal memuat data awal');
    } finally {
      setOptionsLoading(false);
      setPlacesLoading(false);
      setProgramsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (field: 'bukti_btq' | 'bukti_bayar', file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
    
    // Clear error when user selects file
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Personal Info Validation
    if (!formData.nim.trim()) {
      newErrors.nim = 'NIM wajib diisi';
    } else if (!/^\d{10,15}$/.test(formData.nim.trim())) {
      newErrors.nim = 'NIM harus berupa angka 10-15 digit';
    }

    if (!formData.student_name.trim()) {
      newErrors.student_name = 'Nama mahasiswa wajib diisi';
    } else if (formData.student_name.trim().length < 3) {
      newErrors.student_name = 'Nama minimal 3 karakter';
    }

    if (!formData.no_hp.trim()) {
      newErrors.no_hp = 'Nomor HP wajib diisi';
    } else if (!/^(\+62|62|0)[0-9]{9,13}$/.test(formData.no_hp.trim())) {
      newErrors.no_hp = 'Format nomor HP tidak valid (contoh: 08123456789)';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Format email tidak valid';
    }

    // Academic Info Validation
    if (!formData.id_prodi) {
      newErrors.id_prodi = 'Program studi wajib dipilih';
    }

    if (!formData.tahun_akademik) {
      newErrors.tahun_akademik = 'Tahun akademik wajib dipilih';
    }

    if (!formData.semester) {
      newErrors.semester = 'Semester wajib dipilih';
    }

    // Activity Info Validation
    if (!formData.jenis_kegiatan) {
      newErrors.jenis_kegiatan = 'Jenis kegiatan wajib dipilih';
    }

    if (!formData.id_tempat) {
      newErrors.id_tempat = 'Tempat kegiatan wajib dipilih';
    }

    if (!formData.tanggal_bayar) {
      newErrors.tanggal_bayar = 'Tanggal bayar wajib diisi';
    } else {
      const paymentDate = new Date(formData.tanggal_bayar);
      const today = new Date();
      if (paymentDate > today) {
        newErrors.tanggal_bayar = 'Tanggal bayar tidak boleh lebih dari hari ini';
      }
    }

    // Location Info Validation
    if (!formData.lokasi.trim()) {
      newErrors.lokasi = 'Lokasi wajib diisi';
    }

    if (!formData.alamat_lokasi.trim()) {
      newErrors.alamat_lokasi = 'Alamat lokasi wajib diisi';
    } else if (formData.alamat_lokasi.trim().length < 10) {
      newErrors.alamat_lokasi = 'Alamat minimal 10 karakter';
    }

    // File Upload Validation
    if (!formData.bukti_btq) {
      newErrors.bukti_btq = 'Bukti BTQ wajib diupload';
    } else {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (formData.bukti_btq.size > maxSize) {
        newErrors.bukti_btq = 'Ukuran file BTQ maksimal 5MB';
      }
    }

    if (!formData.bukti_bayar) {
      newErrors.bukti_bayar = 'Bukti bayar wajib diupload';
    } else {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (formData.bukti_bayar.size > maxSize) {
        newErrors.bukti_bayar = 'Ukuran file bukti bayar maksimal 5MB';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Harap perbaiki kesalahan pada form', {
        description: 'Periksa kembali data yang Anda masukkan',
      });
      return;
    }

    setLoading(true);
    try {
      // Prepare clean data
      const cleanData: CreateRegistrantData = {
        nim: formData.nim.trim(),
        student_name: formData.student_name.trim(),
        no_hp: formData.no_hp.trim(),
        email: formData.email.trim().toLowerCase(),
        jenis_kegiatan: formData.jenis_kegiatan,
        id_prodi: formData.id_prodi,
        id_tempat: formData.id_tempat,
        lokasi: formData.lokasi.trim(),
        alamat_lokasi: formData.alamat_lokasi.trim(),
        keterangan: formData.keterangan?.trim() || '',
        tahun_akademik: formData.tahun_akademik,
        semester: formData.semester,
        tanggal_bayar: formData.tanggal_bayar,
      };

      // Create registrant
      const newRegistrant = await registrantService.createRegistrant(cleanData);
      
      // Upload files in parallel
      const uploadPromises = [];
      
      if (formData.bukti_btq) {
        uploadPromises.push(
          registrantService.uploadBTQProof(newRegistrant.id, formData.bukti_btq)
        );
      }
      
      if (formData.bukti_bayar) {
        uploadPromises.push(
          registrantService.uploadPaymentProof(newRegistrant.id, formData.bukti_bayar)
        );
      }

      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }
      
      toast.success('Pendaftar berhasil ditambahkan!', {
        description: `${cleanData.student_name} telah terdaftar untuk ${formData.jenis_kegiatan}`,
        duration: 5000,
      });
      
      // Refresh parent component data
      onSuccess();
      
      // Close modal and reset
      onOpenChange(false);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal menambahkan pendaftar';
      toast.error('Gagal menambahkan pendaftar', {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nim: '',
      student_name: '',
      no_hp: '',
      email: '',
      jenis_kegiatan: '',
      id_prodi: '',
      id_tempat: '',
      lokasi: '',
      alamat_lokasi: '',
      keterangan: '',
      tahun_akademik: currentSetting?.tahun_akademik || '',
      semester: currentSetting?.semester || '',
      tanggal_bayar: '',
      bukti_btq: null,
      bukti_bayar: null,
    });
    setErrors({});
  };

  const handleCancel = () => {
    if (loading) return;
    
    const hasData = Object.values(formData).some(value => 
      value && value !== '' && value !== null
    );
    
    if (hasData) {
      const confirmed = window.confirm('Data yang sudah diisi akan hilang. Yakin ingin membatalkan?');
      if (!confirmed) return;
    }
    
    onOpenChange(false);
  };

  // Prepare options for form components
  const studyPrograms = filterOptions?.study_programs || [];
  const academicYears = filterOptions?.academic_years || [
    { value: '2025/2026', label: '2025/2026' },
    { value: '2024/2025', label: '2024/2025' },
  ];

  const isFormDisabled = loading || optionsLoading;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            Tambah Pendaftar Baru
          </DialogTitle>
          <DialogDescription>
            Lengkapi form berikut untuk menambahkan pendaftar baru ke program MBKM
          </DialogDescription>
        </DialogHeader>

        {/* Current Period Info */}
        {currentSetting && (
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">
                    Periode Aktif: {currentSetting.tahun_akademik} {currentSetting.semester}
                  </span>
                  <Badge className="bg-green-100 text-green-700 text-xs">
                    Auto Selected
                  </Badge>
                </div>
                {currentSetting.tgl_mulai && currentSetting.tgl_berakhir && (
                  <div className="text-sm text-green-700">
                    {currentSetting.tgl_mulai} - {currentSetting.tgl_berakhir}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Summary */}
        {hasErrors && (
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-900">
                  Terdapat {Object.keys(errors).length} kesalahan yang perlu diperbaiki
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <PersonalInfoForm
            data={{
              nim: formData.nim,
              student_name: formData.student_name,
              no_hp: formData.no_hp,
              email: formData.email,
            }}
            errors={errors}
            onChange={handleInputChange}
            disabled={isFormDisabled}
          />

          {/* Academic Information */}
          <AcademicInfoForm
            data={{
              id_prodi: formData.id_prodi,
              tahun_akademik: formData.tahun_akademik,
              semester: formData.semester,
            }}
            errors={errors}
            onChange={handleInputChange}
            disabled={isFormDisabled}
            loading={optionsLoading}
            studyPrograms={studyPrograms}
            academicYears={academicYears}
          />

          {/* Activity Information */}
          <ActivityInfoForm
            data={{
              jenis_kegiatan: formData.jenis_kegiatan,
              id_tempat: formData.id_tempat,
              tanggal_bayar: formData.tanggal_bayar,
            }}
            errors={errors}
            onChange={handleInputChange}
            disabled={isFormDisabled}
            loading={optionsLoading}
            placesLoading={placesLoading}
            programsLoading={programsLoading}
            programs={programs}
            places={places}
          />

          {/* Location Information */}
          <LocationInfoForm
            data={{
              lokasi: formData.lokasi,
              alamat_lokasi: formData.alamat_lokasi,
            }}
            errors={errors}
            onChange={handleInputChange}
            disabled={isFormDisabled}
          />

          {/* File Uploads */}
          <FileUploadForm
            data={{
              bukti_btq: formData.bukti_btq,
              bukti_bayar: formData.bukti_bayar,
            }}
            errors={errors}
            onFileChange={handleFileChange}
            disabled={isFormDisabled}
          />

          {/* Additional Information */}
          <AdditionalInfoForm
            data={{
              keterangan: formData.keterangan || '',
            }}
            onChange={handleInputChange}
            disabled={isFormDisabled}
          />
        </form>

        <DialogFooter className="flex gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            disabled={loading}
          >
            Batal
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={loading || optionsLoading || programsLoading}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                Tambah Pendaftar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddRegistrantModal;