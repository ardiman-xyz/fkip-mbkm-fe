// src/pages/register/_components/forms/AdditionalInfoForm.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface AdditionalInfoFormProps {
  data: {
    keterangan: string;
  };
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
}

function AdditionalInfoForm({
  data,
  onChange,
  disabled = false,
}: AdditionalInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-4 w-4" />
          Informasi Tambahan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="keterangan">Keterangan</Label>
          <Textarea
            id="keterangan"
            value={data.keterangan}
            onChange={(e) => onChange('keterangan', e.target.value)}
            placeholder="Catatan atau keterangan tambahan (opsional)"
            disabled={disabled}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Masukkan catatan tambahan jika diperlukan
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdditionalInfoForm;