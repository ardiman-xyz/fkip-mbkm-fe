import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, User, Mail, Phone, MapPin, Calendar } from "lucide-react";

interface PreviewSectionProps {
  formData: {
    nim: string;
    student_name: string;
    ukuran_baju: string;
    no_hp: string;
    lokasi: string;
    tahun_akademik: string;
    semester: string;
  };
}

export default function PreviewSection({ formData }: PreviewSectionProps) {
  const hasData = formData.nim || formData.student_name || formData.ukuran_baju;

  if (!hasData) return null;

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <CheckCircle className="h-4 w-4" />
          Preview Data Pendaftar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {formData.student_name && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            <span className="text-sm">
              <span className="font-medium">Nama:</span> {formData.student_name}
              {formData.nim && ` (${formData.nim})`}
            </span>
          </div>
        )}
        {formData.ukuran_baju && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-600" />
            <span className="text-sm">
              <span className="font-medium">Ukuran Baju:</span>{" "}
              {formData.ukuran_baju}
            </span>
          </div>
        )}
        {formData.no_hp && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-blue-600" />
            <span className="text-sm">
              <span className="font-medium">HP:</span> {formData.no_hp}
            </span>
          </div>
        )}
        {formData.lokasi && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-sm">
              <span className="font-medium">Lokasi:</span> {formData.lokasi}
            </span>
          </div>
        )}
        {formData.tahun_akademik && formData.semester && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-sm">
              <span className="font-medium">Periode:</span>{" "}
              {formData.tahun_akademik} {formData.semester}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
