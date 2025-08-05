// src/pages/register/_components/RegisterTable.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  User,
  GraduationCap,
  MapPin,
  Phone,
  Calendar,
  Loader2,
  Users,
  CreditCard,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import type { Registrant } from "@/types/registrant";
import { useNavigate } from "react-router";

interface RegisterTableProps {
  registrants: Registrant[];
  loading?: boolean;
  currentPage?: number;
  perPage?: number;
  onRefresh: () => void;
}

function RegisterTable({
  registrants,
  loading = false,
  currentPage = 1,
  perPage = 15,
  onRefresh,
}: RegisterTableProps) {
  const navigate = useNavigate();

  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const getStatusBadge = (status: string, statusColor: string) => {
    const colorMap: { [key: string]: string } = {
      success: "bg-green-100 text-green-800 hover:bg-green-200",
      primary: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
      danger: "bg-red-100 text-red-800 hover:bg-red-200",
      secondary: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    };

    return (
      <Badge className={colorMap[statusColor] || colorMap["secondary"]}>
        {status}
      </Badge>
    );
  };

  const getPaymentStatusIcon = (paymentStatus: string) => {
    return paymentStatus === "paid" ? (
      <CheckCircle className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-red-600" />
    );
  };

  const getReportStatusIcon = (reportStatus: string) => {
    return reportStatus === "submitted" ? (
      <FileText className="h-4 w-4 text-blue-600" />
    ) : (
      <FileText className="h-4 w-4 text-gray-400" />
    );
  };

  const handleView = (registrant: Registrant) => {
    toast.info(`Melihat detail: ${registrant.student_name}`);
    // TODO: Navigate to detail page or open modal
  };

  const handleEdit = (registrant: Registrant) => {
    navigate(`/register/${registrant.id}/edit`);
  };

  const handleDelete = async (registrant: Registrant) => {
    if (!confirm(`Hapus pendaftar ${registrant.student_name}?`)) return;

    setActionLoading(registrant.id);
    try {
      // TODO: Implement delete API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      toast.success(`${registrant.student_name} berhasil dihapus`);
      onRefresh();
    } catch (error) {
      toast.error("Gagal menghapus pendaftar");
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyPayment = async (registrant: Registrant) => {
    setActionLoading(registrant.id);
    try {
      // TODO: Implement verify payment API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      toast.success(
        `Pembayaran ${registrant.student_name} berhasil diverifikasi`
      );
      onRefresh();
    } catch (error) {
      toast.error("Gagal verifikasi pembayaran");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="space-y-4 p-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (registrants.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">
            Tidak ada pendaftar ditemukan
          </h3>
          <p className="text-muted-foreground mt-2">
            Coba sesuaikan filter Anda atau tambah pendaftar baru
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium w-16">No</th>
                <th className="text-left p-4 font-medium">Mahasiswa</th>
                <th className="text-left p-4 font-medium">Program & Lokasi</th>
                <th className="text-left p-4 font-medium">Periode</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Pembayaran</th>
                <th className="text-left p-4 font-medium">Laporan</th>
                <th className="text-right p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {registrants.map((registrant, index) => (
                <tr key={registrant.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {(currentPage - 1) * perPage + index + 1}
                      </span>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          {registrant.student_name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground">
                            {registrant.nim}
                          </span>
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {registrant.no_hp}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {registrant.formatted_activity_type}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {registrant.location_city}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {registrant.study_program}
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {registrant.tahun_akademik}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {registrant.semester}
                      </Badge>
                    </div>
                  </td>

                  <td className="p-4">
                    {getStatusBadge(
                      registrant.status_text,
                      registrant.status_color
                    )}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getPaymentStatusIcon(registrant.payment_status)}
                      <span className="text-sm">
                        {registrant.payment_status_text}
                      </span>
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getReportStatusIcon(registrant.report_status)}
                      <span className="text-sm">
                        {registrant.report_status_text}
                      </span>
                      {registrant.grade && (
                        <Badge variant="outline" className="text-xs">
                          {registrant.grade}
                        </Badge>
                      )}
                    </div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            disabled={actionLoading === registrant.id}
                          >
                            {actionLoading === registrant.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleView(registrant)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(registrant)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />

                          {registrant.payment_status === "paid" &&
                            registrant.status === "pending_payment" && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleVerifyPayment(registrant)
                                  }
                                  className="text-green-600"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Verifikasi Pembayaran
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}

                          <DropdownMenuItem
                            onClick={() => handleDelete(registrant)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default RegisterTable;
