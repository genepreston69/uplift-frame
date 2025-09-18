import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSession } from '@/contexts/SessionContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileText, Copy, CheckCircle2, AlertTriangle } from 'lucide-react';

const LOCATIONS = [
  'Bluefield',
  'Charleston',
  'Huntington',
  'Parkersburg'
];

export const GrievanceForm: React.FC = () => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [namesInvolved, setNamesInvolved] = useState('');
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

    if (!description.trim() || !location) {
      toast({
        title: "Missing Information",
        description: "Please fill in the description and location.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const refNumber = generateReferenceNumber();
      const submissionData = {
        session_id: sessionId,
        type: 'grievance',
        reference_number: refNumber,
        content: {
          description: description.trim(),
          location,
          names_involved: namesInvolved.trim(),
          timestamp: new Date().toISOString()
        }
      };

      const { error } = await supabase
        .from('submissions')
        .insert(submissionData);

      if (error) throw error;

      logActivity('grievance_submitted', { reference_number: refNumber });

      setReferenceNumber(refNumber);
      setShowReference(true);

      // Clear form
      setDescription('');
      setLocation('');
      setNamesInvolved('');

      // Hide reference number after 30 seconds
      setTimeout(() => {
        setShowReference(false);
        setReferenceNumber(null);
      }, 30000);

      toast({
        title: "Grievance Submitted",
        description: `Your reference number is ${refNumber}. Please write it down!`
      });

    } catch (error) {
      console.error('Error submitting grievance:', error);
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
            Grievance Submitted Successfully
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
              This number will disappear in 30 seconds. You'll need it to reference your grievance.
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
            <FileText className="h-6 w-6 text-primary" />
          </div>
          File a Grievance
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Report concerns or issues that need attention from staff. All submissions are confidential.
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description of Issue <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe the issue or concern in detail..."
              className="min-h-32 bg-background/50 border-2 focus:border-primary/50 transition-all"
              maxLength={1000}
            />
            <div className="text-xs text-muted-foreground flex justify-between">
              <span>{description.length}/1000 characters</span>
              <span>Be as specific as possible</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Location <span className="text-destructive">*</span>
            </Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="bg-background/50 border-2 focus:border-primary/50 transition-all">
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                {LOCATIONS.map(loc => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="names" className="text-sm font-medium">Names Involved (Optional)</Label>
            <Input
              id="names"
              value={namesInvolved}
              onChange={(e) => setNamesInvolved(e.target.value)}
              placeholder="Names of people involved (if any)"
              className="bg-background/50 border-2 focus:border-primary/50 transition-all"
            />
            <div className="text-xs text-muted-foreground">
              This field is optional but may help staff address the issue
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !description.trim() || !location}
            className="w-full hover:scale-[1.02] transition-all"
            size="lg"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Submitting...
              </div>
            ) : (
              'Submit Grievance'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};