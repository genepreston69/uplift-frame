import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink } from 'lucide-react';

const CATEGORIES = [
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
  id?: string;
  title: string;
  category: string;
  description: string | null;
  guide_text: string | null;
  url: string;
}

interface ExternalLinksFormProps {
  link?: ExternalLinkItem;
  onSave: () => void;
  onCancel: () => void;
}

export const ExternalLinksForm: React.FC<ExternalLinksFormProps> = ({ link, onSave, onCancel }) => {
  const [title, setTitle] = useState(link?.title || '');
  const [category, setCategory] = useState(link?.category || '');
  const [description, setDescription] = useState(link?.description || '');
  const [guideText, setGuideText] = useState(link?.guide_text || '');
  const [url, setUrl] = useState(link?.url || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateUrl = (urlString: string) => {
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !category || !url) {
      toast({
        title: "Error",
        description: "Title, category, and URL are required.",
        variant: "destructive"
      });
      return;
    }

    if (!validateUrl(url)) {
      toast({
        title: "Error",
        description: "Please enter a valid URL (must start with http:// or https://).",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const linkData = {
        title,
        category,
        description: description || null,
        guide_text: guideText || null,
        url
      };

      if (link?.id) {
        const { error } = await supabase
          .from('external_links')
          .update(linkData)
          .eq('id', link.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "External link updated successfully."
        });
      } else {
        const { error } = await supabase
          .from('external_links')
          .insert([linkData]);
        
        if (error) throw error;
        
        toast({
          title: "Success", 
          description: "External link created successfully."
        });
      }

      onSave();
    } catch (error) {
      console.error('Error saving external link:', error);
      toast({
        title: "Error",
        description: "Failed to save external link. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {link ? 'Edit External Link' : 'Add New External Link'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter link title"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="url">URL *</Label>
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this link provides"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="guide-text">Guide Text</Label>
            <Textarea
              id="guide-text"
              value={guideText}
              onChange={(e) => setGuideText(e.target.value)}
              placeholder="2-3 sentences of preparation tips or what to expect"
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save External Link'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};