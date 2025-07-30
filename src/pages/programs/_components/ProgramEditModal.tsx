import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { programService } from '@/services/programService';
import type { Program, UpdateProgramData } from '@/types/program';

interface ProgramEditModalProps {
  program: Program | null;
  open: boolean;
  onClose: () => void;
  onSuccess: (updatedProgram: Program) => void;
}

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
  aktif?: string;
  general?: string;
}

export function ProgramEditModal({ 
  program, 
  open, 
  onClose, 
  onSuccess 
}: ProgramEditModalProps) {
  const [formData, setFormData] = useState<FormData>({
    nama_kegiatan: '',
    slug: '',
    deskripsi: '',
    background: '',
    aktif: 'Y',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when program changes
  useEffect(() => {
    if (program) {
      setFormData({
        nama_kegiatan: program.name || '',
        slug: program.slug || '',
        deskripsi: program.description || '',
        background: program.background || '',
        aktif: program.status || 'Y',
      });
      setErrors({});
    } else {
      setFormData({
        nama_kegiatan: '',
        slug: '',
        deskripsi: '',
        background: '',
        aktif: 'Y',
      });
      setErrors({});
    }
  }, [program]);

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

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nama_kegiatan.trim()) {
      newErrors.nama_kegiatan = 'Program name is required';
    } else if (formData.nama_kegiatan.length > 225) {
      newErrors.nama_kegiatan = 'Program name cannot exceed 225 characters';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (formData.slug.length > 255) {
      newErrors.slug = 'Slug cannot exceed 255 characters';
    }

    if (formData.background && formData.background.length > 255) {
      newErrors.background = 'Background cannot exceed 255 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!program || !validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const updateData: UpdateProgramData = {
        nama_kegiatan: formData.nama_kegiatan.trim(),
        slug: formData.slug.trim(),
        deskripsi: formData.deskripsi.trim() || undefined,
        background: formData.background.trim() || undefined,
        aktif: formData.aktif,
      };

      const updatedProgram = await programService.updateProgram(program.id, updateData);
      
      onSuccess(updatedProgram);
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update program';
      
      // Check if it's a validation error
      if (errorMessage.includes('already exists') || errorMessage.includes('unique')) {
        if (errorMessage.toLowerCase().includes('name')) {
          setErrors({ nama_kegiatan: 'Program name already exists' });
        } else if (errorMessage.toLowerCase().includes('slug')) {
          setErrors({ slug: 'Slug already exists' });
        } else {
          setErrors({ general: errorMessage });
        }
      } else {
        setErrors({ general: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!program) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Program</DialogTitle>
          <DialogDescription>
            Update the program information. Changes will be saved immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Error */}
          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Program Info Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-medium">Program Information</h4>
              <Badge variant="outline" className="text-xs">
                ID: {program.id}
              </Badge>
            </div>

            {/* Program Name */}
            <div className="space-y-2">
              <Label htmlFor="nama_kegiatan">
                Program Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nama_kegiatan"
                value={formData.nama_kegiatan}
                onChange={(e) => handleInputChange('nama_kegiatan', e.target.value)}
                placeholder="Enter program name"
                className={errors.nama_kegiatan ? 'border-red-500' : ''}
                maxLength={225}
              />
              {errors.nama_kegiatan && (
                <p className="text-sm text-red-500">{errors.nama_kegiatan}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.nama_kegiatan.length}/225 characters
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
                placeholder="program-slug"
                className={errors.slug ? 'border-red-500' : ''}
                maxLength={255}
              />
              {errors.slug && (
                <p className="text-sm text-red-500">{errors.slug}</p>
              )}
              <p className="text-xs text-muted-foreground">
                URL-friendly identifier. Auto-generated from program name.
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
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="N">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      Inactive
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Details</h4>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="deskripsi">Description</Label>
              <Textarea
                id="deskripsi"
                value={formData.deskripsi}
                onChange={(e: any) => handleInputChange('deskripsi', e.target.value)}
                placeholder="Enter program description"
                className="min-h-[100px]"
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Detailed description of the program
              </p>
            </div>

            {/* Background */}
            <div className="space-y-2">
              <Label htmlFor="background">Background</Label>
              <Input
                id="background"
                value={formData.background}
                onChange={(e) => handleInputChange('background', e.target.value)}
                placeholder="Program background or color"
                className={errors.background ? 'border-red-500' : ''}
                maxLength={255}
              />
              {errors.background && (
                <p className="text-sm text-red-500">{errors.background}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Background color or image reference
              </p>
            </div>
          </div>

          {/* Program Stats */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Statistics</h4>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <Badge variant="outline">{program.type}</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Registrations</p>
                <p className="text-sm font-medium">{program.registration_count}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created</p>
                <p className="text-sm">{new Date(program.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Popular</p>
                <Badge variant={program.is_popular ? "default" : "secondary"}>
                  {program.is_popular ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Program'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}