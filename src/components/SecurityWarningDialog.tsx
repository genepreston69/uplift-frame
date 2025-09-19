import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, ExternalLink } from 'lucide-react';
import { getDomainFromUrl, getDomainStatus } from '@/lib/domainWhitelist';

interface SecurityWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  onConfirm: () => void;
}

export const SecurityWarningDialog: React.FC<SecurityWarningDialogProps> = ({
  isOpen,
  onClose,
  url,
  title,
  onConfirm,
}) => {
  const domain = getDomainFromUrl(url);
  const status = getDomainStatus(url);
  
  const getStatusColor = () => {
    switch (status) {
      case 'verified':
        return 'bg-success/10 text-success border-success/20';
      case 'warning':
        return 'bg-timer-warning/10 text-timer-warning border-timer-warning/20';
      case 'blocked':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'verified':
        return <Shield className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'blocked':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'verified':
        return 'Verified Domain';
      case 'warning':
        return 'External Domain';
      case 'blocked':
        return 'Blocked Domain';
      default:
        return 'Unknown Domain';
    }
  };

  const getDescription = () => {
    switch (status) {
      case 'verified':
        return 'This domain has been verified as safe. You will be redirected to this trusted external site.';
      case 'warning':
        return 'This will redirect you to an external website. While this link has been added by administrators, please exercise caution when sharing personal information on external sites.';
      case 'blocked':
        return 'This domain has been blocked for security reasons. Access is not permitted.';
      default:
        return 'This link will redirect you to an external website.';
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ExternalLink className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-left">
                Leaving Recovery Point West Virginia
              </AlertDialogTitle>
            </div>
          </div>
          
          <div className="space-y-3">
            <Badge variant="outline" className={`w-fit ${getStatusColor()}`}>
              <div className="flex items-center gap-1.5">
                {getStatusIcon()}
                {getStatusText()}
              </div>
            </Badge>
            
            <div className="text-sm space-y-1">
              <p className="font-medium">{title}</p>
              <p className="text-muted-foreground break-all">{domain}</p>
            </div>
          </div>
        </AlertDialogHeader>
        
        <AlertDialogDescription className="text-sm leading-relaxed">
          {getDescription()}
        </AlertDialogDescription>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel onClick={onClose}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={status === 'blocked'}
            className={status === 'blocked' ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {status === 'verified' ? 'Continue to Site' : 'Continue Anyway'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};