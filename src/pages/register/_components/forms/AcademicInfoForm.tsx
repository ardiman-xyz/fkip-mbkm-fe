// src/pages/register/_components/forms/AcademicInfoForm.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, AlertCircle } from 'lucide-react';

interface AcademicInfoFormProps {
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

function AcademicInfoForm({
  data,
  errors,
  onChange,
  disabled = false,
  loading = false,
  studyPrograms,
  academicYears,
}: AcademicInfoFormProps) {
  const semesters = [
    { value: 'Ganjil', label: 'Ganjil' },
    { value: 'Genap', label: 'Genap' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <GraduationCap className="h-4 w-4" />
          Informasi Akademik
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Study Program */}
        <div className="space-y-2">
          <Label htmlFor="id_prodi">Program Studi *</Label>
          <Select 
            value={data.id_prodi} 
            onValueChange={(value) => onChange('id_prodi', value)}
            disabled={disabled || loading}
          >
            <SelectTrigger className={errors.id_prodi ? 'border-red-500' : ''}>
              <SelectValue placeholder="Pilih program studi" />
            </SelectTrigger>
            <SelectContent>
              {studyPrograms.map((program) => (
                <SelectItem key={program.value} value={program.value}>
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
        </div>

        {/* Academic Year */}
        <div className="space-y-2">
          <Label htmlFor="tahun_akademik">Tahun Akademik *</Label>
          <Select 
            value={data.tahun_akademik} 
            onValueChange={(value) => onChange('tahun_akademik', value)}
            disabled={disabled || loading}
          >
            <SelectTrigger className={errors.tahun_akademik ? 'border-red-500' : ''}>
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

        {/* Semester */}
        <div className="space-y-2">
          <Label htmlFor="semester">Semester *</Label>
          <Select 
            value={data.semester} 
            onValueChange={(value) => onChange('semester', value)}
            disabled={disabled}
          >
            <SelectTrigger className={errors.semester ? 'border-red-500' : ''}>
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

export default AcademicInfoForm;