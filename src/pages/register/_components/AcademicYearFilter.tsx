// src/pages/register/_components/AcademicYearFilter.tsx
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Loader2 } from 'lucide-react';
import { registrantService } from '@/services/registrantService';

interface AcademicYearFilterProps {
  academicYear: string;
  semester: string;
  onAcademicYearChange: (value: string) => void;
  onSemesterChange: (value: string) => void;
  loading?: boolean;
}

function AcademicYearFilter({
  academicYear,
  semester,
  onAcademicYearChange,
  onSemesterChange,
  loading = false,
}: AcademicYearFilterProps) {
  const [filterOptions, setFilterOptions] = useState<any>(null);
  const [optionsLoading, setOptionsLoading] = useState(true);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const options = await registrantService.getFilterOptions();
        setFilterOptions(options);
        
        // Set default to current active period if available
        if (options.academic_years.length > 0 && academicYear === '2024/2025') {
          onAcademicYearChange(options.academic_years[0].value);
        }
      } catch (error) {
        console.error('Failed to fetch filter options:', error);
      } finally {
        setOptionsLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const academicYears = filterOptions?.academic_years || [
    { value: '2024/2025', label: '2024/2025' },
    { value: '2023/2024', label: '2023/2024' },
  ];

  const semesters = [
    { value: 'Ganjil', label: 'Ganjil' },
    { value: 'Genap', label: 'Genap' },
  ];

  if (optionsLoading) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span className="ml-2 text-sm text-blue-700">Memuat filter periode...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Filter Periode Akademik
            </span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
              Aktif
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Academic Year Select */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-700 font-medium">
                Tahun Akademik:
              </span>
              <Select 
                value={academicYear} 
                onValueChange={onAcademicYearChange}
                disabled={loading}
              >
                <SelectTrigger className="w-32 h-8 bg-white border-blue-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  {academicYears.map((year: any) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Semester Select */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-blue-700 font-medium">
                Semester:
              </span>
              <Select 
                value={semester} 
                onValueChange={onSemesterChange}
                disabled={loading}
              >
                <SelectTrigger className="w-24 h-8 bg-white border-blue-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  {semesters.map((sem) => (
                    <SelectItem key={sem.value} value={sem.value}>
                      {sem.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Current Period Indicator */}
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <Clock className="h-3 w-3" />
              <span>Periode Aktif</span>
              {loading && <Loader2 className="h-3 w-3 animate-spin ml-1" />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AcademicYearFilter;