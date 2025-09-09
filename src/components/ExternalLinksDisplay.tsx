import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@/contexts/SessionContext';
import { ExternalLink, Search, Filter } from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Employment Services',
  'Housing Assistance', 
  'Education Resources',
  'Family Support',
  'Healthcare Services',
  'Legal Aid',
  'Financial Assistance',
  'Community Resources'
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

    // Filter by category
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(link => link.category === selectedCategory);
    }

    // Filter by search term
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
    // Log the click activity
    logActivity('external_link_click', { 
      linkId: link.id, 
      title: link.title, 
      category: link.category, 
      url: link.url 
    });

    // Open link in new tab with security headers
    const newWindow = window.open(link.url, '_blank', 'noopener,noreferrer');
    if (newWindow) {
      newWindow.opener = null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Employment Services':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Housing Assistance':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Education Resources':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Family Support':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Healthcare Services':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Legal Aid':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      case 'Financial Assistance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Community Resources':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            External Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading external links...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          External Links
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Access helpful external websites and services.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search external links..."
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

        {/* Links Grid */}
        {filteredLinks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ExternalLink className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">
              {links.length === 0 ? 'No external links available' : 'No links found'}
            </p>
            <p className="text-sm">
              {links.length === 0 
                ? 'External links will appear here once added by administrators.'
                : 'Try adjusting your search terms or category filter.'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredLinks.map((link) => (
              <Card key={link.id} className="border border-border hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{link.title}</h3>
                        <Badge 
                          variant="secondary" 
                          className={getCategoryColor(link.category)}
                        >
                          {link.category}
                        </Badge>
                      </div>
                      {link.description && (
                        <p className="text-muted-foreground mb-2">
                          {link.description}
                        </p>
                      )}
                      {link.guide_text && (
                        <div className="bg-accent/50 p-3 rounded-md mb-3">
                          <p className="text-sm text-accent-foreground">
                            <strong>Preparation Tips:</strong> {link.guide_text}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground truncate">
                        {link.url}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleLinkClick(link)}
                      size="sm"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Site
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {filteredLinks.length > 0 && (
          <div className="text-center text-sm text-muted-foreground">
            Showing {filteredLinks.length} of {links.length} external links
          </div>
        )}
      </CardContent>
    </Card>
  );
};