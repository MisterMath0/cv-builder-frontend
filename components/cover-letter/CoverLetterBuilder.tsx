// components/cover-letter/CoverLetterBuilder.tsx
'use client';
import { useState } from "react";
import {CoverLetterHeader} from "@/components/cover-letter/CoverLetterHeader";
import {CoverLetterProgress} from "@/components/cover-letter/CoverLetterProgress";
import {CreditsDisplay} from "@/components/cover-letter/CreditsDisplay";
import {CVSelector} from "@/components/cover-letter/steps/CVSelector";
import {JobDetails} from "@/components/cover-letter/steps/JobDetails";
import {ContextGathering} from "@/components/cover-letter/steps/ContextGathering";
import {Generation} from "@/components/cover-letter/steps/Generation";
import { generateCoverLetter, saveCoverLetter, getAllCoverLetters, getCoverLetterById, exportCoverLetter, getRemainingCredits } from "@/lib/api-client";

export const steps = [
  { id: 1, title: "Select CV" },
  { id: 2, title: "Job Details" },
  { id: 3, title: "Context" },
  { id: 4, title: "Generation" }
];

export function CoverLetterBuilder() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    cvId: null,
    jobDescription: "",
    context: {
      style: "", 
      tone: "", 
      additionalContext: "" 
    },
    preferences: {}
  });

  const handleStepComplete = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setStep(prev => prev + 1);
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <CoverLetterHeader />
      <CoverLetterProgress currentStep={step} steps={steps} />
      <CreditsDisplay />

      {step === 1 && <CVSelector onComplete={handleStepComplete} />}
      {step === 2 && <JobDetails onComplete={handleStepComplete} />}
      {step === 3 && <ContextGathering onComplete={handleStepComplete} />}
      {step === 4 && <Generation formData={formData} />}
    </div>
  );
}