

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  Clock,
  School,
  Settings as SettingsIcon,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Play,
  CalendarDays
} from 'lucide-react';
import type { Setting } from '@/types/setting';

interface SettingTableProps {
  settings: Setting[];
  loading?: boolean;
  currentPage?: number;
  perPage?: number;
  onView: (setting: Setting) => void;
  onEdit: (setting: Setting) => void;
  onDelete: (setting: Setting) => void;
  onToggleStatus: (setting: Setting) => void;
  onToggleSchoolStatus: (setting: Setting) => void;
  onActivate: (setting: Setting) => void;
  togglingStatusId?: number | null;
  togglingSchoolStatusId?: number | null;
  activatingId?: number | null;
}

export function SettingTable({
  settings,
  loading = false,
  currentPage = 1,
  perPage = 15,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleSchoolStatus,
  onActivate,
  togglingStatusId = null,
  togglingSchoolStatusId = null,
  activatingId = null,
}: SettingTableProps) {
  const getStatusBadge = (setting: Setting) => {
    const isToggling = togglingStatusId === setting.id;
    
    if (isToggling) {
      return (
        <Badge variant="secondary" className="animate-pulse">
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          Mengubah...
        </Badge>
      );
    }

    return (
      <Badge 
        variant={setting.status === 'Y' ? 'default' : 'secondary'}
        className={setting.status === 'Y' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
      >
        <div className={`w-2 h-2 rounded-full mr-1 ${setting.status === 'Y' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        {setting.status_text}
      </Badge>
    );
  };

  const getSchoolStatusBadge = (setting: Setting) => {
    const isToggling = togglingSchoolStatusId === setting.id;
    
    if (isToggling) {
      return (
        <Badge variant="secondary" className="animate-pulse">
          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          Mengubah...
        </Badge>
      );
    }

    return (
      <Badge 
        variant={setting.status_sekolah === 'Y' ? 'default' : 'secondary'}
        className={setting.status_sekolah === 'Y' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
      >
        <School className="mr-1 h-3 w-3" />
        {setting.status_sekolah_text}
      </Badge>
    );
  };

  const getPeriodBadge = (setting: Setting) => {
    if (setting.is_active_period) {
      return (
        <Badge className="bg-green-100 text-green-800 text-xs">
          <Clock className="h-3 w-3 mr-1" />
          Periode Aktif
        </Badge>
      );
    }

    const today = new Date().toISOString().split('T')[0];
    const startDate = new Date(setting.tgl_mulai);
    const endDate = new Date(setting.tgl_berakhir);
    
    if (today < setting.tgl_mulai) {
      return (
        <Badge variant="outline" className="text-xs">
          Akan Datang
        </Badge>
      );
    } else if (today > setting.tgl_berakhir) {
      return (
        <Badge variant="destructive" className="text-xs">
          Berakhir
        </Badge>
      );
    }

    return null;
  };

  const getStatusToggleItem = (setting: Setting) => {
    const isToggling = togglingStatusId === setting.id;
    const isActive = setting.status === 'Y';
    
    if (isToggling) {
      return (
        <DropdownMenuItem disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Mengubah Status...
        </DropdownMenuItem>
      );
    }

    return (
      <DropdownMenuItem 
        onClick={() => onToggleStatus(setting)}
        className={!isActive ? 'text-green-600' : 'text-red-600'}
      >
        {isActive ? (
          <>
            <ToggleLeft className="mr-2 h-4 w-4" />
            Nonaktifkan
          </>
        ) : (
          <>
            <ToggleRight className="mr-2 h-4 w-4" />
            Aktifkan
          </>
        )}
      </DropdownMenuItem>
    );
  };

  const getSchoolStatusToggleItem = (setting: Setting) => {
    const isToggling = togglingSchoolStatusId === setting.id;
    const isActive = setting.status_sekolah === 'Y';
    
    if (isToggling) {
      return (
        <DropdownMenuItem disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Mengubah Status Sekolah...
        </DropdownMenuItem>
      );
    }

    return (
      <DropdownMenuItem 
        onClick={() => onToggleSchoolStatus(setting)}
        className={!isActive ? 'text-blue-600' : 'text-orange-600'}
      >
        <School className="mr-2 h-4 w-4" />
        {isActive ? 'Nonaktifkan Sekolah' : 'Aktifkan Sekolah'}
      </DropdownMenuItem>
    );
  };

  const getActivateItem = (setting: Setting) => {
    const isActivating = activatingId === setting.id;
    const isAlreadyActive = setting.status === 'Y';
    
    if (isActivating) {
      return (
        <DropdownMenuItem disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Mengaktifkan...
        </DropdownMenuItem>
      );
    }

    if (isAlreadyActive) {
      return (
        <DropdownMenuItem disabled>
          <Play className="mr-2 h-4 w-4" />
          Sudah Aktif
        </DropdownMenuItem>
      );
    }

    return (
      <DropdownMenuItem 
        onClick={() => onActivate(setting)}
        className="text-green-600"
      >
        <Play className="mr-2 h-4 w-4" />
        Aktifkan & Nonaktifkan Lainnya
      </DropdownMenuItem>
    );
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

  if (settings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <SettingsIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Tidak ada pengaturan ditemukan</h3>
          <p className="text-muted-foreground mt-2">
            Coba sesuaikan filter Anda atau tambah pengaturan baru
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
                <th className="text-left p-4 font-medium">Periode</th>
                <th className="text-left p-4 font-medium">Tanggal</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Status Sekolah</th>
                <th className="text-right p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {settings.map((setting, index) => (
                <tr key={setting.id} className="border-b hover:bg-muted/50">
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
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{setting.tahun_akademik}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {setting.semester_text}
                          </Badge>
                          {getPeriodBadge(setting)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3 text-muted-foreground" />
                        <span>{setting.tgl_mulai} - {setting.tgl_berakhir}</span>
                      </div>
                      {setting.tgl_pembekalan && (
                        <div className="text-xs text-muted-foreground">
                          Pembekalan: {setting.tgl_pembekalan}
                        </div>
                      )}
                      {setting.tgl_penarikan && (
                        <div className="text-xs text-muted-foreground">
                          Penarikan: {setting.tgl_penarikan}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(setting)}
                  </td>
                  <td className="p-4">
                    {getSchoolStatusBadge(setting)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* <DropdownMenuItem onClick={() => onView(setting)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem> */}
                          <DropdownMenuItem onClick={() => onEdit(setting)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {getStatusToggleItem(setting)}
                          {getSchoolStatusToggleItem(setting)}
                          <DropdownMenuSeparator />
                          {getActivateItem(setting)}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => onDelete(setting)}
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
