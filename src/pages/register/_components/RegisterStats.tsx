import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  UserCheck, 
  Clock, 
  CheckCircle,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import type { RegistrantStatistics } from '@/types/registrant';

interface RegisterStatsProps {
  statistics: RegistrantStatistics | null;
  loading?: boolean;
}

function RegisterStats({ statistics, loading = false }: RegisterStatsProps) {
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

  const statsData = [
    {
      title: "Total Pendaftar",
      value: statistics.total_registrants,
      change: "Total keseluruhan",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Aktif",
      value: statistics.active_registrants,
      change: `${statistics.total_registrants > 0 ? ((statistics.active_registrants / statistics.total_registrants) * 100).toFixed(1) : 0}% dari total`,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Menunggu Pembayaran",
      value: statistics.pending_payment,
      change: `${statistics.total_registrants > 0 ? ((statistics.pending_payment / statistics.total_registrants) * 100).toFixed(1) : 0}% dari total`,
      icon: CreditCard,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Selesai",
      value: statistics.completed_registrants,
      change: `${statistics.completion_rate}% completion rate`,
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Main Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Menunggu Penilaian
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.awaiting_assessment.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Sudah submit laporan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Laki-laki
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.male_registrants.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.total_registrants > 0 ? ((statistics.male_registrants / statistics.total_registrants) * 100).toFixed(1) : 0}% dari total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Perempuan
            </CardTitle>
            <Users className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.female_registrants.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.total_registrants > 0 ? ((statistics.female_registrants / statistics.total_registrants) * 100).toFixed(1) : 0}% dari total
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RegisterStats;