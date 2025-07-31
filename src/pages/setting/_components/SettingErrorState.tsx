import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface SettingErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function SettingErrorState({ error, onRetry }: SettingErrorStateProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan Pembimbingan</h1>
        <p className="text-muted-foreground">
          Kelola periode dan pengaturan pembimbingan akademik.
        </p>
      </div>

      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-600">Error Memuat Data</h3>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button
            onClick={onRetry}
            className="mt-4"
          >
            Coba Lagi
          </Button>
        </div>
      </div>
    </div>
  );
}