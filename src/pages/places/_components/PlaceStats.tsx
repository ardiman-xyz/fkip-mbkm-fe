import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Users } from 'lucide-react';
import type { PlaceStatistics } from '@/types/place';

interface PlaceStatsProps {
  statistics: PlaceStatistics | null;
  loading?: boolean;
}

export function PlaceStats({ statistics, loading = false }: PlaceStatsProps) {
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
      title: "Total Tempat",
      value: statistics.total_places,
      change: `${statistics.active_percentage}% aktif`,
      icon: Building,
    },
    {
      title: "Tempat Aktif",
      value: statistics.active_places,
      change: "Tersedia untuk mahasiswa",
      icon: () => <div className="h-4 w-4 bg-green-500 rounded-full" />,
    },
    {
      title: "Total Kuota",
      value: statistics.total_quota,
      change: "Kapasitas mahasiswa",
      icon: Users,
    },
    {
      title: "Tempat Berisi",
      value: statistics.places_with_quota,
      change: `${statistics.quota_percentage}% memiliki kuota`,
      icon: () => <div className="h-4 w-4 bg-blue-500 rounded-full" />,
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
            <stat.icon className="h-4 w-4 text-muted-foreground" />
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