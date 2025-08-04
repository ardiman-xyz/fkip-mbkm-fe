import React, { useState, useEffect } from "react";
import { useTitle } from "@/hooks/useTitle";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Loader2, AlertCircle, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { registrantService } from "@/services/registrantService";
import { settingService } from "@/services/settingService";
import { placeService } from "@/services/placeService";
import { programService } from "@/services/programService";

// Import form components
import AcademicInfoSection from "./_components/form/AcademicInfoSection";
import ActivityInfoSection from "./_components/form/ActivityInfoSection";
import LocationInfoSection from "./_components/form/LocationInfoSection";
import FileUploadSection from "./_components/form/FileUploadSection";
import AdditionalInfoSection from "./_components/form/AdditionalInfoSection";
import PreviewSection from "./_components/form/PreviewSection";
import TipsSection from "./_components/form/TipsSection";
import PersonalInfoSection from "./_components/form/PersonalInfoSection";

import type { CreateRegistrantData, FilterOptions } from "@/types/registrant";
import type { Place } from "@/types/place";
import type { Program } from "@/types/program";
import { studyProgramService } from "@/services/studyProgramService";

// Zod Schema for validation
const registrantSchema = z.object({
  nim: z
    .string()
    .min(1, "NIM wajib diisi")
    .regex(/^\d{8}$/, "NIM harus berupa angka 8 digit"),
  student_name: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  no_hp: z
    .string()
    .min(1, "Nomor HP wajib diisi")
    .regex(
      /^(\+62|62|0)[0-9]{9,13}$/,
      "Format nomor HP tidak valid (contoh: 08123456789)"
    ),
  ukuran_baju: z
    .string()
    .regex(
      /^(S|M|L|XL|XXL)$/,
      "Ukuran baju harus salah satu dari S, M, L, XL, XXL"
    ),

  id_prodi: z.string().min(1, "Program studi wajib dipilih"),
  tahun_akademik: z.string().min(1, "Tahun akademik wajib dipilih"),
  semester: z.string().min(1, "Semester wajib dipilih"),
  jenis_kegiatan: z.string().min(1, "Jenis kegiatan wajib dipilih"),
  id_tempat: z.string().min(1, "Tempat kegiatan wajib dipilih"),
  tanggal_bayar: z
    .string()
    .min(1, "Tanggal bayar wajib diisi")
    .refine((date) => {
      const paymentDate = new Date(date);
      const today = new Date();
      return paymentDate <= today;
    }, "Tanggal bayar tidak boleh lebih dari hari ini"),
  lokasi: z
    .string()
    .min(3, "Lokasi minimal 3 karakter")
    .max(100, "Lokasi maksimal 100 karakter"),
  alamat_lokasi: z
    .string()
    .min(10, "Alamat minimal 10 karakter")
    .max(255, "Alamat maksimal 255 karakter"),
  keterangan: z
    .string()
    .max(500, "Keterangan maksimal 500 karakter")
    .optional(),
});

const fileSchema = z.object({
  bukti_bayar: z
    .instanceof(File, { message: "Bukti pembayaran wajib diupload" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran file maksimal 5MB")
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(
          file.type
        ),
      "Format file harus JPG, PNG, atau PDF"
    ),
  bukti_btq: z
    .instanceof(File, { message: "Bukti BTQ wajib diupload" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran file maksimal 5MB")
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(
          file.type
        ),
      "Format file harus JPG, PNG, atau PDF"
    )
    .optional(),
  surat_rekomendasi: z
    .instanceof(File, { message: "Surat rekomendasi wajib diupload" })
    .refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran file maksimal 5MB")
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(
          file.type
        ),
      "Format file harus JPG, PNG, atau PDF"
    )
    .optional(),
});

type FormData = z.infer<typeof registrantSchema>;
type FileData = z.infer<typeof fileSchema>;

interface FormErrors {
  [key: string]: string;
}

const RegisterCreate = () => {
  useTitle("Tambah Pendaftar Baru - Admin Dashboard");
  const navigate = useNavigate();

  // Loading states
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [programsLoading, setProgramsLoading] = useState(true);

  // Data states
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null
  );
  const [currentSetting, setCurrentSetting] = useState<any>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    nim: "",
    student_name: "",
    no_hp: "",
    ukuran_baju: "",
    jenis_kegiatan: "",
    id_prodi: "",
    id_tempat: "",
    lokasi: "",
    alamat_lokasi: "",
    keterangan: "",
    tahun_akademik: "",
    semester: "",
    tanggal_bayar: "",
  });

  const [fileData, setFileData] = useState<Partial<FileData>>({
    bukti_bayar: undefined,
    bukti_btq: undefined,
    surat_rekomendasi: undefined,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setOptionsLoading(true);
      setPlacesLoading(true);
      setProgramsLoading(true);

      const results = await Promise.allSettled([
        registrantService.getFilterOptions(),
        settingService.getCurrentSetting(),
        placeService.getActivePlaces(),
        programService.getActivePrograms(),
        studyProgramService.getAllStudyProgram(),
      ]);

      if (results[0].status === "fulfilled") {
        setFilterOptions(results[0].value);
      }

      if (results[1].status === "fulfilled") {
        const setting = results[1].value;
        setCurrentSetting(setting);
        setFormData((prev) => ({
          ...prev,
          tahun_akademik: setting.tahun_akademik,
          semester: setting.semester,
        }));
      } else if (
        results[0].status === "fulfilled" &&
        (results[0] as PromiseFulfilledResult<FilterOptions>).value
          .academic_years.length > 0
      ) {
        const filterOptionsValue = (
          results[0] as PromiseFulfilledResult<FilterOptions>
        ).value;
        setFormData((prev) => ({
          ...prev,
          tahun_akademik: filterOptionsValue.academic_years[0].value,
          semester: "Ganjil",
        }));
      }

      if (results[2].status === "fulfilled") {
        setPlaces(results[2].value);
      }

      if (results[3].status === "fulfilled") {
        setPrograms(results[3].value);
      }
    } catch (error) {
      console.error("Failed to load initial data:", error);
      toast.error("Gagal memuat data awal");
    } finally {
      setOptionsLoading(false);
      setPlacesLoading(false);
      setProgramsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (field: keyof FileData, file: File | null) => {
    setFileData((prev) => ({ ...prev, [field]: file || undefined }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const formResult = registrantSchema.safeParse(formData);
    if (!formResult.success) {
      formResult.error.issues.forEach((error) => {
        newErrors[error.path[0] as string] = error.message;
      });
    }

    const fileResult = fileSchema.safeParse(fileData);
    if (!fileResult.success) {
      fileResult.error.issues.forEach((error) => {
        newErrors[error.path[0] as string] = error.message;
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Harap perbaiki kesalahan pada form");
      return;
    }

    setLoading(true);
    try {
      const cleanData: any = {
        nim: formData.nim.trim(),
        no_hp: formData.no_hp.trim(),
        jenis_kegiatan: formData.jenis_kegiatan,
        id_prodi: Number(formData.id_prodi),
        lokasi: formData.lokasi.trim(),
        tahun_akademik: formData.tahun_akademik,
        semester: formData.semester as "Ganjil" | "Genap",
        tgl_bayar: formData.tanggal_bayar,
        ukuran_baju: formData.ukuran_baju,
      };

      const newRegistrant = await registrantService.createRegistrant(cleanData);

      const uploadPromises = [];

      //   if (fileData.bukti_btq) {
      //     uploadPromises.push(
      //       registrantService.uploadBTQProof(newRegistrant.id, fileData.bukti_btq)
      //     );
      //   }

      if (fileData.bukti_bayar) {
        uploadPromises.push(
          registrantService.uploadPaymentProof(
            newRegistrant.id,
            fileData.bukti_bayar
          )
        );
      }

      if (uploadPromises.length > 0) {
        await Promise.all(uploadPromises);
      }

      toast.success("Pendaftar berhasil ditambahkan!", {
        description: `Telah terdaftar`,
        duration: 5000,
      });

      navigate("/register/list");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menambahkan pendaftar";
      toast.error("Gagal menambahkan pendaftar", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    const hasData =
      Object.values(formData).some((value) => value && value !== "") ||
      Object.values(fileData).some((file) => file !== undefined);

    if (hasData && !loading) {
      const confirmed = window.confirm(
        "Data yang sudah diisi akan hilang. Yakin ingin kembali?"
      );
      if (!confirmed) return;
    }

    navigate("/register/list");
  };

  const studyPrograms = filterOptions?.study_programs || [];
  const academicYears = filterOptions?.academic_years || [];

  const isFormDisabled = loading || optionsLoading;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            disabled={loading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Tambah Pendaftar Baru
            </h1>
            <p className="text-muted-foreground">
              Lengkapi form berikut untuk menambahkan pendaftar baru ke program
              MBKM
            </p>
          </div>
        </div>
      </div>

      {/* Current Period Info */}
      {currentSetting && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">
                  Periode Aktif: {currentSetting.tahun_akademik}{" "}
                  {currentSetting.semester}
                </span>
                <Badge className="bg-green-100 text-green-700 text-xs">
                  Auto Selected
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Summary */}
      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Terdapat {Object.keys(errors).length} kesalahan yang perlu
            diperbaiki. Periksa kembali form di bawah ini.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <PersonalInfoSection
          data={{
            nim: formData.nim,
            student_name: formData.student_name,
            no_hp: formData.no_hp,
            ukuran_baju: formData.ukuran_baju,
          }}
          errors={errors}
          onChange={handleInputChange}
          disabled={isFormDisabled}
        />

        {/* Academic Information */}
        <AcademicInfoSection
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
        <ActivityInfoSection
          data={{
            jenis_kegiatan: formData.jenis_kegiatan,
            id_tempat: formData.id_tempat,
            tanggal_bayar: formData.tanggal_bayar,
          }}
          errors={errors}
          onChange={handleInputChange}
          disabled={isFormDisabled}
          placesLoading={placesLoading}
          programsLoading={programsLoading}
          programs={programs}
          places={places}
        />

        {/* Location Information */}
        <LocationInfoSection
          data={{
            lokasi: formData.lokasi,
            alamat_lokasi: formData.alamat_lokasi,
          }}
          errors={errors}
          onChange={handleInputChange}
          disabled={isFormDisabled}
        />

        {/* File Upload */}
        <FileUploadSection
          data={fileData}
          errors={errors}
          onFileChange={handleFileChange}
          disabled={isFormDisabled}
        />

        {/* Additional Information */}
        <AdditionalInfoSection
          data={{
            keterangan: formData.keterangan || "",
          }}
          onChange={handleInputChange}
          disabled={isFormDisabled}
          errors={errors}
        />

        {/* Preview Data */}
        <PreviewSection formData={formData} />

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="text-sm text-muted-foreground">
            * Field wajib diisi
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={
                loading || optionsLoading || programsLoading || placesLoading
              }
              className="min-w-[140px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Pendaftar
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* Loading Overlay */}
      {(optionsLoading || programsLoading || placesLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-sm font-medium">Memuat data...</span>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <TipsSection />
    </div>
  );
};

export default RegisterCreate;
