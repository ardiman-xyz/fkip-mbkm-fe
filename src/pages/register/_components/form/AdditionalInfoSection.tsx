import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, AlertCircle } from "lucide-react";

interface AdditionalInfoSectionProps {
  data: {
    keterangan: string;
  };
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
  errors: Record<string, string>;
}

export default function AdditionalInfoSection({
  data,
  onChange,
  disabled = false,
  errors,
}: AdditionalInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
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
            onChange={(e) => onChange("keterangan", e.target.value)}
            placeholder="Catatan atau keterangan tambahan (opsional)"
            disabled={disabled}
            rows={3}
            maxLength={500}
          />
          {errors.keterangan && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors.keterangan}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {data.keterangan.length}/500 karakter
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
