import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SettingPaginationProps {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number;
  to: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export function SettingPagination({
  currentPage,
  lastPage,
  perPage,
  total,
  from,
  to,
  onPageChange,
  onPerPageChange,
}: SettingPaginationProps) {
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (lastPage <= maxVisible) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', lastPage);
      } else if (currentPage >= lastPage - 2) {
        pages.push(1, '...', lastPage - 3, lastPage - 2, lastPage - 1, lastPage);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', lastPage);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Menampilkan {from} sampai {to} dari {total} hasil
        </span>
        <Select value={perPage.toString()} onValueChange={(value: string) => onPerPageChange(Number(value))}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 / halaman</SelectItem>
            <SelectItem value="15">15 / halaman</SelectItem>
            <SelectItem value="25">25 / halaman</SelectItem>
            <SelectItem value="50">50 / halaman</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Sebelumnya
        </Button>
        
        {generatePageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-2 text-muted-foreground">...</span>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= lastPage}
        >
          Selanjutnya
        </Button>
      </div>
    </div>
  );
}