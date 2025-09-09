import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from '@/contexts/SessionContext';
import { SessionTimer } from '@/components/SessionTimer';
import { GrievanceForm } from '@/components/GrievanceForm';
import { InnovationForm } from '@/components/InnovationForm';
import { FileText, Lightbulb, BookOpen, ExternalLink, Clock } from 'lucide-react';

type ActiveSection = 'home' | 'grievance' | 'innovation' | 'resources' | 'links';

const Index = () => {
  const { isActive, activeSection, setActiveSection, startSession, logActivity } = useSession();

  const handleNavigation = (section: ActiveSection) => {
    setActiveSection(section);
    logActivity('navigation', { section });
  };

  if (!isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-24 h-16 flex items-center justify-center mb-4">
              <img 
                src="/lovable-uploads/e07d40bc-4c8e-4386-af07-b2ac1232475c.png" 
                alt="Recovery Point West Virginia"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <CardTitle className="text-2xl">Recovery Resource Portal</CardTitle>
            <p className="text-muted-foreground text-sm">
              Secure access to resources and support services
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-accent/50 p-4 rounded-lg text-sm space-y-2">
              <div className="flex items-center gap-2 text-accent-foreground">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Session Information</span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1 ml-6">
                <li>• 30-minute maximum session time</li>
                <li>• 10-minute idle timeout</li>
                <li>• All data cleared when session ends</li>
                <li>• Save reference numbers immediately</li>
              </ul>
            </div>
            <Button 
              onClick={startSession} 
              className="w-full" 
              size="lg"
            >
              Start Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'grievance':
        return <GrievanceForm />;
      case 'innovation':
        return <InnovationForm />;
      case 'resources':
        return (
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Resource Library
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Access helpful resources for your recovery journey.
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Resource library will be available after admin setup.</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'links':
        return (
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                External Resources
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Helpful external websites and resources.
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <ExternalLink className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>External links will be available after admin setup.</p>
              </div>
            </CardContent>
          </Card>
        );
      default:
        return (
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Welcome to the Recovery Resource Portal</CardTitle>
                <p className="text-muted-foreground">
                  Access forms, resources, and support services during your session.
                </p>
              </CardHeader>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleNavigation('grievance')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    File a Grievance
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Report concerns or issues that need staff attention.
                  </p>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Open Grievance Form
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleNavigation('innovation')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Innovation Ideas
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Share ideas to improve our community and programs.
                  </p>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Share Your Idea
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleNavigation('resources')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Resource Library
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Access guides for employment, housing, education, and more.
                  </p>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Browse Resources
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleNavigation('links')}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    External Links
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Quick access to helpful external websites and services.
                  </p>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Links
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <SessionTimer />
      
      {/* Navigation Bar */}
      <nav className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/e07d40bc-4c8e-4386-af07-b2ac1232475c.png" 
                alt="Recovery Point West Virginia"
                className="h-8 object-contain"
              />
              <span className="text-xl font-semibold">Recovery Portal</span>
            </div>
            
            <div className="flex gap-1">
              <Button
                variant={activeSection === 'home' ? 'default' : 'ghost'}
                onClick={() => handleNavigation('home')}
                size="sm"
              >
                Home
              </Button>
              <Button
                variant={activeSection === 'grievance' ? 'default' : 'ghost'}
                onClick={() => handleNavigation('grievance')}
                size="sm"
              >
                Grievance
              </Button>
              <Button
                variant={activeSection === 'innovation' ? 'default' : 'ghost'}
                onClick={() => handleNavigation('innovation')}
                size="sm"
              >
                Ideas
              </Button>
              <Button
                variant={activeSection === 'resources' ? 'default' : 'ghost'}
                onClick={() => handleNavigation('resources')}
                size="sm"
              >
                Resources
              </Button>
              <Button
                variant={activeSection === 'links' ? 'default' : 'ghost'}
                onClick={() => handleNavigation('links')}
                size="sm"
              >
                Links
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
