import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  CheckCircle,
  CreditCard,
  AlertCircle,
  Clock
} from 'lucide-react';
import type { RegistrantStatistics } from '@/types/registrant';

interface RegisterStatsProps {
  statistics: RegistrantStatistics | null;
  loading?: boolean;
}

function RegisterStats({ statistics, loading = false }: RegisterStatsProps) {
  if (loading || !statistics) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-12 animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const statsData = [
    {
      label: "Total Pendaftar",
      value: statistics.total_registrants,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      badgeVariant: "secondary" as const,
    },
    {
      label: "Aktif",
      value: statistics.active_registrants,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
      badgeVariant: "default" as const,
    },
    {
      label: "Menunggu Pembayaran",
      value: statistics.pending_payment,
      icon: CreditCard,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      badgeVariant: "destructive" as const,
    },
    {
      label: "Menunggu Penilaian",
      value: statistics.awaiting_assessment,
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      badgeVariant: "outline" as const,
    },
    {
      label: "Selesai",
      value: statistics.completed_registrants,
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      badgeVariant: "secondary" as const,
    },
  ];

  return (
    <Card className='border-none shadow-none bg-gray-50'>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Statistik Pendaftar</span>
          <Badge variant="outline" className="text-xs">
            {statistics.completion_rate}% completion rate
          </Badge>
        </div>
        
        <div className="space-y-3">
          {statsData.map((stat, index) => (
            <div key={stat.label} className="flex items-center justify-between group hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`${stat.bgColor} p-1.5 rounded-md`}>
                  <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                </div>
                <span className="text-sm font-medium">{stat.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{stat.value.toLocaleString()}</span>
                {stat.value > 0 && (
                  <Badge variant={stat.badgeVariant} className="text-xs px-2 py-0.5">
                    {statistics.total_registrants > 0 
                      ? `${((stat.value / statistics.total_registrants) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Gender Statistics */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-muted-foreground">Laki-laki</span>
                <span className="font-medium">{statistics.male_registrants}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span className="text-muted-foreground">Perempuan</span>
                <span className="font-medium">{statistics.female_registrants}</span>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {statistics.total_registrants > 0 
                ? `${((statistics.female_registrants / statistics.total_registrants) * 100).toFixed(1)}% perempuan`
                : 'Tidak ada data'
              }
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default RegisterStats;