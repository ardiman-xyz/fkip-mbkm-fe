import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, Mail, AlertCircle, Shirt } from "lucide-react";

interface PersonalInfoSectionProps {
  data: {
    nim: string;
    student_name: string;
    no_hp: string;
    ukuran_baju: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
}

export default function PersonalInfoSection({
  data,
  errors,
  onChange,
  disabled = false,
}: PersonalInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Informasi Pribadi
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {/* NIM */}
        <div className="space-y-2">
          <Label htmlFor="nim">NIM *</Label>
          <Input
            id="nim"
            value={data.nim}
            onChange={(e) => onChange("nim", e.target.value)}
            placeholder="Masukkan NIM mahasiswa"
            className={errors.nim ? "border-red-500" : ""}
            disabled={disabled}
            maxLength={15}
          />
          {errors.nim && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors.nim}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Format: 10-15 digit angka
          </p>
        </div>

        {/* Student Name */}
        <div className="space-y-2">
          <Label htmlFor="student_name">Nama Mahasiswa *</Label>
          <Input
            id="student_name"
            value={data.student_name}
            onChange={(e) => onChange("student_name", e.target.value)}
            placeholder="Masukkan nama lengkap mahasiswa"
            className={errors.student_name ? "border-red-500" : ""}
            disabled={disabled}
            maxLength={100}
          />
          {errors.student_name && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors.student_name}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {data.student_name.length}/100 karakter
          </p>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="no_hp">Nomor HP *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="no_hp"
              value={data.no_hp}
              onChange={(e) => onChange("no_hp", e.target.value)}
              placeholder="08xxxxxxxxxx"
              className={`pl-10 ${errors.no_hp ? "border-red-500" : ""}`}
              disabled={disabled}
              maxLength={15}
            />
          </div>
          {errors.no_hp && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors.no_hp}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Format: 08xxx, 62xxx, atau +62xxx
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Ukuran baju *</Label>
          <div className="relative">
            <Shirt className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="ukuran_baju"
              type="string"
              value={data.ukuran_baju}
              onChange={(e) => onChange("ukuran_baju", e.target.value)}
              placeholder="M, L, XL, atau XXL"
              className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
              disabled={disabled}
              maxLength={100}
            />
          </div>
          {errors.ukuran_baju && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="h-3 w-3" />
              {errors.ukuran_baju}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            Ukuran baju akan digunakan untuk seragam kegiatan
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
