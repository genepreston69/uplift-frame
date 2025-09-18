import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSession } from '@/contexts/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Lightbulb, Copy, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export const InnovationForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [impact, setImpact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  const [showReference, setShowReference] = useState(false);

  const { sessionId, logActivity, generateReferenceNumber } = useSession();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionId) {
      toast({
        title: "No Active Session",
        description: "Please start a session first.",
        variant: "destructive"
      });
      return;
    }

    if (!title.trim() || !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in the idea title and description.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const refNumber = generateReferenceNumber();
      const submissionData = {
        session_id: sessionId,
        type: 'innovation',
        reference_number: refNumber,
        content: {
          title: title.trim(),
          description: description.trim(),
          potential_impact: impact.trim(),
          timestamp: new Date().toISOString()
        }
      };

      const { error } = await supabase
        .from('submissions')
        .insert(submissionData);

      if (error) throw error;

      logActivity('innovation_submitted', { reference_number: refNumber });

      setReferenceNumber(refNumber);
      setShowReference(true);

      // Clear form
      setTitle('');
      setDescription('');
      setImpact('');

      // Hide reference number after 30 seconds
      setTimeout(() => {
        setShowReference(false);
        setReferenceNumber(null);
      }, 30000);

      toast({
        title: "Innovation Idea Submitted",
        description: `Your reference number is ${refNumber}. Please write it down!`
      });

    } catch (error) {
      console.error('Error submitting innovation:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact staff for assistance.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferenceNumber = () => {
    if (referenceNumber) {
      navigator.clipboard.writeText(referenceNumber);
      toast({
        title: "Copied!",
        description: "Reference number copied to clipboard."
      });
    }
  };

  if (showReference && referenceNumber) {
    return (
      <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-card/95 border-2">
        <CardHeader className="text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-lg">
          <CardTitle className="flex items-center justify-center gap-3 text-primary text-2xl">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            Innovation Idea Submitted Successfully
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <p className="text-lg font-semibold text-destructive">
                IMPORTANT: Write down your reference number!
              </p>
            </div>
            <div className="bg-gradient-to-br from-accent/20 to-accent/30 border-2 border-accent/50 rounded-lg p-6 mb-4 transition-all hover:shadow-lg">
              <div className="text-3xl font-mono font-bold text-accent-foreground mb-4">
                {referenceNumber}
              </div>
              <Button
                onClick={copyReferenceNumber}
                variant="outline"
                size="sm"
                className="gap-2 hover:scale-105 transition-all"
              >
                <Copy className="h-4 w-4" />
                Copy Number
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              This number will disappear in 30 seconds. You'll need it to reference your idea.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-card/95 border-2">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          Share an Innovation Idea
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Suggest improvements or new ideas to enhance our community. Your creativity matters!
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Idea Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief title for your idea..."
              className="bg-background/50 border-2 focus:border-primary/50 transition-all"
              maxLength={100}
            />
            <div className="text-xs text-muted-foreground flex justify-between">
              <span>{title.length}/100 characters</span>
              <span>Make it catchy and clear</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your idea in detail..."
              className="min-h-32 bg-background/50 border-2 focus:border-primary/50 transition-all"
              maxLength={1000}
            />
            <div className="text-xs text-muted-foreground flex justify-between">
              <span>{description.length}/1000 characters</span>
              <span>Be specific about implementation</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="impact" className="text-sm font-medium">Potential Impact (Optional)</Label>
            <Textarea
              id="impact"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
              placeholder="How might this idea benefit the community?"
              className="min-h-24 bg-background/50 border-2 focus:border-primary/50 transition-all"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground flex justify-between">
              <span>{impact.length}/500 characters</span>
              <span>Think about long-term benefits</span>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !title.trim() || !description.trim()}
            className="w-full hover:scale-[1.02] transition-all"
            size="lg"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Submitting...
              </div>
            ) : (
              'Submit Innovation Idea'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};