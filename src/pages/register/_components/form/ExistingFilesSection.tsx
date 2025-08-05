// src/pages/register/_components/form/ExistingFilesSection.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  CreditCard,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import type { DetailedRegistrant } from "@/types/registrant";

interface ExistingFilesSectionProps {
  registrant: DetailedRegistrant;
  onVerifyPayment?: () => void;
  onRejectPayment?: (reason: string) => void;
  disabled?: boolean;
}

export default function ExistingFilesSection({
  registrant,
  onVerifyPayment,
  onRejectPayment,
  disabled = false,
}: ExistingFilesSectionProps) {
  const handleViewFile = (url: string) => {
    window.open(url, "_blank");
  };

  const handleDownloadFile = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRejectPayment = () => {
    const reason = prompt("Alasan penolakan pembayaran:");
    if (reason && reason.trim()) {
      onRejectPayment?.(reason.trim());
    }
  };

  const getFileExtension = (url: string): string => {
    if (!url) return "";
    const extension = url.split(".").pop()?.toLowerCase() || "";
    return extension;
  };

  const getFileIcon = (url: string) => {
    const ext = getFileExtension(url);
    if (["pdf"].includes(ext)) {
      return <FileText className="h-4 w-4 text-red-600" />;
    } else if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
      return <FileText className="h-4 w-4 text-blue-600" />;
    }
    return <FileText className="h-4 w-4 text-gray-600" />;
  };

  const fileItems = [
    {
      label: "Bukti Pembayaran",
      url: registrant.bukti_bayar,
      status: registrant.payment_status,
      statusText: registrant.payment_status_text,
      icon: CreditCard,
      canVerify:
        registrant.payment_status === "unpaid" && registrant.bukti_bayar,
      canReject: registrant.payment_status === "paid",
      required: true,
    },
    {
      label: "Bukti Pembayaran 2",
      url: registrant.bukti_bayar2,
      status: null,
      statusText: registrant.bukti_bayar2 ? "Tersedia" : "Tidak ada",
      icon: CreditCard,
      canVerify: false,
      canReject: false,
      required: false,
    },
    {
      label: "Laporan",
      url: registrant.laporan,
      status: registrant.report_status,
      statusText: registrant.report_status_text,
      icon: FileText,
      canVerify: false,
      canReject: false,
      required: false,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          File yang Sudah Diupload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fileItems.map((item, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 ${
              item.required && !item.url ? "border-red-200 bg-red-50" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    item.url ? "bg-green-100" : "bg-gray-100"
                  }`}
                >
                  {item.url ? (
                    getFileIcon(item.url)
                  ) : (
                    <item.icon className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{item.label}</h4>
                    {item.required && (
                      <Badge
                        variant="outline"
                        className="text-xs text-red-600 border-red-200"
                      >
                        Wajib
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={item.url ? "default" : "secondary"}
                      className={
                        item.url
                          ? item.status === "paid" ||
                            item.status === "submitted"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-600"
                      }
                    >
                      {item.statusText}
                    </Badge>
                    {item.url && (
                      <span className="text-xs text-muted-foreground">
                        {getFileExtension(item.url).toUpperCase()} - File
                        tersedia
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {item.url ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewFile(item.url!)}
                    className="gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    Lihat
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleDownloadFile(
                        item.url!,
                        `${item.label}-${registrant.nim}.${getFileExtension(
                          item.url!
                        )}`
                      )
                    }
                    className="gap-1"
                  >
                    <Download className="h-3 w-3" />
                    Download
                  </Button>

                  {/* Payment verification buttons */}
                  {item.canVerify && onVerifyPayment && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={onVerifyPayment}
                      disabled={disabled}
                      className="gap-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Verifikasi
                    </Button>
                  )}

                  {item.canReject && onRejectPayment && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleRejectPayment}
                      disabled={disabled}
                      className="gap-1"
                    >
                      <XCircle className="h-3 w-3" />
                      Tolak
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {item.required && (
                    <div className="flex items-center gap-1 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">Belum diupload</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!item.url && item.required && (
              <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-700">
                    {item.label} wajib diupload untuk melanjutkan proses
                    pendaftaran
                  </p>
                </div>
              </div>
            )}

            {!item.url && !item.required && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Belum ada file yang diupload untuk {item.label.toLowerCase()}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* BTQ Field if available */}
        {registrant.btq && (
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Bukti BTQ</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {registrant.btq}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Link Kegiatan Magang if available */}
        {registrant.link_kegiatan_magang && (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ExternalLink className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Link Kegiatan Magang</h4>
                  <p className="text-sm text-muted-foreground mt-1 break-all">
                    {registrant.link_kegiatan_magang}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(registrant.link_kegiatan_magang, "_blank")
                }
                className="gap-1 ml-4"
              >
                <ExternalLink className="h-3 w-3" />
                Buka Link
              </Button>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Ringkasan Status File & Dokumen
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-blue-700">Status Pembayaran:</span>
                <div className="flex items-center gap-1">
                  {registrant.payment_status === "paid" ? (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  ) : (
                    <XCircle className="h-3 w-3 text-red-600" />
                  )}
                  <span
                    className={`font-medium ${
                      registrant.payment_status === "paid"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {registrant.payment_status_text}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-blue-700">Status Laporan:</span>
                <div className="flex items-center gap-1">
                  {registrant.report_status === "submitted" ? (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  ) : (
                    <XCircle className="h-3 w-3 text-red-600" />
                  )}
                  <span
                    className={`font-medium ${
                      registrant.report_status === "submitted"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {registrant.report_status_text}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {registrant.grade && (
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Nilai:</span>
                  <Badge className="bg-green-100 text-green-800">
                    {registrant.grade}
                  </Badge>
                </div>
              )}

              {registrant.tgl_bayar && (
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Tanggal Bayar:</span>
                  <span className="font-medium text-blue-900">
                    {new Date(registrant.tgl_bayar).toLocaleDateString("id-ID")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* File Completion Progress */}
          <div className="mt-4 pt-3 border-t border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-700">Kelengkapan File:</span>
              <span className="text-sm font-medium text-blue-900">
                {fileItems.filter((item) => item.url).length} /{" "}
                {fileItems.length} file
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    (fileItems.filter((item) => item.url).length /
                      fileItems.length) *
                    100
                  }%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
