import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  BookOpen, 
  ExternalLink, 
  Download, 
  Search, 
  Filter, 
  FileText, 
  Eye, 
  Sparkles,
  GraduationCap,
  Home,
  Heart,
  Briefcase,
  Car,
  Users,
  ArrowUpRight
} from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Employment Prep',
  'Housing Resources', 
  'GED Prep',
  'Family Resources',
  'Spiritual Library',
  'Driver\'s Licensure',
  'Just for Fun'
];

interface Resource {
  id: string;
  title: string;
  category: string;
  description: string | null;
  guide_text: string | null;
  url: string | null;
  file_url: string | null;
  created_at: string;
}

export const ResourceLibrary: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('category', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;
      
      setResources(data || []);
      setFilteredResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Error",
        description: "Failed to load resources.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    let filtered = resources;

    // Filter by category
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredResources(filtered);
  }, [resources, searchTerm, selectedCategory]);

  const handleResourceAccess = (resource: Resource, action: 'view' | 'download' = 'view') => {
    if (resource.url) {
      window.open(resource.url, '_blank');
    } else if (resource.file_url) {
      if (action === 'download') {
        // Force download by creating a temporary link with download attribute
        const link = document.createElement('a');
        link.href = resource.file_url;
        link.download = resource.title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Open in new tab for viewing
        window.open(resource.file_url, '_blank');
      }
    }
  };

  const isViewableFile = (fileUrl: string | null) => {
    if (!fileUrl) return false;
    const viewableExtensions = ['.pdf', '.txt', '.html', '.htm', '.png', '.jpg', '.jpeg', '.gif', '.svg'];
    return viewableExtensions.some(ext => fileUrl.toLowerCase().includes(ext));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Employment Prep':
        return <Briefcase className="h-5 w-5" />;
      case 'Housing Resources':
        return <Home className="h-5 w-5" />;
      case 'GED Prep':
        return <GraduationCap className="h-5 w-5" />;
      case 'Family Resources':
        return <Users className="h-5 w-5" />;
      case 'Spiritual Library':
        return <Heart className="h-5 w-5" />;
      case 'Driver\'s Licensure':
        return <Car className="h-5 w-5" />;
      case 'Just for Fun':
        return <Sparkles className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case 'Employment Prep':
        return 'from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 border-primary/30';
      case 'Housing Resources':
        return 'from-accent/10 to-accent/20 hover:from-accent/20 hover:to-accent/30 border-accent/30';
      case 'GED Prep':
        return 'from-primary/15 to-primary/25 hover:from-primary/25 hover:to-primary/35 border-primary/35';
      case 'Family Resources':
        return 'from-secondary/10 to-secondary/20 hover:from-secondary/20 hover:to-secondary/30 border-secondary/30';
      case 'Spiritual Library':
        return 'from-primary/20 to-primary/30 hover:from-primary/30 hover:to-primary/40 border-primary/40';
      case 'Driver\'s Licensure':
        return 'from-accent/15 to-accent/25 hover:from-accent/25 hover:to-accent/35 border-accent/35';
      case 'Just for Fun':
        return 'from-primary/5 to-accent/15 hover:from-primary/15 hover:to-accent/25 border-accent/25';
      default:
        return 'from-muted/20 to-muted/30 hover:from-muted/30 hover:to-muted/40 border-muted/40';
    }
  };

  // Extract domain for external resources
  const getDomainFromUrl = (url: string | null) => {
    if (!url) return null;
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return null;
    }
  };

  const getFaviconUrl = (url: string | null) => {
    const domain = getDomainFromUrl(url);
    if (!domain) return null;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Employment Prep':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Housing Resources':
        return 'bg-accent/10 text-accent-foreground border-accent/20';
      case 'GED Prep':
        return 'bg-primary/15 text-primary border-primary/25';
      case 'Family Resources':
        return 'bg-secondary/10 text-secondary-foreground border-secondary/20';
      case 'Spiritual Library':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'Driver\'s Licensure':
        return 'bg-accent/15 text-accent-foreground border-accent/25';
      case 'Just for Fun':
        return 'bg-accent/20 text-accent-foreground border-accent/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-6xl mx-auto backdrop-blur-sm bg-card/95">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Resource Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-muted rounded-lg"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-40 bg-muted rounded-lg"></div>
                <div className="h-40 bg-muted rounded-lg"></div>
                <div className="h-40 bg-muted rounded-lg"></div>
                <div className="h-40 bg-muted rounded-lg"></div>
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
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          Resource Library
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Access helpful resources for your client journey. Click any card to view or download.
        </p>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Enhanced Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
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
                      {category !== 'All Categories' && getCategoryIcon(category)}
                      {category}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Category Quick Filters */}
        {filteredResources.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2">
            {Array.from(new Set(filteredResources.map(r => r.category))).slice(0, 5).map(cat => (
              <Badge
                key={cat}
                variant="outline"
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedCategory === cat ? 'bg-primary text-primary-foreground' : ''
                }`}
                onClick={() => setSelectedCategory(cat === selectedCategory ? 'All Categories' : cat)}
              >
                <span className="flex items-center gap-1">
                  {getCategoryIcon(cat)}
                  {cat}
                </span>
              </Badge>
            ))}
          </div>
        )}

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50 animate-pulse" />
            <p className="text-lg font-medium mb-2 text-muted-foreground">
              {resources.length === 0 ? 'No resources available' : 'No resources found'}
            </p>
            <p className="text-sm text-muted-foreground/80">
              {resources.length === 0 
                ? 'Resources will appear here once added by administrators.'
                : 'Try adjusting your search terms or category filter.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((resource) => {
              const faviconUrl = resource.url ? getFaviconUrl(resource.url) : null;
              const isHovered = hoveredCard === resource.id;
              
              return (
                <Card 
                  key={resource.id} 
                  className={`
                    relative overflow-hidden border-2 transition-all duration-300
                    bg-gradient-to-br ${getCategoryGradient(resource.category)}
                    ${isHovered ? 'shadow-xl scale-[1.02] -translate-y-1' : 'shadow-md hover:shadow-lg'}
                  `}
                  onMouseEnter={() => setHoveredCard(resource.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Animated background gradient */}
                  <div className={`
                    absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent
                    transition-opacity duration-500
                    ${isHovered ? 'opacity-100' : 'opacity-0'}
                  `} />
                  
                  <CardContent className="relative p-5">
                    <div className="flex items-start gap-4">
                      {/* Icon Container */}
                      <div className={`
                        relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden
                        bg-gradient-to-br from-background to-muted
                        border-2 border-border/50 flex items-center justify-center
                        transition-all duration-300
                        ${isHovered ? 'scale-110 rotate-3' : ''}
                      `}>
                        {faviconUrl ? (
                          <>
                            <img 
                              src={faviconUrl}
                              alt={`${resource.title} icon`}
                              className="w-full h-full object-contain p-2"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <div className="hidden absolute inset-0 flex items-center justify-center">
                              {getCategoryIcon(resource.category)}
                            </div>
                          </>
                        ) : (
                          <div className="text-primary">
                            {resource.file_url ? (
                              <FileText className="h-8 w-8" />
                            ) : (
                              getCategoryIcon(resource.category)
                            )}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                          {resource.title}
                        </h3>
                        
                        {resource.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {resource.description}
                          </p>
                        )}
                        
                        {resource.guide_text && (
                          <div className={`
                            bg-accent/50 p-2 rounded-md mb-3
                            transition-all duration-300
                            ${isHovered ? 'bg-accent/70' : ''}
                          `}>
                            <p className="text-xs text-accent-foreground line-clamp-2">
                              <strong>📚 Preparation Tips:</strong> {resource.guide_text}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between gap-2">
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {resource.category}
                          </Badge>
                          
                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            {resource.file_url && isViewableFile(resource.file_url) ? (
                              <>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleResourceAccess(resource, 'view');
                                  }}
                                  size="sm"
                                  variant="outline"
                                  className={`transition-all ${isHovered ? 'bg-primary/10' : ''}`}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleResourceAccess(resource, 'download');
                                  }}
                                  size="sm"
                                  className={`transition-all ${isHovered ? 'bg-primary hover:bg-primary/90' : ''}`}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                              </>
                            ) : (
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleResourceAccess(resource);
                                }}
                                disabled={!resource.url && !resource.file_url}
                                size="sm"
                                className={`transition-all ${isHovered ? 'bg-primary hover:bg-primary/90' : ''}`}
                              >
                                {resource.file_url ? (
                                  <>
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                  </>
                                ) : (
                                  <>
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    Open
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {resource.url && (
                          <p className="text-xs text-muted-foreground mt-2 truncate">
                            {getDomainFromUrl(resource.url)}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
        {/* Results counter with animation */}
        {filteredResources.length > 0 && (
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredResources.length}</span> of{' '}
              <span className="font-semibold text-foreground">{resources.length}</span> resources
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};