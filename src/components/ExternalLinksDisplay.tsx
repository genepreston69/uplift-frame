import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@/contexts/SessionContext';
import { ExternalLink, Search, Filter, Globe, ArrowUpRight, Sparkles, Shield, AlertTriangle } from 'lucide-react';
import { SecurityWarningDialog } from '@/components/SecurityWarningDialog';
import { RestrictedBrowser } from '@/components/RestrictedBrowser';
import { getDomainStatus, getDomainFromUrl as getCleanDomain } from '@/lib/domainWhitelist';

const CATEGORIES = [
  'All Categories',
  'Employment Services',
  'Housing Assistance', 
  'Education Resources',
  'Family Support',
  'Healthcare Services',
  'Legal Aid',
  'Financial Assistance',
  'Community Resources',
  'Just for Fun'
];

interface ExternalLinkItem {
  id: string;
  title: string;
  category: string;
  description: string | null;
  guide_text: string | null;
  url: string;
  created_at: string;
}

export const ExternalLinksDisplay: React.FC = () => {
  const [links, setLinks] = useState<ExternalLinkItem[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<ExternalLinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [browserOpen, setBrowserOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<ExternalLinkItem | null>(null);
  const { toast } = useToast();
  const { logActivity } = useSession();

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('external_links')
        .select('*')
        .order('category', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;
      
      setLinks(data || []);
      setFilteredLinks(data || []);
    } catch (error) {
      console.error('Error fetching external links:', error);
      toast({
        title: "Error",
        description: "Failed to load external links.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  useEffect(() => {
    let filtered = links;

    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(link => link.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(link =>
        link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        link.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLinks(filtered);
  }, [links, searchTerm, selectedCategory]);

  const handleLinkClick = (link: ExternalLinkItem) => {
    const domainStatus = getDomainStatus(link.url);
    
    // For blocked domains, show toast and return
    if (domainStatus === 'blocked') {
      toast({
        title: "Access Restricted",
        description: "This domain has been blocked for security reasons.",
        variant: "destructive"
      });
      return;
    }
    
    // For verified domains, proceed directly
    if (domainStatus === 'verified') {
      proceedToLink(link);
      return;
    }
    
    // For warning domains, show security dialog
    setSelectedLink(link);
    setDialogOpen(true);
  };

  const proceedToLink = (link: ExternalLinkItem) => {
    logActivity('external_link_click', { 
      linkId: link.id, 
      title: link.title, 
      category: link.category, 
      url: link.url,
      domainStatus: getDomainStatus(link.url)
    });

    // Open in restricted browser (modal with iframe)
    setSelectedLink(link);
    setBrowserOpen(true);
  };

  const handleDialogConfirm = () => {
    if (selectedLink) {
      logActivity('external_link_click', { 
        linkId: selectedLink.id, 
        title: selectedLink.title, 
        category: selectedLink.category, 
        url: selectedLink.url,
        domainStatus: getDomainStatus(selectedLink.url)
      });
      
      // Open in restricted browser after confirmation
      setBrowserOpen(true);
    }
    setDialogOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedLink(null);
  };

  // Extract domain from URL for favicon (keeping original function for favicon purposes)
  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return '';
    }
  };

  // Get security status badge for a link
  const getSecurityBadge = (url: string) => {
    const status = getDomainStatus(url);
    
    switch (status) {
      case 'verified':
        return (
          <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
            <Shield className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case 'warning':
        return (
          <Badge variant="outline" className="text-xs bg-timer-warning/10 text-timer-warning border-timer-warning/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            External
          </Badge>
        );
      case 'blocked':
        return (
          <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Blocked
          </Badge>
        );
      default:
        return null;
    }
  };

  // Get favicon URL using Google's favicon service
  const getFaviconUrl = (url: string) => {
    const domain = getDomainFromUrl(url);
    if (!domain) return null;
    
    // Using Google's favicon service
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'Employment Services':
        return 'from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 border-primary/30';
      case 'Housing Assistance':
        return 'from-accent/10 to-accent/20 hover:from-accent/20 hover:to-accent/30 border-accent/30';
      case 'Education Resources':
        return 'from-primary/15 to-primary/25 hover:from-primary/25 hover:to-primary/35 border-primary/35';
      case 'Family Support':
        return 'from-secondary/10 to-secondary/20 hover:from-secondary/20 hover:to-secondary/30 border-secondary/30';
      case 'Healthcare Services':
        return 'from-destructive/10 to-destructive/20 hover:from-destructive/20 hover:to-destructive/30 border-destructive/30';
      case 'Legal Aid':
        return 'from-primary/20 to-primary/30 hover:from-primary/30 hover:to-primary/40 border-primary/40';
      case 'Financial Assistance':
        return 'from-accent/15 to-accent/25 hover:from-accent/25 hover:to-accent/35 border-accent/35';
      case 'Community Resources':
        return 'from-secondary/15 to-secondary/25 hover:from-secondary/25 hover:to-secondary/35 border-secondary/35';
      case 'Just for Fun':
        return 'from-primary/5 to-accent/15 hover:from-primary/15 hover:to-accent/25 border-accent/25';
      default:
        return 'from-muted/20 to-muted/30 hover:from-muted/30 hover:to-muted/40 border-muted/40';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Just for Fun':
        return <Sparkles className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-6xl mx-auto backdrop-blur-sm bg-card/95">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            External Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-muted rounded-lg"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-32 bg-muted rounded-lg"></div>
                <div className="h-32 bg-muted rounded-lg"></div>
                <div className="h-32 bg-muted rounded-lg"></div>
                <div className="h-32 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-6xl mx-auto backdrop-blur-sm bg-card/95 border-2">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ExternalLink className="h-6 w-6 text-primary" />
          </div>
          External Links
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Quick access to helpful external websites and services. Click any card to visit the site.
        </p>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Enhanced Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search external links..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-background/50 border-2 focus:border-primary/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 sm:w-auto">
            <div className="p-2 bg-muted rounded-md">
              <Filter className="h-4 w-4 text-muted-foreground" />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="sm:w-48 h-11 border-2 focus:border-primary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(category)}
                      {category}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Quick Filters */}
        {filteredLinks.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2">
            {Array.from(new Set(filteredLinks.map(l => l.category))).slice(0, 5).map(cat => (
              <Badge
                key={cat}
                variant="outline"
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedCategory === cat ? 'bg-primary text-primary-foreground' : ''
                }`}
                onClick={() => setSelectedCategory(cat === selectedCategory ? 'All Categories' : cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        )}

        {/* Links Grid with Enhanced Cards */}
        {filteredLinks.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50 animate-pulse" />
            <p className="text-lg font-medium mb-2 text-muted-foreground">
              {links.length === 0 ? 'No external links available' : 'No links found'}
            </p>
            <p className="text-sm text-muted-foreground/80">
              {links.length === 0 
                ? 'External links will appear here once added by administrators.'
                : 'Try adjusting your search terms or category filter.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLinks.map((link) => {
              const faviconUrl = getFaviconUrl(link.url);
              const isHovered = hoveredCard === link.id;
              
              return (
                <Card 
                  key={link.id} 
                  className={`
                    relative overflow-hidden border-2 transition-all duration-300 cursor-pointer
                    bg-gradient-to-br ${getCategoryGradient(link.category)}
                    ${isHovered ? 'shadow-xl scale-[1.02] -translate-y-1' : 'shadow-md hover:shadow-lg'}
                  `}
                  onMouseEnter={() => setHoveredCard(link.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => handleLinkClick(link)}
                >
                  {/* Animated background gradient */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent
                    transition-opacity duration-500
                    ${isHovered ? 'opacity-100' : 'opacity-0'}
                  `} />
                  
                  <CardContent className="relative p-5">
                    <div className="flex items-start gap-4">
                      {/* Favicon/Icon Container */}
                      <div className={`
                        relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden
                        bg-gradient-to-br from-background to-muted
                        border-2 border-border/50
                        transition-all duration-300
                        ${isHovered ? 'scale-110 rotate-3' : ''}
                      `}>
                        {faviconUrl ? (
                          <img 
                            src={faviconUrl}
                            alt={`${link.title} icon`}
                            className="w-full h-full object-contain p-2"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <Globe className={`absolute inset-0 m-auto h-8 w-8 text-muted-foreground ${faviconUrl ? 'hidden' : ''}`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-lg leading-tight line-clamp-1">
                            {link.title}
                          </h3>
                          <ArrowUpRight className={`
                            h-5 w-5 text-primary flex-shrink-0
                            transition-all duration-300
                            ${isHovered ? 'translate-x-1 -translate-y-1' : ''}
                          `} />
                        </div>
                        
                        {link.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {link.description}
                          </p>
                        )}
                        
                        {link.guide_text && (
                          <div className={`
                            bg-accent/50 p-2 rounded-md mb-3
                            transition-all duration-300
                            ${isHovered ? 'bg-accent/70' : ''}
                          `}>
                            <p className="text-xs text-accent-foreground line-clamp-2">
                              <strong>💡 Tip:</strong> {link.guide_text}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {link.category}
                          </Badge>
                          {getSecurityBadge(link.url)}
                          <span className="text-xs text-muted-foreground truncate flex-1">
                            {getDomainFromUrl(link.url)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
        {/* Results counter with animation */}
        {filteredLinks.length > 0 && (
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredLinks.length}</span> of{' '}
              <span className="font-semibold text-foreground">{links.length}</span> external links
            </p>
          </div>
        )}

        {/* Security Warning Dialog */}
        {selectedLink && (
          <SecurityWarningDialog
            isOpen={dialogOpen}
            onClose={handleDialogClose}
            url={selectedLink.url}
            title={selectedLink.title}
            onConfirm={handleDialogConfirm}
          />
        )}

        {/* Restricted Browser */}
        {selectedLink && (
          <RestrictedBrowser
            isOpen={browserOpen}
            onClose={() => setBrowserOpen(false)}
            url={selectedLink.url}
            title={selectedLink.title}
          />
        )}
      </CardContent>
    </Card>
  );
};