import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, AlertCircle, Loader2 } from "lucide-react";

interface AcademicInfoSectionProps {
  data: {
    id_prodi: string;
    tahun_akademik: string;
    semester: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
  loading?: boolean;
  studyPrograms: Array<{ value: string; label: string }>;
  academicYears: Array<{ value: string; label: string }>;
}

export default function AcademicInfoSection({
  data,
  errors,
  onChange,
  disabled = false,
  loading = false,
  studyPrograms,
  academicYears,
}: AcademicInfoSectionProps) {
  const semesters = [
    { value: "Ganjil", label: "Ganjil" },
    { value: "Genap", label: "Genap" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" />
          Informasi Akademik
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="id_prodi">Program Studi *</Label>
          <Select
            value={data.id_prodi}
            onValueChange={(value) => onChange("id_prodi", value)}
            disabled={disabled || loading}
          >
            <SelectTrigger className={errors.id_prodi ? "border-red-500" : ""}>
              <SelectValue placeholder="Pilih program studi" />
            </SelectTrigger>
            <SelectContent>
              {studyPrograms.map((program) => (
                <SelectItem key={program.value} value={`${program.value}`}>
                  {program.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.id_prodi && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors.id_prodi}
            </div>
          )}
          {loading && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Memuat program studi...
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tahun_akademik">Tahun Akademik *</Label>
          <Select
            value={data.tahun_akademik}
            onValueChange={(value) => onChange("tahun_akademik", value)}
            disabled={true}
          >
            <SelectTrigger
              className={errors.tahun_akademik ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Pilih tahun akademik" />
            </SelectTrigger>
            <SelectContent>
              {academicYears.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tahun_akademik && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors.tahun_akademik}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="semester">Semester *</Label>
          <Select
            value={data.semester}
            onValueChange={(value) => onChange("semester", value)}
            disabled={true}
          >
            <SelectTrigger className={errors.semester ? "border-red-500" : ""}>
              <SelectValue placeholder="Pilih semester" />
            </SelectTrigger>
            <SelectContent>
              {semesters.map((sem) => (
                <SelectItem key={sem.value} value={sem.value}>
                  {sem.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.semester && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors.semester}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
