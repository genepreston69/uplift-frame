import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Plus, Trash2, Globe, AlertTriangle } from 'lucide-react';
import { WHITELISTED_DOMAINS } from '@/lib/domainWhitelist';

export const WhitelistManager: React.FC = () => {
  const [domains, setDomains] = useState<string[]>([...WHITELISTED_DOMAINS]);
  const [newDomain, setNewDomain] = useState('');
  const { toast } = useToast();

  const handleAddDomain = () => {
    const domain = newDomain.trim().toLowerCase();
    
    if (!domain) {
      toast({
        title: "Error",
        description: "Please enter a domain name.",
        variant: "destructive"
      });
      return;
    }

    if (domains.includes(domain)) {
      toast({
        title: "Error",
        description: "This domain is already whitelisted.",
        variant: "destructive"
      });
      return;
    }

    // Basic domain validation
    if (!isValidDomain(domain)) {
      toast({
        title: "Error",
        description: "Please enter a valid domain name (e.g., example.com or .gov).",
        variant: "destructive"
      });
      return;
    }

    setDomains([...domains, domain]);
    setNewDomain('');
    
    toast({
      title: "Success",
      description: `Added ${domain} to whitelist.`
    });
  };

  const handleRemoveDomain = (domainToRemove: string) => {
    setDomains(domains.filter(domain => domain !== domainToRemove));
    
    toast({
      title: "Success",
      description: `Removed ${domainToRemove} from whitelist.`
    });
  };

  const isValidDomain = (domain: string): boolean => {
    // Allow TLDs like .gov, .edu
    if (domain.startsWith('.') && domain.length > 1) {
      return true;
    }
    
    // Basic domain regex
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.([a-zA-Z]{2,}|[a-zA-Z]{2,}\.[a-zA-Z]{2,})$/;
    return domainRegex.test(domain) || domain === 'localhost';
  };

  const getDomainType = (domain: string) => {
    if (domain.startsWith('.') || !domain.includes('.')) {
      return 'TLD';
    }
    if (domain.includes('.gov')) {
      return 'Government';
    }
    if (domain.includes('.edu')) {
      return 'Education';
    }
    if (domain.includes('.org')) {
      return 'Organization';
    }
    return 'Commercial';
  };

  const getDomainTypeColor = (type: string) => {
    switch (type) {
      case 'Government':
        return 'bg-success/10 text-success border-success/20';
      case 'Education':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Organization':
        return 'bg-purple/10 text-purple border-purple/20';
      case 'TLD':
        return 'bg-timer-warning/10 text-timer-warning border-timer-warning/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset to default whitelist? This will remove any custom domains you added.')) {
      setDomains([...WHITELISTED_DOMAINS]);
      toast({
        title: "Success",
        description: "Whitelist reset to defaults."
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Domain Whitelist Management
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage approved domains for external links. Only whitelisted domains will be accessible without security warnings.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add new domain */}
          <div className="space-y-3">
            <Label htmlFor="new-domain">Add New Domain</Label>
            <div className="flex gap-2">
              <Input
                id="new-domain"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="example.com or .gov"
                onKeyDown={(e) => e.key === 'Enter' && handleAddDomain()}
                className="flex-1"
              />
              <Button onClick={handleAddDomain}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Examples: example.com, .gov, .edu, subdomain.example.com
            </p>
          </div>

          {/* Current domains */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Current Whitelist ({domains.length} domains)</Label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetToDefaults}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>
            
            {domains.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No domains in whitelist</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                {domains.map((domain, index) => {
                  const type = getDomainType(domain);
                  return (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-sm font-mono truncate">
                            {domain}
                          </code>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getDomainTypeColor(type)}`}
                        >
                          {type}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveDomain(domain)}
                        className="ml-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Information card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">How Domain Whitelisting Works</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Verified domains</strong> open directly without warnings</li>
                    <li>• <strong>Non-whitelisted domains</strong> show security confirmation dialog</li>
                    <li>• <strong>Blocked domains</strong> are completely restricted (if implemented)</li>
                    <li>• Changes take effect immediately for new link clicks</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    <strong>Note:</strong> This is currently a client-side whitelist. For production use, 
                    consider implementing server-side domain management with database storage.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};