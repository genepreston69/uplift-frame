import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IntakeForm = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="backdrop-blur-sm bg-card/95 border-2">
          <CardHeader className="text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
            <CardTitle className="text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Intake Form
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Complete the intake form to begin your journey with us.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="w-full" style={{ height: 'calc(100vh - 250px)' }}>
              <iframe
                src="https://apps.behavehealth.com/forms/recovery-point-2juavt/600a2883-f2b9-4d5e-a65d-70332325726e"
                className="w-full h-full border-0"
                title="Intake Form"
                allow="camera; microphone"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntakeForm;
