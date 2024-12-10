// @/components/cover-letter/CoverLetterBuilder.tsx
'use client';
import { useState, useEffect } from "react";
import { CoverLetterHeader } from "@/components/cover-letter/CoverLetterHeader";
import { CoverLetterProgress } from "@/components/cover-letter/CoverLetterProgress";
import { CreditsDisplay } from "@/components/cover-letter/CreditsDisplay";
import { CVSelector } from "@/components/cover-letter/steps/CVSelector";
import { JobDetails } from "@/components/cover-letter/steps/JobDetails";
import { ContextGathering } from "@/components/cover-letter/steps/ContextGathering";
import { Generation } from "@/components/cover-letter/steps/Generation";
import { useToast } from "@/hooks/use-toast";
import { 
  generateCoverLetter, 
  getRemainingCredits,
  saveCoverLetter,
  exportCoverLetter
} from "@/lib/api-client";

export const steps = [
  { id: 1, title: "Select CV" },
  { id: 2, title: "Job Details" },
  { id: 3, title: "Context" },
  { id: 4, title: "Generation" }
];

interface FormData {
  cvId: string | null;
  jobDescription: string;
  jobUrl?: string;
  companyName?: string;
  jobTitle?: string;
  context: {
    style: string;
    tone: string;
    additionalContext: string;
    focusPoints: string[];
  };
}


export default function CoverLetterBuilder() {
  const [step, setStep] = useState(1);
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    cvId: null,
    jobDescription: "",
    context: {
      style: "professional",
      tone: "formal",
      additionalContext: "",
      focusPoints: []
    }
  });

  useEffect(() => {
    loadCredits();
  }, []);

  const loadCredits = async () => {
    try {
      const response = await getRemainingCredits();
      setCredits(response.credits);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load credits",
        variant: "destructive"
      });
    }
  };

  const handleStepComplete = async (stepData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    
    if (step === 3 && credits <= 0) {
      toast({
        title: "Insufficient Credits",
        description: "Please purchase more credits to generate cover letters",
        variant: "destructive"
      });
      return;
    }
    
    setStep(prev => prev + 1);
  };

  const handleGeneration = async (generatedContent: string) => {
    try {
      setIsLoading(true);
      await saveCoverLetter({
        content: generatedContent,
        ...formData
      });
      
      await loadCredits();
      
      toast({
        title: "Success",
        description: "Cover letter generated and saved successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save cover letter",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (letterId: string, format: 'pdf' | 'docx') => {
    try {
      await exportCoverLetter(letterId, format);
      toast({
        title: "Success",
        description: `Cover letter exported as ${format.toUpperCase()}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export cover letter",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <CoverLetterHeader />
      <CoverLetterProgress currentStep={step} steps={steps} />
      <CreditsDisplay credits={credits} />

      {step === 1 && (
        <CVSelector 
          onComplete={handleStepComplete}
        />
      )}
      
      {step === 2 && (
        <JobDetails 
          onComplete={handleStepComplete}
        />
      )}
      
      {step === 3 && (
        <ContextGathering 
          onComplete={handleStepComplete}
        />
      )}
      
      {step === 4 && (
        <Generation 
          formData={formData}
          onGenerate={handleGeneration}
          onExport={handleExport}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}