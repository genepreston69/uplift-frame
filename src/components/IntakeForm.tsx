import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IntakeForm = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <div className="h-screen flex flex-col">
        <div className="px-4 py-2">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="flex-1 px-4 pb-4">
          <iframe
            src="https://apps.behavehealth.com/forms/recovery-point-2juavt/600a2883-f2b9-4d5e-a65d-70332325726e"
            className="w-full h-full border-0 rounded-lg"
            title="Intake Form"
            allow="camera; microphone"
          />
        </div>
      </div>
    </div>
  );
};

export default IntakeForm;
