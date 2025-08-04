// src/pages/register/_components/forms/FileUploadForm.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

interface FileUploadFormProps {
  data: {
    bukti_btq: File | null;
    bukti_bayar: File | null;
  };
  errors: Record<string, string>;
  onFileChange: (field: 'bukti_btq' | 'bukti_bayar', file: File | null) => void;
  disabled?: boolean;
}

function FileUploadForm({
  data,
  errors,
  onFileChange,
  disabled = false,
}: FileUploadFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Upload className="h-4 w-4" />
          Upload Dokumen
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {/* BTQ Proof */}
        <div className="space-y-2">
          <Label htmlFor="bukti_btq">Bukti BTQ *</Label>
          <div className="relative">
            <Input
              id="bukti_btq"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => onFileChange('bukti_btq', e.target.files?.[0] || null)}
              className={errors.bukti_btq ? 'border-red-500' : ''}
              disabled={disabled}
            />
          </div>
          {data.bukti_btq && (
            <div className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle className="h-3 w-3" />
              {data.bukti_btq.name}
            </div>
          )}
          {errors.bukti_btq && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors.bukti_btq}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Format: PDF, JPG, JPEG, PNG (Max 5MB)
          </p>
        </div>

        {/* Payment Proof */}
        <div className="space-y-2">
          <Label htmlFor="bukti_bayar">Bukti Bayar *</Label>
          <div className="relative">
            <Input
              id="bukti_bayar"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => onFileChange('bukti_bayar', e.target.files?.[0] || null)}
              className={errors.bukti_bayar ? 'border-red-500' : ''}
              disabled={disabled}
            />
          </div>
          {data.bukti_bayar && (
            <div className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle className="h-3 w-3" />
              {data.bukti_bayar.name}
            </div>
          )}
          {errors.bukti_bayar && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors.bukti_bayar}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Format: PDF, JPG, JPEG, PNG (Max 5MB)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default FileUploadForm;