import { useState } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const domainStatus = getDomainStatus(url);
  const domain = getDomainFromUrl(url);

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
      <DialogContent className="max-w-6xl h-[80vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-lg font-semibold truncate max-w-md">
                {title}
              </DialogTitle>
              {getStatusBadge()}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={openInNewTab}
                className="text-xs"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Open in New Tab
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground truncate">
            {domain}
          </div>
        </DialogHeader>
        
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          <iframe
            src={url}
            className="w-full h-full border-0"
            title={title}
            onLoad={() => setIsLoading(false)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};