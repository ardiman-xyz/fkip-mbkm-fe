import React from 'react';
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Copy, ToggleLeft, ToggleRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Program, ProgramStatistics } from '@/types/program';

// Program Statistics Component
interface ProgramStatsProps {
  statistics: ProgramStatistics | null;
  loading?: boolean;
}

export function ProgramStats({ statistics, loading = false }: ProgramStatsProps) {
  if (loading || !statistics) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Programs",
      value: statistics.total_programs,
      change: `${statistics.active_percentage}% active`,
      changeType: "positive" as const,
    },
    {
      title: "Active Programs",
      value: statistics.active_programs,
      change: "Available for registration",
      changeType: "neutral" as const,
    },
    {
      title: "Total Registrations",
      value: statistics.total_registrations,
      change: `${statistics.registration_percentage}% have registrations`,
      changeType: "positive" as const,
    },
    {
      title: "Programs with Registrations",
      value: statistics.programs_with_registrations,
      change: `${statistics.programs_without_registrations} without`,
      changeType: "neutral" as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Search and Filter Component
interface ProgramFiltersProps {
  searchQuery: string;
  statusFilter: string;
  typeFilter: string;
  onSearchChange: (query: string) => void;
  onStatusChange: (status: string) => void;
  onTypeChange: (type: string) => void;
  onClearFilters: () => void;
  onAddNew?: () => void;
}

export function ProgramFilters({
  searchQuery,
  statusFilter,
  typeFilter,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onClearFilters,
  onAddNew,
}: ProgramFiltersProps) {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'internship', label: 'Internship/Magang' },
    { value: 'community_service', label: 'Community Service/KKN' },
    { value: 'research', label: 'Research/Penelitian' },
    { value: 'exchange', label: 'Student Exchange' },
    { value: 'entrepreneurship', label: 'Entrepreneurship' },
    { value: 'teaching', label: 'Teaching/Mengajar' },
    { value: 'other', label: 'Other' },
  ];

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || typeFilter !== 'all';

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search programs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      <div className="flex gap-2">
          <Button onClick={onAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add Program
          </Button>
      </div>
    </div>
  );
}

// Program Table Component
interface ProgramTableProps {
  programs: Program[];
  loading?: boolean;
  onView: (program: Program) => void;
  onEdit: (program: Program) => void;
  onDelete: (program: Program) => void;
  onClone: (program: Program) => void;
  onToggleStatus: (program: Program) => void;
}

export function ProgramTable({
  programs,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onClone,
  onToggleStatus,
}: ProgramTableProps) {
  const getStatusBadge = (program: Program) => {
    return (
      <Badge 
        variant={program.status === 'Y' ? 'default' : 'secondary'}
        className={program.status === 'Y' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
      >
        {program.status_text}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeColors: Record<string, string> = {
      internship: 'bg-blue-100 text-blue-800',
      community_service: 'bg-green-100 text-green-800',
      research: 'bg-purple-100 text-purple-800',
      exchange: 'bg-orange-100 text-orange-800',
      entrepreneurship: 'bg-red-100 text-red-800',
      teaching: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800',
    };

    const typeLabels: Record<string, string> = {
      internship: 'Internship',
      community_service: 'KKN',
      research: 'Research',
      exchange: 'Exchange',
      entrepreneurship: 'Entrepreneur',
      teaching: 'Teaching',
      other: 'Other',
    };

    return (
      <Badge className={`${typeColors[type] || typeColors.other} hover:${typeColors[type] || typeColors.other}`}>
        {typeLabels[type] || type}
      </Badge>
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

  if (programs.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="text-center">
            <h3 className="text-lg font-semibold">No programs found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search or filter criteria
            </p>
          </div>
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
                <th className="text-left p-4 font-medium">Program</th>
                <th className="text-left p-4 font-medium">Type</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Registrations</th>
                <th className="text-left p-4 font-medium">Created</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program) => (
                <tr key={program.id} className="border-b hover:bg-muted/50">
                  <td className="p-4">
                    <div>
                      <h4 className="font-medium">{program.formatted_name || program.name}</h4>
                      {program.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {program.description.length > 100 
                            ? `${program.description.substring(0, 100)}...` 
                            : program.description
                          }
                        </p>
                      )}
                      {program.is_popular && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    {getTypeBadge(program.type)}
                  </td>
                  <td className="p-4">
                    {getStatusBadge(program)}
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="font-medium">{program.registration_count}</div>
                      <div className="text-muted-foreground">registrations</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground">
                      {new Date(program.created_at).toLocaleDateString()}
                    </div>
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
                          {/* <DropdownMenuItem onClick={() => onView(program)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem> */}
                          <DropdownMenuItem onClick={() => onEdit(program)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onToggleStatus(program)}>
                            {program.status === 'Y' ? (
                              <>
                                <ToggleLeft className="mr-2 h-4 w-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <ToggleRight className="mr-2 h-4 w-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => onDelete(program)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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

// Pagination Component
interface ProgramPaginationProps {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number;
  to: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export function ProgramPagination({
  currentPage,
  lastPage,
  perPage,
  total,
  from,
  to,
  onPageChange,
  onPerPageChange,
}: ProgramPaginationProps) {
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
          Showing {from} to {to} of {total} results
        </span>
        <Select value={perPage.toString()} onValueChange={(value: string) => onPerPageChange(Number(value))}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 / page</SelectItem>
            <SelectItem value="15">15 / page</SelectItem>
            <SelectItem value="25">25 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
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
          Previous
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
          Next
        </Button>
      </div>
    </div>
  );
}

// Loading Component
export function ProgramListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
      </div>

      {/* Stats Skeleton */}
      <ProgramStats statistics={null} loading={true} />

      {/* Filters Skeleton */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>

      {/* Table Skeleton */}
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
    </div>
  );
}

// Error Component
interface ProgramListErrorProps {
  error: string;
  onRetry: () => void;
}

export function ProgramListError({ error, onRetry }: ProgramListErrorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Programs</h1>
        <p className="text-muted-foreground">
          Manage MBKM programs and activities.
        </p>
      </div>

      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600">Error Loading Programs</h3>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button
            onClick={onRetry}
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}