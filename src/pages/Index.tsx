import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from '@/contexts/SessionContext';
import { SessionTimer } from '@/components/SessionTimer';
import { GrievanceForm } from '@/components/GrievanceForm';
import { InnovationForm } from '@/components/InnovationForm';
import { ResourceLibrary } from '@/components/ResourceLibrary';
import { ExternalLinksDisplay } from '@/components/ExternalLinksDisplay';
import { FileText, Lightbulb, BookOpen, ExternalLink, Clock, Sparkles, ArrowRight, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ActiveSection = 'home' | 'grievance' | 'innovation' | 'resources' | 'links';

const Index = () => {
  const { isActive, activeSection, setActiveSection, startSession, logActivity } = useSession();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleNavigation = (section: ActiveSection) => {
    setActiveSection(section);
    logActivity('navigation', { section });
  };

  if (!isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md backdrop-blur-sm bg-card/95 border-2 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-24 h-16 flex items-center justify-center mb-4 p-2 bg-primary/10 rounded-xl">
              <img 
                src="/lovable-uploads/e07d40bc-4c8e-4386-af07-b2ac1232475c.png" 
                alt="Recovery Point West Virginia"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Client Resource Portal
            </CardTitle>
            <p className="text-muted-foreground text-sm mt-2">
              Secure access to resources and support services
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-br from-accent/20 to-accent/30 p-4 rounded-lg text-sm space-y-2 border border-accent/30">
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
              className="w-full hover:scale-[1.02] transition-all shadow-lg" 
              size="lg"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Start Session
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'resources':
        return (
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <ResourceLibrary />
          </div>
        );
      case 'links':
        return (
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <ExternalLinksDisplay />
          </div>
        );
      default:
        return (
          <div className="w-full max-w-6xl mx-auto space-y-8">
            <Card className="backdrop-blur-sm bg-card/95 border-2">
              <CardHeader className="text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
                <CardTitle className="text-3xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Welcome to the Client Resource Portal
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Access forms, resources, and support services during your session.
                </p>
              </CardHeader>
            </Card>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card
                className={`
                  relative overflow-hidden border-2 transition-all duration-300 cursor-pointer
                  bg-gradient-to-br from-primary/15 to-primary/25 hover:from-primary/25 hover:to-primary/35 border-primary/35
                  ${hoveredCard === 'resources' ? 'shadow-xl scale-[1.02] -translate-y-1' : 'shadow-md hover:shadow-lg'}
                `}
                onMouseEnter={() => setHoveredCard('resources')}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleNavigation('resources')}
              >
                {/* Animated background gradient */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent
                  transition-opacity duration-500
                  ${hoveredCard === 'resources' ? 'opacity-100' : 'opacity-0'}
                `} />
                
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-3">
                    <div className={`
                      p-2 bg-primary/10 rounded-lg
                      transition-all duration-300
                      ${hoveredCard === 'resources' ? 'scale-110 rotate-3' : ''}
                    `}>
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    Resource Library
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Access guides for employment, housing, education, and more.
                  </p>
                </CardHeader>
                <CardContent className="relative">
                  <Button variant="outline" className="w-full hover:scale-105 transition-all">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Browse Resources
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className={`
                  relative overflow-hidden border-2 transition-all duration-300 cursor-pointer
                  bg-gradient-to-br from-secondary/10 to-secondary/20 hover:from-secondary/20 hover:to-secondary/30 border-secondary/30
                  ${hoveredCard === 'links' ? 'shadow-xl scale-[1.02] -translate-y-1' : 'shadow-md hover:shadow-lg'}
                `}
                onMouseEnter={() => setHoveredCard('links')}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleNavigation('links')}
              >
                {/* Animated background gradient */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br from-transparent via-secondary/5 to-transparent
                  transition-opacity duration-500
                  ${hoveredCard === 'links' ? 'opacity-100' : 'opacity-0'}
                `} />
                
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-3">
                    <div className={`
                      p-2 bg-secondary/10 rounded-lg
                      transition-all duration-300
                      ${hoveredCard === 'links' ? 'scale-110 rotate-3' : ''}
                    `}>
                      <ExternalLink className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    External Links
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Quick access to helpful external websites and services.
                  </p>
                </CardHeader>
                <CardContent className="relative">
                  <Button variant="outline" className="w-full hover:scale-105 transition-all">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    View Links
                  </Button>
                </CardContent>
              </Card>

              <Card 
                className={`
                  relative overflow-hidden border-2 transition-all duration-300 cursor-pointer
                  bg-gradient-to-br from-purple-500/10 to-purple-600/20 hover:from-purple-500/20 hover:to-purple-600/30 border-purple-500/30
                  ${hoveredCard === 'survey' ? 'shadow-xl scale-[1.02] -translate-y-1' : 'shadow-md hover:shadow-lg'}
                `}
                onMouseEnter={() => setHoveredCard('survey')}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate('/survey')}
              >
                {/* Animated background gradient */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/5 to-transparent
                  transition-opacity duration-500
                  ${hoveredCard === 'survey' ? 'opacity-100' : 'opacity-0'}
                `} />
                
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-3">
                    <div className={`
                      p-2 bg-purple-500/10 rounded-lg
                      transition-all duration-300
                      ${hoveredCard === 'survey' ? 'scale-110 rotate-3' : ''}
                    `}>
                      <ClipboardList className="h-6 w-6 text-purple-600" />
                    </div>
                    Client Survey
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Share your feedback about your recovery experience.
                  </p>
                </CardHeader>
                <CardContent className="relative">
                  <Button variant="outline" className="w-full hover:scale-105 transition-all">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Take Survey
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <SessionTimer />
      
      {/* Enhanced Navigation Bar */}
      <nav className="bg-card/95 backdrop-blur-sm border-b shadow-lg border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-primary/10 rounded-lg">
                <img 
                  src="/lovable-uploads/e07d40bc-4c8e-4386-af07-b2ac1232475c.png" 
                  alt="Recovery Point West Virginia"
                  className="h-8 object-contain"
                />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Client Portal
              </span>
            </div>
            
            <div className="flex gap-1">
              <Button
                variant={activeSection === 'home' ? 'default' : 'ghost'}
                onClick={() => handleNavigation('home')}
                size="sm"
                className="hover:scale-105 transition-all"
              >
                Home
              </Button>
              <Button
                variant={activeSection === 'resources' ? 'default' : 'ghost'}
                onClick={() => handleNavigation('resources')}
                size="sm"
                className="hover:scale-105 transition-all"
              >
                Resources
              </Button>
              <Button
                variant={activeSection === 'links' ? 'default' : 'ghost'}
                onClick={() => handleNavigation('links')}
                size="sm"
                className="hover:scale-105 transition-all"
              >
                Links
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/survey')}
                size="sm"
                className="hover:scale-105 transition-all"
              >
                Survey
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
