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
import { FileText, Copy } from 'lucide-react';

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
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center bg-green-50 dark:bg-green-900/20">
          <CardTitle className="text-green-800 dark:text-green-200 text-2xl">
            Grievance Submitted Successfully
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <p className="text-lg font-semibold text-red-600 mb-4">
              IMPORTANT: Write down your reference number!
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 rounded-lg p-6 mb-4">
              <div className="text-3xl font-mono font-bold text-yellow-800 dark:text-yellow-200 mb-2">
                {referenceNumber}
              </div>
              <Button
                onClick={copyReferenceNumber}
                variant="outline"
                size="sm"
                className="gap-2"
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          File a Grievance
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Report concerns or issues that need attention from staff.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="description">
              Description of Issue <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe the issue or concern in detail..."
              className="min-h-24 mt-1"
              maxLength={1000}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {description.length}/1000 characters
            </div>
          </div>

          <div>
            <Label htmlFor="location">
              Location <span className="text-red-500">*</span>
            </Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                {LOCATIONS.map(loc => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="names">Names Involved (Optional)</Label>
            <Input
              id="names"
              value={namesInvolved}
              onChange={(e) => setNamesInvolved(e.target.value)}
              placeholder="Names of people involved (if any)"
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !description.trim() || !location}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Grievance'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};