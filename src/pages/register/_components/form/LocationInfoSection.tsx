import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, AlertCircle } from "lucide-react";

interface LocationInfoSectionProps {
  data: {
    lokasi: string;
    alamat_lokasi: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
}

export default function LocationInfoSection({
  data,
  errors,
  onChange,
  disabled = false,
}: LocationInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Informasi Lokasi
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="lokasi">Kota/Lokasi *</Label>
          <Input
            id="lokasi"
            value={data.lokasi}
            onChange={(e) => onChange("lokasi", e.target.value)}
            placeholder="Contoh: Kendari, Makassar, Jakarta"
            className={errors.lokasi ? "border-red-500" : ""}
            disabled={disabled}
          />
          {errors.lokasi && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors.lokasi}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="alamat_lokasi">Alamat Lengkap *</Label>
          <Textarea
            id="alamat_lokasi"
            value={data.alamat_lokasi}
            onChange={(e) => onChange("alamat_lokasi", e.target.value)}
            placeholder="Masukkan alamat lengkap tempat kegiatan"
            className={errors.alamat_lokasi ? "border-red-500" : ""}
            disabled={disabled}
            rows={3}
          />
          {errors.alamat_lokasi && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors.alamat_lokasi}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
