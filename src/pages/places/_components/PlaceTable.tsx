import React from 'react';
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
  Building,
  MapPin,
  Users,
  ToggleLeft,
  ToggleRight,
  Loader2
} from 'lucide-react';
import type { Place } from '@/types/place';

interface PlaceTableProps {
  places: Place[];
  loading?: boolean;
  currentPage?: number;
  perPage?: number;
  onView: (place: Place) => void;
  onEdit: (place: Place) => void;
  onDelete: (place: Place) => void;
  onToggleStatus: (place: Place) => void;
  togglingStatusId?: number | null;
}

export function PlaceTable({
  places,
  loading = false,
  currentPage = 1,
  perPage = 15,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  togglingStatusId = null,
}: PlaceTableProps) {
  const getStatusBadge = (place: Place) => {
    const isToggling = togglingStatusId === place.id;
    
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
        variant={place.status === '1' ? 'default' : 'secondary'}
        className={place.status === '1' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
      >
        <div className={`w-2 h-2 rounded-full mr-1 ${place.status === '1' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        {place.status_text}
      </Badge>
    );
  };

  const getQuotaBadge = (place: Place) => {
    if (place.kuota === 0) {
      return (
        <Badge variant="destructive" className="text-xs">
          Kuota Penuh
        </Badge>
      );
    } else if (place.kuota <= 5) {
      return (
        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
          Kuota Terbatas
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="text-xs">
          Kuota Tersedia
        </Badge>
      );
    }
  };

  const getStatusToggleItem = (place: Place) => {
    const isToggling = togglingStatusId === place.id;
    const isActive = place.status === '1';
    
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
        onClick={() => onToggleStatus(place)}
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

  if (places.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Building className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Tidak ada tempat ditemukan</h3>
          <p className="text-muted-foreground mt-2">
            Coba sesuaikan pencarian atau filter Anda
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
                <th className="text-left p-4 font-medium">Tempat</th>
                <th className="text-left p-4 font-medium">Alamat</th>
                <th className="text-left p-4 font-medium">Kuota</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {places.map((place, index) => (
                <tr key={place.id} className="border-b hover:bg-muted/50">
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
                        <Building className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{place.formatted_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          ID: {place.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{place.alamat}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{place.kuota}</span>
                      </div>
                      {getQuotaBadge(place)}
                    </div>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(place)}
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
                          <DropdownMenuItem onClick={() => onView(place)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(place)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {getStatusToggleItem(place)}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => onDelete(place)}
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