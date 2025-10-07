import React, { useState } from 'react';
import { Heart, ClipboardList, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/contexts/SessionContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const surveyQuestions = [
  // Overall Experience
  { id: 'overall_satisfied', text: 'I am satisfied with my overall experience at Recovery Point.', category: 'overall' },
  { id: 'safe_environment', text: 'I feel safe and secure in this environment.', category: 'overall' },
  { id: 'program_helping', text: 'This program is helping me in my recovery journey.', category: 'overall' },
  
  // Staff & Support
  { id: 'staff_respectful', text: 'Staff members treat me with dignity and respect.', category: 'staff' },
  { id: 'staff_available', text: 'Staff are available when I need support or have questions.', category: 'staff' },
  { id: 'staff_knowledgeable', text: 'Staff are knowledgeable and helpful in my recovery.', category: 'staff' },
  { id: 'concerns_addressed', text: 'My concerns and complaints are addressed in a timely manner.', category: 'staff' },
  
  // Program Structure
  { id: 'rules_fair', text: 'The program rules and restrictions are fair and necessary for recovery.', category: 'program' },
  { id: 'daily_structure', text: 'The daily structure and schedule supports my recovery goals.', category: 'program' },
  { id: 'counseling_helpful', text: 'Individual counseling sessions are helpful and meaningful.', category: 'program' },
  { id: 'group_valuable', text: 'Group therapy sessions provide value to my recovery.', category: 'program' },
  { id: 'activities_engaging', text: 'Program activities and classes are engaging and beneficial.', category: 'program' },
  
  // Living Conditions
  { id: 'housing_adequate', text: 'The housing accommodations meet my basic needs.', category: 'living' },
  { id: 'food_satisfactory', text: 'The food quality and meal options are satisfactory.', category: 'living' },
  { id: 'facility_clean', text: 'The facility is clean and well-maintained.', category: 'living' },
  { id: 'personal_space', text: 'I have adequate personal space and privacy when needed.', category: 'living' },
  
  // Personal Growth
  { id: 'coping_skills', text: 'I am developing better coping skills for life challenges.', category: 'growth' },
  { id: 'relationships_improving', text: 'My relationships with family and others are improving.', category: 'growth' },
  { id: 'future_hopeful', text: 'I feel hopeful about my future after completing this program.', category: 'growth' },
  { id: 'making_progress', text: 'I can see positive changes in myself since starting the program.', category: 'growth' },
  
  // Communication & Resources
  { id: 'info_clear', text: 'Information about program expectations and progress is communicated clearly.', category: 'communication' },
  { id: 'resources_available', text: 'Educational and support resources are readily available when I need them.', category: 'communication' },
  { id: 'tech_adequate', text: 'The kiosk system provides adequate access for my needs.', category: 'communication' },
  
  // Recovery Environment
  { id: 'peers_supportive', text: 'My peers in the program are generally supportive of recovery.', category: 'environment' },
  { id: 'triggers_managed', text: 'The program helps me identify and manage my triggers effectively.', category: 'environment' },
  { id: 'spiritual_supported', text: 'My spiritual or personal beliefs are respected and supported.', category: 'environment' },
  { id: 'prepared_transition', text: 'I feel the program is preparing me for successful transition after completion.', category: 'environment' }
];

const ratingOptions = [
  { value: '1', label: 'Strongly Disagree', color: 'bg-red-100 border-red-300 text-red-800' },
  { value: '2', label: 'Disagree', color: 'bg-orange-100 border-orange-300 text-orange-800' },
  { value: '3', label: 'Neutral', color: 'bg-gray-100 border-gray-300 text-gray-800' },
  { value: '4', label: 'Agree', color: 'bg-blue-100 border-blue-300 text-blue-800' },
  { value: '5', label: 'Strongly Agree', color: 'bg-green-100 border-green-300 text-green-800' }
];

const ClientSurvey = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [location, setLocation] = useState('');
  const [tenure, setTenure] = useState('');
  const [responses, setResponses] = useState({});
  const [workingWell, setWorkingWell] = useState('');
  const [improvements, setImprovements] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');

  const { sessionId, logActivity, generateReferenceNumber } = useSession();
  const { toast } = useToast();

  const questionsPerPage = 5;
  const totalPages = Math.ceil(surveyQuestions.length / questionsPerPage) + 2;
  
  const getCurrentQuestions = () => {
    if (currentPage === 0) return [];
    if (currentPage === totalPages - 1) return [];
    
    const startIdx = (currentPage - 1) * questionsPerPage;
    const endIdx = startIdx + questionsPerPage;
    return surveyQuestions.slice(startIdx, endIdx);
  };

  const handleNext = () => {
    setShowError('');
    
    if (currentPage === 0 && (!location || !tenure)) {
      if (!location) {
        setShowError('Please select your location.');
        return;
      }
      if (!tenure) {
        setShowError('Please select how long you have been in the program.');
        return;
      }
    }
    
    if (currentPage > 0 && currentPage < totalPages - 1) {
      const currentQuestions = getCurrentQuestions();
      const unanswered = currentQuestions.filter(q => !responses[q.id]);
      if (unanswered.length > 0) {
        setShowError('Please answer all questions before continuing.');
        return;
      }
    }
    
    setCurrentPage(prev => prev + 1);
  };

  const handlePrevious = () => {
    setShowError('');
    setCurrentPage(prev => prev - 1);
  };

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setShowError('');

    try {
      const refNumber = generateReferenceNumber();
      setReferenceNumber(refNumber);

      const surveyData = {
        location,
        tenure,
        responses,
        open_feedback: {
          working_well: workingWell.trim(),
          improvements: improvements.trim(),
          additional_comments: additionalComments.trim()
        }
      };

      const { error } = await supabase
        .from('survey_responses')
        .insert({
          location,
          tenure,
          responses,
          open_feedback: {
            working_well: workingWell.trim(),
            improvements: improvements.trim(),
            additional_comments: additionalComments.trim()
          },
          reference_number: refNumber,
          session_id: sessionId,
        });

      if (error) throw error;

      await logActivity('survey_submitted', { 
        type: 'client_survey', 
        reference_number: refNumber,
        total_questions: surveyQuestions.length
      });

      setShowConfirmation(true);
      toast({
        title: "Survey submitted successfully",
        description: `Reference number: ${refNumber}`,
      });
    } catch (error) {
      console.error('Error submitting survey:', error);
      setShowError('Failed to submit survey. Please try again.');
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferenceNumber = async () => {
    try {
      await navigator.clipboard.writeText(referenceNumber);
      toast({
        title: "Reference number copied",
        description: "The reference number has been copied to your clipboard.",
      });
    } catch (error) {
      console.error('Failed to copy reference number:', error);
    }
  };

  if (showConfirmation) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-xl">
        <CardHeader className="text-center bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Thank You for Your Feedback!
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-center space-y-6">
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-green-200">
            <p className="text-lg font-medium text-green-800 mb-2">
              Reference Number: {referenceNumber}
            </p>
            <Button 
              onClick={copyReferenceNumber}
              variant="outline"
              size="sm"
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              Copy Reference Number
            </Button>
          </div>
          
          <div className="space-y-4">
            <p className="text-lg font-medium text-gray-800">
              Your voice matters in your recovery journey.
            </p>
            <p className="text-gray-600">
              Every step forward, no matter how small, is progress. Your feedback helps us 
              create a better environment for everyone's recovery.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <p className="text-lg italic text-blue-900">
                "Recovery is not a race. You don't have to feel guilty if it takes you longer 
                than you thought it would. Progress is progress, no matter how small."
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Your next survey will be available in 3 months. Keep up the great work!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2 mb-2">
          <ClipboardList className="h-6 w-6" />
          <CardTitle className="text-2xl font-bold">Client Feedback Survey</CardTitle>
        </div>
        <p className="text-blue-100 text-sm">
          Your honest feedback helps us improve our services. This survey is completely anonymous.
        </p>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-blue-100 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentPage + 1) / totalPages) * 100)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {showError && (
          <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg text-red-800 text-sm animate-in slide-in-from-top-1 duration-200">
            {showError}
          </div>
        )}

        {currentPage === 0 && (
          <div className="space-y-6">
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
              <label className="text-base font-medium mb-4 block text-gray-800">
                What is your location? <span className="text-red-500">*</span>
              </label>
              <select 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white/70 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">Select your location</option>
                <option value="Bluefield">Bluefield</option>
                <option value="Charleston">Charleston</option>
                <option value="Huntington">Huntington</option>
                <option value="Parkersburg">Parkersburg</option>
              </select>
            </div>
            
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
              <label className="text-base font-medium mb-4 block text-gray-800">
                How long have you been at Recovery Point? <span className="text-red-500">*</span>
              </label>
              <select 
                value={tenure} 
                onChange={(e) => setTenure(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white/70 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">Select time in program</option>
                <option value="less-30">Less than 30 days</option>
                <option value="1-3">1-3 months</option>
                <option value="3-6">3-6 months</option>
                <option value="6-9">6-9 months</option>
                <option value="9-12">9-12 months</option>
                <option value="over-12">Over 12 months</option>
              </select>
            </div>
          </div>
        )}

        {currentPage > 0 && currentPage < totalPages - 1 && (
          <div className="space-y-6">
            {getCurrentQuestions().map((question, index) => (
              <div key={question.id} className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200">
                <label className="text-base font-medium text-gray-800 mb-4 block">{question.text}</label>
                <div className="grid grid-cols-5 gap-2">
                  {ratingOptions.map((option) => (
                    <div key={option.value} className="flex flex-col items-center text-center">
                      <label className={`
                        relative w-full p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105
                        ${responses[question.id] === option.value 
                          ? option.color + ' ring-2 ring-offset-2 ring-blue-500' 
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }
                      `}>
                        <input
                          type="radio"
                          name={question.id}
                          value={option.value}
                          checked={responses[question.id] === option.value}
                          onChange={(e) => handleResponseChange(question.id, e.target.value)}
                          className="sr-only"
                        />
                        {responses[question.id] === option.value && (
                          <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <span className="text-xs font-medium block">
                          {option.label}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {currentPage === totalPages - 1 && (
          <div className="space-y-6">
            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
              <label className="font-medium text-gray-800 block mb-2">What's working well for you in the program?</label>
              <Textarea
                value={workingWell}
                onChange={(e) => setWorkingWell(e.target.value)}
                placeholder="Share what aspects of the program are helpful..."
                className="bg-white/70 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{workingWell.length}/500 characters</p>
            </div>

            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
              <label className="font-medium text-gray-800 block mb-2">What could be improved?</label>
              <Textarea
                value={improvements}
                onChange={(e) => setImprovements(e.target.value)}
                placeholder="Share your suggestions for improvement..."
                className="bg-white/70 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{improvements.length}/500 characters</p>
            </div>

            <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-gray-200">
              <label className="font-medium text-gray-800 block mb-2">Any other comments?</label>
              <Textarea
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                placeholder="Anything else you'd like to share..."
                className="bg-white/70 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{additionalComments.length}/500 characters</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button
            onClick={handlePrevious}
            disabled={currentPage === 0}
            variant="outline"
            className="border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          {currentPage < totalPages - 1 ? (
            <Button 
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Survey'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientSurvey;