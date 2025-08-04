// src/pages/register/_components/forms/PersonalInfoForm.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, Mail, AlertCircle } from 'lucide-react';

interface PersonalInfoFormProps {
  data: {
    nim: string;
    student_name: string;
    no_hp: string;
    email: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
}

function PersonalInfoForm({
  data,
  errors,
  onChange,
  disabled = false,
}: PersonalInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <User className="h-4 w-4" />
          Informasi Pribadi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* NIM */}
        <div className="space-y-2">
          <Label htmlFor="nim">NIM *</Label>
          <Input
            id="nim"
            value={data.nim}
            onChange={(e) => onChange('nim', e.target.value)}
            placeholder="Masukkan NIM mahasiswa"
            className={errors.nim ? 'border-red-500' : ''}
            disabled={disabled}
          />
          {errors.nim && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors.nim}
            </div>
          )}
        </div>

        {/* Student Name */}
        <div className="space-y-2">
          <Label htmlFor="student_name">Nama Mahasiswa *</Label>
          <Input
            id="student_name"
            value={data.student_name}
            onChange={(e) => onChange('student_name', e.target.value)}
            placeholder="Masukkan nama lengkap mahasiswa"
            className={errors.student_name ? 'border-red-500' : ''}
            disabled={disabled}
          />
          {errors.student_name && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors.student_name}
            </div>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="no_hp">Nomor HP *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="no_hp"
              value={data.no_hp}
              onChange={(e) => onChange('no_hp', e.target.value)}
              placeholder="08xxxxxxxxxx"
              className={`pl-10 ${errors.no_hp ? 'border-red-500' : ''}`}
              disabled={disabled}
            />
          </div>
          {errors.no_hp && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors.no_hp}
            </div>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="mahasiswa@email.com"
              className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
              disabled={disabled}
            />
          </div>
          {errors.email && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors.email}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default PersonalInfoForm;