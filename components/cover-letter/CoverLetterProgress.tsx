// components/cover-letter/CoverLetterProgress.tsx
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface ProgressProps {
  currentStep: number;
  steps: Array<{ id: number; title: string }>;
}

export function CoverLetterProgress({ currentStep, steps }: ProgressProps) {
  return (
    <div className="mb-8">
      <Progress value={(currentStep / steps.length) * 100} className="h-2" />
      <div className="flex justify-between mt-2">
        {steps.map((step) => (
          <motion.div
            key={step.id}
            className={`text-sm ${currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'}`}
            animate={{ scale: currentStep === step.id ? 1.1 : 1 }}
          >
            {step.title}
          </motion.div>
        ))}
      </div>
    </div>
  );
}