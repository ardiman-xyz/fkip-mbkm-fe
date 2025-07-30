// src/pages/programs/_components/ProgramStatusModal.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Users, Activity } from 'lucide-react';
import type { Program } from '@/types/program';

interface ProgramStatusModalProps {
  program: Program | null;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ProgramStatusModal({ 
  program, 
  open, 
  onConfirm, 
  onCancel 
}: ProgramStatusModalProps) {
  if (!program) return null;

  const isActivating = program.status === 'N';
  const isDeactivating = program.status === 'Y';
  const hasRegistrations = program.registration_count > 0;

  const getActionText = () => {
    return isActivating ? 'activate' : 'deactivate';
  };

  const getNewStatusText = () => {
    return isActivating ? 'Active' : 'Inactive';
  };

  const getActionColor = () => {
    return isActivating ? 'bg-green-500' : 'bg-red-500';
  };

  const getWarningMessage = () => {
    if (isDeactivating && hasRegistrations) {
      return {
        title: 'Deactivating Program with Active Registrations',
        message: 'This program has active registrations. Deactivating it will prevent new registrations but will not affect existing ones.',
        severity: 'warning' as const
      };
    }
    
    if (isActivating) {
      return {
        title: 'Activating Program',
        message: 'This program will be available for new registrations.',
        severity: 'info' as const
      };
    }

    return null;
  };

  const warning = getWarningMessage();

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Confirm Status Change
          </DialogTitle>
          <DialogDescription>
            You are about to {getActionText()} the following program:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Program Info */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-3">
            <div>
              <h4 className="font-medium">{program.formatted_name || program.name}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Type: <Badge variant="outline">{program.type}</Badge>
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{program.registration_count} registrations</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span>Currently: {program.status_text}</span>
              </div>
            </div>
          </div>

          {/* Status Change Preview */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="text-sm">
              <span className="text-muted-foreground">Status will change to:</span>
            </div>
            <Badge 
              className={`${getActionColor()} text-white hover:${getActionColor()}`}
            >
              {getNewStatusText()}
            </Badge>
          </div>

          {/* Warning/Info Message */}
          {warning && (
            <Alert variant={warning.severity === 'warning' ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div>
                  <strong>{warning.title}</strong>
                  <p className="mt-1">{warning.message}</p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Additional Effects */}
          {isDeactivating && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Effects of deactivating:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Program will not appear in public listings</li>
                <li>New student registrations will be blocked</li>
                <li>Existing registrations remain unaffected</li>
                <li>Program can be reactivated anytime</li>
              </ul>
            </div>
          )}

          {isActivating && (
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Effects of activating:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Program will be visible in public listings</li>
                <li>Students can register for this program</li>
                <li>Program will appear in search results</li>
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={onConfirm}
            variant={isActivating ? "default" : "destructive"}
          >
            {isActivating ? 'Activate Program' : 'Deactivate Program'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}