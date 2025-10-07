import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Shield, AlertTriangle, ExternalLink } from "lucide-react";
import { getDomainStatus, getDomainFromUrl } from "@/lib/domainWhitelist";

interface RestrictedBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export const RestrictedBrowser = ({ isOpen, onClose, url, title }: RestrictedBrowserProps) => {
  const domainStatus = getDomainStatus(url);
  const domain = getDomainFromUrl(url);

  // Automatically open in new tab when dialog opens
  useEffect(() => {
    if (isOpen && url) {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (newWindow) {
        newWindow.opener = null;
      }
      // Close the dialog after opening the link
      setTimeout(() => onClose(), 500);
    }
  }, [isOpen, url, onClose]);

  const getStatusBadge = () => {
    switch (domainStatus) {
      case 'verified':
        return (
          <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
            <Shield className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            External
          </Badge>
        );
      default:
        return null;
    }
  };

  const openInNewTab = () => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-lg font-semibold">
                Opening External Link
              </DialogTitle>
              {getStatusBadge()}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <ExternalLink className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground truncate">{domain}</p>
            </div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              This link has been opened in a new browser tab. If it didn't open, please check your browser's popup settings.
            </p>
          </div>
          
          <Button 
            onClick={openInNewTab} 
            className="w-full"
            variant="outline"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Link Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};