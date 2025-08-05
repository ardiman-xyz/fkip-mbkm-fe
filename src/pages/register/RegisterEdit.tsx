import React, { useState, useEffect } from "react";
import { useTitle } from "@/hooks/useTitle";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  Calendar,
  Trash2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { registrantService } from "@/services/registrantService";
import { settingService } from "@/services/settingService";
import { placeService } from "@/services/placeService";
import { programService } from "@/services/programService";
import { studyProgramService } from "@/services/studyProgramService";

// Import form components
import AcademicInfoSection from "./_components/form/AcademicInfoSection";
import ActivityInfoSection from "./_components/form/ActivityInfoSection";
import LocationInfoSection from "./_components/form/LocationInfoSection";
import FileUploadSection from "./_components/form/FileUploadSection";
import PreviewSection from "./_components/form/PreviewSection";
import PersonalInfoSection from "./_components/form/PersonalInfoSection";

import type {
  UpdateRegistrantData,
  FilterOptions,
  DetailedRegistrant,
} from "@/types/registrant";
import type { Place } from "@/types/place";
import type { Program } from "@/types/program";
import ExistingFilesSection from "./_components/form/ExistingFilesSection";

// Validation schema for updates
const updateSchema = z.object({
  nim: z.string().optional(),
  no_hp: z.string().optional(),
  jenis_kegiatan: z.string().optional(),
  id_prodi: z.coerce.number().optional(),
  lokasi: z.string().optional(),
  tahun_akademik: z.string().optional(),
  semester: z.enum(["Ganjil", "Genap"]).optional(),
  tgl_bayar: z.string().optional(),
  ukuran_baju: z.string().optional(),
  nilai: z.string().optional(),
});

type FormData = z.infer<typeof updateSchema>;

interface FormErrors {
  [key: string]: string;
}

const RegisterEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useTitle("Edit Pendaftar - Admin Dashboard");

  // Loading states
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [placesLoading, setPlacesLoading] = useState(true);
  const [programsLoading, setProgramsLoading] = useState(true);

  // Data states
  const [registrant, setRegistrant] = useState<DetailedRegistrant | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(
    null
  );
  const [currentSetting, setCurrentSetting] = useState<any>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);

  // Form state
  const [formData, setFormData] = useState<FormData>({});
  const [fileData, setFileData] = useState<{
    bukti_bayar?: File;
    bukti_btq?: File;
    surat_rekomendasi?: File;
  }>({});
  const [errors, setErrors] = useState<FormErrors>({});

  // Load registrant data
  const loadRegistrantData = async () => {
    if (!id) {
      navigate("/register/list");
      return;
    }

    try {
      setInitialLoading(true);
      const data = await registrantService.getRegistrantById(Number(id));

      if (!data) {
        toast.error("Pendaftar tidak ditemukan");
        navigate("/register/list");
        return;
      }

      setRegistrant(data);

      // Initialize form with existing data
      setFormData({
        nim: data.nim,
        no_hp: data.no_hp,
        jenis_kegiatan: data.jenis_kegiatan,
        lokasi: data.lokasi,
        tahun_akademik: data.tahun_akademik,
        semester: data.semester as "Ganjil" | "Genap",
        tgl_bayar: data.tgl_bayar,
        ukuran_baju: data.ukuran_baju,
        nilai: data.nilai || "",
      });
    } catch (error) {
      console.error("Failed to load registrant:", error);
      toast.error("Gagal memuat data pendaftar");
      navigate("/register/list");
    } finally {
      setInitialLoading(false);
    }
  };

  // Load supporting data
  const loadSupportingData = async () => {
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
        setCurrentSetting(results[1].value);
      }

      if (results[2].status === "fulfilled") {
        setPlaces(results[2].value);
      }

      if (results[3].status === "fulfilled") {
        setPrograms(results[3].value);
      }
    } catch (error) {
      console.error("Failed to load supporting data:", error);
      toast.error("Gagal memuat data pendukung");
    } finally {
      setOptionsLoading(false);
      setPlacesLoading(false);
      setProgramsLoading(false);
    }
  };

  // Initialize data loading
  useEffect(() => {
    loadRegistrantData();
    loadSupportingData();
  }, [id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFileData((prev) => ({ ...prev, [field]: file || undefined }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    try {
      updateSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.issues.forEach((issue) => {
          newErrors[issue.path[0] as string] = issue.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registrant) return;

    if (!validateForm()) {
      toast.error("Harap perbaiki kesalahan pada form");
      return;
    }

    setLoading(true);
    try {
      // Prepare update data - only include changed fields
      const updateData: UpdateRegistrantData = {};

      Object.keys(formData).forEach((key) => {
        const currentValue = formData[key as keyof FormData];
        const originalValue = registrant[key as keyof DetailedRegistrant];

        if (
          currentValue !== originalValue &&
          currentValue !== undefined &&
          currentValue !== ""
        ) {
          updateData[key as keyof UpdateRegistrantData] = currentValue as any;
        }
      });

      // Only update if there are changes
      let updated = false;
      if (Object.keys(updateData).length > 0) {
        await registrantService.updateRegistrant(registrant.id, updateData);
        updated = true;
      }

      // Handle file uploads
      if (fileData.bukti_bayar) {
        await registrantService.uploadPaymentProof(
          registrant.id,
          fileData.bukti_bayar
        );
        updated = true;
      }

      if (updated) {
        toast.success("Pendaftar berhasil diperbarui!");
        navigate("/register/list");
      } else {
        toast.info("Tidak ada perubahan yang dilakukan");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal memperbarui pendaftar";
      toast.error("Gagal memperbarui pendaftar", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!registrant) return;

    const confirmed = window.confirm(
      `Hapus pendaftar ${registrant.student_name}?\n\nTindakan ini tidak dapat dibatalkan.`
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      await registrantService.deleteRegistrant(registrant.id);

      toast.success("Pendaftar berhasil dihapus", {
        description: `${registrant.student_name} telah dihapus dari sistem`,
        duration: 5000,
      });

      navigate("/register/list");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menghapus pendaftar";
      toast.error("Gagal menghapus pendaftar", {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!registrant) return;

    try {
      setLoading(true);
      const updatedRegistrant = await registrantService.verifyPayment(
        registrant.id
      );
      setRegistrant(updatedRegistrant);
      toast.success("Pembayaran berhasil diverifikasi");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal verifikasi pembayaran";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectPayment = async (reason: string) => {
    if (!registrant) return;

    try {
      setLoading(true);
      const updatedRegistrant = await registrantService.rejectPayment(
        registrant.id,
        reason
      );
      setRegistrant(updatedRegistrant);
      toast.success("Pembayaran berhasil ditolak");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal menolak pembayaran";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    const hasChanges =
      Object.keys(formData).some((key) => {
        const currentValue = formData[key as keyof FormData];
        const originalValue = registrant?.[key as keyof DetailedRegistrant];
        return currentValue !== originalValue;
      }) || Object.values(fileData).some((file) => file !== undefined);

    if (hasChanges && !loading) {
      const confirmed = window.confirm(
        "Perubahan yang belum disimpan akan hilang. Yakin ingin kembali?"
      );
      if (!confirmed) return;
    }

    navigate("/register/list");
  };

  const studyPrograms = filterOptions?.study_programs || [];
  const academicYears = filterOptions?.academic_years || [];

  const isFormDisabled = loading || initialLoading || optionsLoading;
  const hasErrors = Object.keys(errors).length > 0;

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat data pendaftar...</p>
        </div>
      </div>
    );
  }

  if (!registrant) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Pendaftar Tidak Ditemukan</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            Data pendaftar yang Anda cari tidak ditemukan.
          </p>
          <Button onClick={() => navigate("/register/list")}>
            Kembali ke Daftar
          </Button>
        </div>
      </div>
    );
  }

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
              Edit Pendaftar
            </h1>
            <p className="text-muted-foreground">
              Edit data pendaftar {registrant.student_name} ({registrant.nim})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Hapus
          </Button>
        </div>
      </div>

      {/* Status Info */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Status: {registrant.status_text}
                </span>
                <Badge className="bg-blue-100 text-blue-700 text-xs">
                  {registrant.formatted_activity_type}
                </Badge>
              </div>
              <div className="text-sm text-blue-700">
                Periode: {registrant.tahun_akademik} {registrant.semester}
              </div>
            </div>
            <div className="text-sm text-blue-700">
              Terdaftar:{" "}
              {new Date(registrant.created_at).toLocaleDateString("id-ID")}
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* Existing Files Section */}
      <ExistingFilesSection
        registrant={registrant}
        onVerifyPayment={handleVerifyPayment}
        onRejectPayment={handleRejectPayment}
        disabled={loading}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <PersonalInfoSection
          data={{
            nim: formData.nim || "",
            student_name: registrant.student_name,
            no_hp: formData.no_hp || "",
            ukuran_baju: formData.ukuran_baju || "",
          }}
          errors={errors}
          onChange={handleInputChange}
          disabled={isFormDisabled}
        />

        {/* Academic Information */}
        <AcademicInfoSection
          data={{
            id_prodi: String(formData.id_prodi || ""),
            tahun_akademik: formData.tahun_akademik || "",
            semester: formData.semester || "",
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
            jenis_kegiatan: formData.jenis_kegiatan || "",
            id_tempat: "", // Not used in edit for now
            tanggal_bayar: formData.tgl_bayar || "",
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
            lokasi: formData.lokasi || "",
            alamat_lokasi: "", // Not available in current data structure
          }}
          errors={errors}
          onChange={handleInputChange}
          disabled={isFormDisabled}
        />

        {/* File Upload for new files */}
        <FileUploadSection
          data={fileData}
          errors={errors}
          onFileChange={handleFileChange}
          disabled={isFormDisabled}
        />

        {/* Grade Section (if applicable) */}
        {(registrant.status === "awaiting_assessment" ||
          registrant.status === "completed") && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Penilaian</h3>
                <div className="space-y-2">
                  <label htmlFor="nilai" className="text-sm font-medium">
                    Nilai
                  </label>
                  <select
                    id="nilai"
                    value={formData.nilai || ""}
                    onChange={(e) => handleInputChange("nilai", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    disabled={isFormDisabled}
                  >
                    <option value="">Pilih Nilai</option>
                    <option value="A">A</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B">B</option>
                    <option value="B-">B-</option>
                    <option value="C+">C+</option>
                    <option value="C">C</option>
                    <option value="C-">C-</option>
                    <option value="D+">D+</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Preview Data */}
        <PreviewSection
          formData={{
            nim: formData.nim || "",
            student_name: registrant.student_name,
            ukuran_baju: formData.ukuran_baju || "",
            no_hp: formData.no_hp || "",
            lokasi: formData.lokasi || "",
            tahun_akademik: formData.tahun_akademik || "",
            semester: formData.semester || "",
          }}
        />

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <div className="text-sm text-muted-foreground">
            * Hanya ubah field yang perlu diperbarui
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
                  Simpan Perubahan
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
    </div>
  );
};

export default RegisterEdit;
