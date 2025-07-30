// src/pages/programs/AddNewProgram.tsx
import React, { useState } from 'react';
import { useTitle } from '@/hooks/useTitle';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Loader2, 
  AlertCircle,
  Plus,
  FileText,
  Settings,
  Palette
} from 'lucide-react';
import { programService } from '@/services/programService';
import type { CreateProgramData } from '@/types/program';
import { useNavigate } from 'react-router';

interface FormData {
  nama_kegiatan: string;
  slug: string;
  deskripsi: string;
  background: string;
  aktif: 'Y' | 'N';
}

interface FormErrors {
  nama_kegiatan?: string;
  slug?: string;
  deskripsi?: string;
  background?: string;
  general?: string;
}

const AddNewProgram = () => {
  useTitle('Tambah Program Baru - Admin Dashboard');
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    nama_kegiatan: '',
    slug: '',
    deskripsi: '',
    background: '#ffffff',
    aktif: 'Y',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // Auto-generate slug from program name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug when program name changes
      if (field === 'nama_kegiatan') {
        updated.slug = generateSlug(value);
      }
      
      return updated;
    });

   
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nama_kegiatan.trim()) {
      newErrors.nama_kegiatan = 'Nama program wajib diisi';
    } else if (formData.nama_kegiatan.length > 225) {
      newErrors.nama_kegiatan = 'Nama program tidak boleh lebih dari 225 karakter';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug wajib diisi';
    } else if (formData.slug.length > 255) {
      newErrors.slug = 'Slug tidak boleh lebih dari 255 karakter';
    }

    if (formData.background && formData.background.length > 255) {
      newErrors.background = 'Background tidak boleh lebih dari 255 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Mohon periksa kembali form yang diisi');
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const createData: CreateProgramData = {
        nama_kegiatan: formData.nama_kegiatan.trim(),
        slug: formData.slug.trim(),
        deskripsi: formData.deskripsi.trim() || undefined,
        background: formData.background.trim() || undefined,
        aktif: formData.aktif,
      };

      const newProgram = await programService.createProgram(createData);
      
      toast.success('Program berhasil dibuat!', {
        description: `Program "${newProgram.name}" telah ditambahkan`,
        duration: 4000,
      });

      // Navigate back to programs list
      navigate('/programs');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal membuat program';
      
      // Check if it's a validation error
      if (errorMessage.includes('already exists') || errorMessage.includes('sudah ada')) {
        if (errorMessage.toLowerCase().includes('name') || errorMessage.includes('nama')) {
          setErrors({ nama_kegiatan: 'Nama program sudah ada' });
        } else if (errorMessage.toLowerCase().includes('slug')) {
          setErrors({ slug: 'Slug sudah ada' });
        } else {
          setErrors({ general: errorMessage });
        }
      } else {
        setErrors({ general: errorMessage });
        toast.error('Gagal membuat program', {
          description: errorMessage,
          duration: 5000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/programs');
  };

  const getPreviewType = () => {
    const name = formData.nama_kegiatan.toLowerCase();
    
    if (name.includes('magang') || name.includes('internship')) {
      return { type: 'internship', label: 'Magang/Internship', color: 'bg-blue-100 text-blue-800' };
    } else if (name.includes('kkn')) {
      return { type: 'community_service', label: 'KKN', color: 'bg-green-100 text-green-800' };
    } else if (name.includes('penelitian') || name.includes('research')) {
      return { type: 'research', label: 'Penelitian', color: 'bg-purple-100 text-purple-800' };
    } else if (name.includes('pertukaran') || name.includes('exchange')) {
      return { type: 'exchange', label: 'Pertukaran', color: 'bg-orange-100 text-orange-800' };
    } else if (name.includes('kewirausahaan') || name.includes('entrepreneur')) {
      return { type: 'entrepreneurship', label: 'Kewirausahaan', color: 'bg-red-100 text-red-800' };
    } else if (name.includes('mengajar') || name.includes('teaching')) {
      return { type: 'teaching', label: 'Mengajar', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { type: 'other', label: 'Lainnya', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const previewType = getPreviewType();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tambah Program Baru</h1>
            <p className="text-muted-foreground">
              Buat program MBKM baru untuk mahasiswa
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsPreview(!isPreview)}
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            {isPreview ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Informasi Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Error */}
                {errors.general && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errors.general}</AlertDescription>
                  </Alert>
                )}

                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Informasi Dasar</h3>
                  </div>

                  {/* Program Name */}
                  <div className="space-y-2">
                    <Label htmlFor="nama_kegiatan">
                      Nama Program <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nama_kegiatan"
                      value={formData.nama_kegiatan}
                      onChange={(e) => handleInputChange('nama_kegiatan', e.target.value)}
                      placeholder="Contoh: Magang Industri Semester 6"
                      className={errors.nama_kegiatan ? 'border-red-500' : ''}
                      maxLength={225}
                    />
                    {errors.nama_kegiatan && (
                      <p className="text-sm text-red-500">{errors.nama_kegiatan}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {formData.nama_kegiatan.length}/225 karakter
                    </p>
                  </div>

                  {/* Slug */}
                  <div className="space-y-2">
                    <Label htmlFor="slug">
                      Slug <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="magang-industri-semester-6"
                      className={errors.slug ? 'border-red-500' : ''}
                      maxLength={255}
                    />
                    {errors.slug && (
                      <p className="text-sm text-red-500">{errors.slug}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      URL-friendly identifier. Auto-generated dari nama program.
                    </p>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label>
                      Status <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.aktif} 
                      onValueChange={(value: 'Y' | 'N') => handleInputChange('aktif', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Y">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Aktif
                          </div>
                        </SelectItem>
                        <SelectItem value="N">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            Tidak Aktif
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Program aktif akan terlihat oleh mahasiswa
                    </p>
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Deskripsi Program</h3>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="deskripsi">Deskripsi Program</Label>
                    <Textarea
                      id="deskripsi"
                      value={formData.deskripsi}
                      onChange={(e) => handleInputChange('deskripsi', e.target.value)}
                      placeholder="Masukkan deskripsi lengkap program, tujuan, dan manfaat bagi mahasiswa..."
                      className="min-h-[120px]"
                      rows={5}
                    />
                    <p className="text-xs text-muted-foreground">
                      Jelaskan program secara detail untuk membantu mahasiswa memahami
                    </p>
                  </div>
                </div>

                {/* Appearance Section
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Tampilan</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="background">Background/Warna</Label>
                    <Input
                      id="background"
                      value={formData.background}
                      onChange={(e) => handleInputChange('background', e.target.value)}
                      placeholder="#3B82F6 atau blue-500 atau url(image.jpg)"
                      className={errors.background ? 'border-red-500' : ''}
                      maxLength={255}
                    />
                    {errors.background && (
                      <p className="text-sm text-red-500">{errors.background}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Warna background atau gambar untuk card program
                    </p>
                  </div>
                </div> */}

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting}
                  >
                    Batal
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="min-w-[120px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        Buat Program
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Preview Program
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preview Card */}
              <div className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">
                      {formData.nama_kegiatan || 'Nama Program'}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.slug || 'program-slug'}
                    </p>
                  </div>
                  <Badge 
                    variant={formData.aktif === 'Y' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {formData.aktif === 'Y' ? 'Aktif' : 'Tidak Aktif'}
                  </Badge>
                </div>

                {formData.deskripsi && (
                  <p className="text-xs text-muted-foreground">
                    {formData.deskripsi.length > 100 
                      ? `${formData.deskripsi.substring(0, 100)}...` 
                      : formData.deskripsi
                    }
                  </p>
                )}

                <div className="flex items-center justify-between text-xs">
                  {formData.nama_kegiatan && (
                    <Badge className={`${previewType.color} text-xs`}>
                      {previewType.label}
                    </Badge>
                  )}
                  <span className="text-muted-foreground">0 pendaftar</span>
                </div>
              </div>

              {/* Preview Info */}
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Jenis Program:</span>
                  <p className="text-muted-foreground">{previewType.label}</p>
                </div>
                
                {formData.background && (
                  <div>
                    <span className="font-medium">Background:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ 
                          background: formData.background.startsWith('#') || formData.background.startsWith('rgb') 
                            ? formData.background 
                            : `var(--${formData.background})` 
                        }}
                      />
                      <span className="text-xs text-muted-foreground">{formData.background}</span>
                    </div>
                  </div>
                )}

                <div>
                  <span className="font-medium">URL Program:</span>
                  <p className="text-xs text-muted-foreground break-all">
                    /programs/{formData.slug || 'program-slug'}
                  </p>
                </div>
              </div>

              {/* Tips */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="font-medium text-sm text-blue-800 mb-2">💡 Tips:</h5>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Gunakan nama yang jelas dan mudah dipahami</li>
                  <li>• Deskripsi yang detail membantu mahasiswa</li>
                  <li>• Slug akan menjadi URL program</li>
                  <li>• Program dapat diubah setelah dibuat</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddNewProgram;