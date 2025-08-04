import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function TipsSection() {
  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-2">
          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
          <div className="text-sm text-green-800">
            <p className="font-medium mb-2">💡 Tips Pengisian Form:</p>
            <ul className="space-y-1 text-xs">
              <li>
                • Pastikan NIM dan data pribadi sesuai dengan identitas
                mahasiswa
              </li>
              <li>
                • Upload file dalam format PDF atau gambar (JPG, PNG) maksimal
                5MB
              </li>
              <li>
                • Pilih tempat kegiatan yang masih memiliki kuota tersedia
              </li>
              <li>• Tanggal bayar tidak boleh lebih dari hari ini</li>
              <li>• Semua dokumen wajib diupload sebelum menyimpan</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
