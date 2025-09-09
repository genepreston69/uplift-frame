import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, ExternalLink, File } from 'lucide-react';

const CATEGORIES = [
  'Employment Prep',
  'Housing Resources', 
  'GED Prep',
  'Family Resources',
  'Spiritual Library'
];

interface Resource {
  id?: string;
  title: string;
  category: string;
  description: string | null;
  guide_text: string | null;
  url: string | null;
  file_url: string | null;
}

interface ResourceFormProps {
  resource?: Resource;
  onSave: () => void;
  onCancel: () => void;
}

export const ResourceForm: React.FC<ResourceFormProps> = ({ resource, onSave, onCancel }) => {
  const [title, setTitle] = useState(resource?.title || '');
  const [category, setCategory] = useState(resource?.category || '');
  const [description, setDescription] = useState(resource?.description || '');
  const [guideText, setGuideText] = useState(resource?.guide_text || '');
  const [url, setUrl] = useState(resource?.url || '');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // Clear URL if file is selected
      if (url) setUrl('');
    }
  };

  const uploadFile = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `resources/${fileName}`;

    const { error } = await supabase.storage
      .from('resources')
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('resources')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !category) {
      toast({
        title: "Error",
        description: "Title and category are required.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      let fileUrl = resource?.file_url || null;
      
      if (file) {
        setIsUploading(true);
        fileUrl = await uploadFile(file);
        setIsUploading(false);
      }

      const resourceData = {
        title,
        category,
        description: description || null,
        guide_text: guideText || null,
        url: url || null,
        file_url: fileUrl
      };

      if (resource?.id) {
        const { error } = await supabase
          .from('resources')
          .update(resourceData)
          .eq('id', resource.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Resource updated successfully."
        });
      } else {
        const { error } = await supabase
          .from('resources')
          .insert([resourceData]);
        
        if (error) throw error;
        
        toast({
          title: "Success", 
          description: "Resource created successfully."
        });
      }

      onSave();
    } catch (error) {
      console.error('Error saving resource:', error);
      toast({
        title: "Error",
        description: "Failed to save resource. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {resource ? 'Edit Resource' : 'Add New Resource'}
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
                placeholder="Enter resource title"
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the resource"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="guide-text">Guide Text</Label>
            <Textarea
              id="guide-text"
              value={guideText}
              onChange={(e) => setGuideText(e.target.value)}
              placeholder="2-3 sentences of preparation tips"
              rows={2}
            />
          </div>

          <div className="space-y-4">
            <Label>Resource Link (choose one)</Label>
            
            <div>
              <Label htmlFor="url" className="text-sm text-muted-foreground">
                External URL
              </Label>
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (e.target.value && file) setFile(null);
                  }}
                  placeholder="https://example.com"
                  disabled={!!file}
                />
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">OR</div>

            <div>
              <Label className="text-sm text-muted-foreground">
                Upload File
              </Label>
              <div className="mt-2">
                {!file && !resource?.file_url ? (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground mb-2">
                      Click to upload a file or drag and drop
                    </div>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      disabled={!!url}
                      className="hidden"
                      id="file-upload"
                    />
                    <Label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium text-primary hover:text-primary/80"
                    >
                      Choose File
                    </Label>
                  </div>
                ) : (
                  <div className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <File className="h-4 w-4" />
                        <span className="text-sm">
                          {file ? file.name : 'Current file'}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || isUploading}
            >
              {isUploading ? 'Uploading...' : isSubmitting ? 'Saving...' : 'Save Resource'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};