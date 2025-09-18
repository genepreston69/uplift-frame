import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, ExternalLink, Download, Search, Filter } from 'lucide-react';

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
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Resource Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading resources...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Resource Library
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Access helpful resources for your client journey.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2 sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">
              {resources.length === 0 ? 'No resources available' : 'No resources found'}
            </p>
            <p className="text-sm">
              {resources.length === 0 
                ? 'Resources will appear here once added by administrators.'
                : 'Try adjusting your search terms or category filter.'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="border border-border hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{resource.title}</h3>
                        <Badge 
                          variant="secondary" 
                          className={getCategoryColor(resource.category)}
                        >
                          {resource.category}
                        </Badge>
                      </div>
                      {resource.description && (
                        <p className="text-muted-foreground mb-2">
                          {resource.description}
                        </p>
                      )}
                      {resource.guide_text && (
                        <div className="bg-accent/50 p-3 rounded-md mb-3">
                          <p className="text-sm text-accent-foreground">
                            <strong>Preparation Tips:</strong> {resource.guide_text}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                   <div className="flex justify-end gap-2">
                     {resource.file_url && isViewableFile(resource.file_url) ? (
                       <>
                         <Button
                           onClick={() => handleResourceAccess(resource, 'view')}
                           size="sm"
                           variant="outline"
                         >
                           <ExternalLink className="h-4 w-4 mr-2" />
                           View
                         </Button>
                         <Button
                           onClick={() => handleResourceAccess(resource, 'download')}
                           size="sm"
                         >
                           <Download className="h-4 w-4 mr-2" />
                           Download
                         </Button>
                       </>
                     ) : (
                       <Button
                         onClick={() => handleResourceAccess(resource)}
                         disabled={!resource.url && !resource.file_url}
                         size="sm"
                       >
                         {resource.file_url ? (
                           <>
                             <Download className="h-4 w-4 mr-2" />
                             Download
                           </>
                         ) : (
                           <>
                             <ExternalLink className="h-4 w-4 mr-2" />
                             Open Link
                           </>
                         )}
                       </Button>
                     )}
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {filteredResources.length > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            Showing {filteredResources.length} of {resources.length} resources
          </div>
        )}
      </CardContent>
    </Card>
  );
};