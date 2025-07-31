// src/pages/NotFound.tsx
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Search, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { Link, useLocation, useNavigate } from 'react-router';

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(isAuthenticated ? '/dashboard' : '/login');
    }
  };

  const handleGoHome = () => {
    navigate(isAuthenticated ? '/dashboard' : '/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <div className="text-8xl font-bold text-slate-200 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertTriangle className="h-16 w-16 text-orange-500 animate-pulse" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-slate-600 leading-relaxed">
            Maaf, halaman yang Anda cari tidak dapat ditemukan. 
            Mungkin halaman telah dipindahkan, dihapus, atau URL yang Anda masukkan salah.
          </p>
          
          {/* Show requested path */}
          <div className="bg-slate-100 rounded-lg p-3 text-sm text-slate-500 font-mono break-all">
            {location.pathname}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={handleGoBack}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          
          <Button 
            onClick={handleGoHome}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            {isAuthenticated ? 'Dashboard' : 'Login'}
          </Button>
        </div>

        {/* Helpful Links */}
        {isAuthenticated && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-4">
              Atau kunjungi halaman-halaman ini:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link  to="/dashboard">
                <Button variant="ghost" size="sm" className="text-xs">
                  Dashboard
                </Button>
              </Link>
              <Link to="/programs">
                <Button variant="ghost" size="sm" className="text-xs">
                  Program
                </Button>
              </Link>
              <Link to="/places">
                <Button variant="ghost" size="sm" className="text-xs">
                  Tempat
                </Button>
              </Link>
              <Link to="/settings/guidance">
                <Button variant="ghost" size="sm" className="text-xs">
                  Pengaturan
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center space-x-2 opacity-30">
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}