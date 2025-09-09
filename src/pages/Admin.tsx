import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ResourceForm } from '@/components/ResourceForm';
import { ExternalLinksForm } from '@/components/ExternalLinksForm';
import { 
  FileText, 
  Lightbulb, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Copy, 
  Download,
  Eye,
  ArrowUpDown,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';

interface Submission {
  id: string;
  type: 'grievance' | 'innovation';
  reference_number: string;
  content: any;
  created_at: string;
  session_id: string;
}

interface Session {
  id: string;
  start_time: string;
  end_time: string | null;
  duration: number | null;
  activity_log: any[];
}

interface Analytics {
  totalSessions: number;
  totalSubmissions: number;
  averageDuration: number;
  submissionsToday: number;
  sessionsToday: number;
  peakHours: { hour: number; count: number }[];
}

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

interface ExternalLinkItem {
  id: string;
  title: string;
  category: string;
  description: string | null;
  guide_text: string | null;
  url: string;
  created_at: string;
}

const ADMIN_PASSWORD = "admin";

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [sortField, setSortField] = useState<'created_at' | 'type'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | undefined>(undefined);
  const [externalLinks, setExternalLinks] = useState<ExternalLinkItem[]>([]);
  const [showExternalLinksForm, setShowExternalLinksForm] = useState(false);
  const [editingExternalLink, setEditingExternalLink] = useState<ExternalLinkItem | undefined>(undefined);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Access Granted",
        description: "Welcome to the admin dashboard."
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password.",
        variant: "destructive"
      });
    }
  };

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order(sortField, { ascending: sortOrder === 'asc' });

      if (error) throw error;
      setSubmissions((data || []) as Submission[]);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch submissions.",
        variant: "destructive"
      });
    }
  };

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('start_time', { ascending: false });

      if (error) throw error;
      setSessions((data || []) as Session[]);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const calculateAnalytics = (sessionsData: Session[], submissionsData: Submission[]) => {
    const today = new Date().toDateString();
    const sessionsToday = sessionsData.filter(s => 
      new Date(s.start_time).toDateString() === today
    ).length;
    
    const submissionsToday = submissionsData.filter(s => 
      new Date(s.created_at).toDateString() === today
    ).length;

    const completedSessions = sessionsData.filter(s => s.duration !== null);
    const averageDuration = completedSessions.length > 0 
      ? completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / completedSessions.length 
      : 0;

    // Calculate peak hours
    const hourCounts: { [key: number]: number } = {};
    sessionsData.forEach(session => {
      const hour = new Date(session.start_time).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const peakHours = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setAnalytics({
      totalSessions: sessionsData.length,
      totalSubmissions: submissionsData.length,
      averageDuration: Math.round(averageDuration / 60), // Convert to minutes
      submissionsToday,
      sessionsToday,
      peakHours
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
      fetchSessions();
      fetchResources();
      fetchExternalLinks();
    }
  }, [isAuthenticated, sortField, sortOrder]);

  useEffect(() => {
    if (sessions.length > 0 && submissions.length >= 0) {
      calculateAnalytics(sessions, submissions);
    }
  }, [sessions, submissions]);

  const handleSort = (field: 'created_at' | 'type') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const copySubmission = (submission: Submission) => {
    const text = `Reference: ${submission.reference_number}\nType: ${submission.type}\nDate: ${new Date(submission.created_at).toLocaleString()}\n\nContent: ${JSON.stringify(submission.content, null, 2)}`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Submission details copied to clipboard."
    });
  };

  const exportSubmissions = () => {
    const csvContent = [
      ['Reference Number', 'Type', 'Date', 'Content'],
      ...submissions.map(s => [
        s.reference_number,
        s.type,
        new Date(s.created_at).toLocaleString(),
        JSON.stringify(s.content)
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('category', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Error",
        description: "Failed to fetch resources.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Resource deleted successfully."
      });
      
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        title: "Error",
        description: "Failed to delete resource.",
        variant: "destructive"
      });
    }
  };

  const handleResourceFormSave = () => {
    setShowResourceForm(false);
    setEditingResource(undefined);
    fetchResources();
  };

  const handleResourceFormCancel = () => {
    setShowResourceForm(false);
    setEditingResource(undefined);
  };

  const fetchExternalLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('external_links')
        .select('*')
        .order('category', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;
      setExternalLinks(data || []);
    } catch (error) {
      console.error('Error fetching external links:', error);
      toast({
        title: "Error",
        description: "Failed to fetch external links.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteExternalLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this external link?')) return;
    
    try {
      const { error } = await supabase
        .from('external_links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "External link deleted successfully."
      });
      
      fetchExternalLinks();
    } catch (error) {
      console.error('Error deleting external link:', error);
      toast({
        title: "Error",
        description: "Failed to delete external link.",
        variant: "destructive"
      });
    }
  };

  const handleExternalLinksFormSave = () => {
    setShowExternalLinksForm(false);
    setEditingExternalLink(undefined);
    fetchExternalLinks();
  };

  const handleExternalLinksFormCancel = () => {
    setShowExternalLinksForm(false);
    setEditingExternalLink(undefined);
  };

  const getExternalLinksCategoryColor = (category: string) => {
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Employment Prep':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Housing Resources':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'GED Prep':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Family Resources':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Spiritual Library':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-24 h-16 flex items-center justify-center mb-4">
              <img 
                src="/lovable-uploads/e07d40bc-4c8e-4386-af07-b2ac1232475c.png" 
                alt="Recovery Point West Virginia"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <p className="text-muted-foreground text-sm">
              Enter the admin password to continue
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                  placeholder="Enter admin password"
                />
              </div>
              <Button type="submit" className="w-full">
                Access Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/e07d40bc-4c8e-4386-af07-b2ac1232475c.png" 
              alt="Recovery Point West Virginia"
              className="h-8 object-contain"
            />
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Client Resource Portal Management</p>
            </div>
          </div>
          <Button onClick={() => setIsAuthenticated(false)} variant="outline">
            Logout
          </Button>
        </div>

        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="links">External Links</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    All Submissions ({submissions.length})
                  </CardTitle>
                  <Button onClick={exportSubmissions} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-32">Reference</TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort('type')}
                            className="h-8 px-2"
                          >
                            Type
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort('created_at')}
                            className="h-8 px-2"
                          >
                            Date
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>Preview</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-mono font-semibold text-primary">
                            {submission.reference_number}
                          </TableCell>
                          <TableCell>
                            <Badge variant={submission.type === 'grievance' ? 'destructive' : 'default'}>
                              {submission.type === 'grievance' ? (
                                <>
                                  <FileText className="h-3 w-3 mr-1" />
                                  Grievance
                                </>
                              ) : (
                                <>
                                  <Lightbulb className="h-3 w-3 mr-1" />
                                  Innovation
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(submission.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {submission.type === 'grievance' 
                              ? submission.content.description?.substring(0, 50) + '...'
                              : submission.content.title?.substring(0, 50) + '...'
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setSelectedSubmission(submission)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                      {submission.type === 'grievance' ? (
                                        <FileText className="h-5 w-5" />
                                      ) : (
                                        <Lightbulb className="h-5 w-5" />
                                      )}
                                      {submission.type === 'grievance' ? 'Grievance' : 'Innovation Idea'}
                                      <Badge variant="outline" className="ml-2">
                                        {submission.reference_number}
                                      </Badge>
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <strong>Date:</strong> {new Date(submission.created_at).toLocaleString()}
                                      </div>
                                      <div>
                                        <strong>Type:</strong> {submission.type}
                                      </div>
                                    </div>
                                    
                                    {submission.type === 'grievance' ? (
                                      <div className="space-y-3">
                                        <div>
                                          <strong>Description:</strong>
                                          <p className="mt-1 p-3 bg-muted rounded-md">
                                            {submission.content.description}
                                          </p>
                                        </div>
                                        <div>
                                          <strong>Location:</strong> {submission.content.location}
                                        </div>
                                        {submission.content.names_involved && (
                                          <div>
                                            <strong>Names Involved:</strong> {submission.content.names_involved}
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="space-y-3">
                                        <div>
                                          <strong>Title:</strong> {submission.content.title}
                                        </div>
                                        <div>
                                          <strong>Description:</strong>
                                          <p className="mt-1 p-3 bg-muted rounded-md">
                                            {submission.content.description}
                                          </p>
                                        </div>
                                        {submission.content.potential_impact && (
                                          <div>
                                            <strong>Potential Impact:</strong>
                                            <p className="mt-1 p-3 bg-muted rounded-md">
                                              {submission.content.potential_impact}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => copySubmission(submission)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {submissions.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No submissions yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            {showResourceForm ? (
              <ResourceForm
                resource={editingResource}
                onSave={handleResourceFormSave}
                onCancel={handleResourceFormCancel}
              />
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Resource Library ({resources.length})
                    </CardTitle>
                    <Button 
                      onClick={() => setShowResourceForm(true)} 
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Resource
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {resources.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No resources yet</p>
                      <p className="text-sm mb-4">Add your first resource to get started.</p>
                      <Button onClick={() => setShowResourceForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Resource
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {resources.map((resource) => (
                            <TableRow key={resource.id}>
                              <TableCell className="font-medium">
                                {resource.title}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="secondary" 
                                  className={getCategoryColor(resource.category)}
                                >
                                  {resource.category}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {resource.file_url ? 'File' : 'Link'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(resource.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingResource(resource);
                                      setShowResourceForm(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteResource(resource.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="links" className="space-y-6">
            {showExternalLinksForm ? (
              <ExternalLinksForm
                link={editingExternalLink}
                onSave={handleExternalLinksFormSave}
                onCancel={handleExternalLinksFormCancel}
              />
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="h-5 w-5" />
                      External Links ({externalLinks.length})
                    </CardTitle>
                    <Button 
                      onClick={() => setShowExternalLinksForm(true)} 
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add External Link
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {externalLinks.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <ExternalLink className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No external links yet</p>
                      <p className="text-sm mb-4">Add your first external link to get started.</p>
                      <Button onClick={() => setShowExternalLinksForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add External Link
                      </Button>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead>Date Added</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {externalLinks.map((link) => (
                            <TableRow key={link.id}>
                              <TableCell className="font-medium">
                                {link.title}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant="secondary" 
                                  className={getExternalLinksCategoryColor(link.category)}
                                >
                                  {link.category}
                                </Badge>
                              </TableCell>
                              <TableCell className="max-w-xs truncate">
                                {link.url}
                              </TableCell>
                              <TableCell>
                                {new Date(link.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingExternalLink(link);
                                      setShowExternalLinksForm(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteExternalLink(link.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {analytics && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.totalSessions}</div>
                      <p className="text-xs text-muted-foreground">
                        {analytics.sessionsToday} today
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.totalSubmissions}</div>
                      <p className="text-xs text-muted-foreground">
                        {analytics.submissionsToday} today
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg Session Duration</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.averageDuration}m</div>
                      <p className="text-xs text-muted-foreground">
                        Average minutes per session
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Submission Rate</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {analytics.totalSessions > 0 
                          ? Math.round((analytics.totalSubmissions / analytics.totalSessions) * 100)
                          : 0}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Sessions with submissions
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Peak Usage Hours</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Times when the portal is most frequently accessed
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.peakHours.map((peak, index) => (
                        <div key={peak.hour} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                              {index + 1}
                            </div>
                            <span className="font-medium">{formatHour(peak.hour)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full"
                                style={{ 
                                  width: `${(peak.count / analytics.peakHours[0].count) * 100}%` 
                                }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-12 text-right">
                              {peak.count} sessions
                            </span>
                          </div>
                        </div>
                      ))}
                      {analytics.peakHours.length === 0 && (
                        <p className="text-center text-muted-foreground py-4">
                          No usage data available yet
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;