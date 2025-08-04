import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Upload,
  AlertCircle,
  CheckCircle,
  CreditCard,
  FileText,
} from "lucide-react";

interface FileUploadSectionProps {
  data: {
    bukti_bayar?: File | undefined;
    bukti_btq?: File | undefined;
    surat_rekomendasi?: File | undefined;
  };
  errors: Record<string, string>;
  onFileChange: (
    field: "bukti_bayar" | "bukti_btq" | "surat_rekomendasi",
    file: File | null
  ) => void;
  disabled?: boolean;
}

export default function FileUploadSection({
  data,
  errors,
  onFileChange,
  disabled = false,
}: FileUploadSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Dokumen
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {/* Bukti Pembayaran */}
        <div className="space-y-2">
          <Label htmlFor="bukti_bayar">Bukti Pembayaran *</Label>
          <div className="relative">
            <Input
              id="bukti_bayar"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) =>
                onFileChange("bukti_bayar", e.target.files?.[0] || null)
              }
              className={errors.bukti_bayar ? "border-red-500" : ""}
              disabled={disabled}
            />
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
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
            Format: PDF, JPG, PNG (Max 5MB)
          </p>
        </div>

        {/* Bukti BTQ */}
        <div className="space-y-2">
          <Label htmlFor="bukti_btq">Bukti BTQ *</Label>
          <div className="relative">
            <Input
              id="bukti_btq"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) =>
                onFileChange("bukti_btq", e.target.files?.[0] || null)
              }
              className={errors.bukti_btq ? "border-red-500" : ""}
              disabled={disabled}
            />
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
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
            Format: PDF, JPG, PNG (Max 5MB)
          </p>
        </div>

        {/* Surat Rekomendasi */}
        <div className="space-y-2">
          <Label htmlFor="surat_rekomendasi">Surat Rekomendasi *</Label>
          <div className="relative">
            <Input
              id="surat_rekomendasi"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) =>
                onFileChange("surat_rekomendasi", e.target.files?.[0] || null)
              }
              className={errors.surat_rekomendasi ? "border-red-500" : ""}
              disabled={disabled}
            />
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          {data.surat_rekomendasi && (
            <div className="flex items-center gap-1 text-sm text-green-600">
              <CheckCircle className="h-3 w-3" />
              {data.surat_rekomendasi.name}
            </div>
          )}
          {errors.surat_rekomendasi && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors.surat_rekomendasi}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Format: PDF, JPG, PNG (Max 5MB)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
