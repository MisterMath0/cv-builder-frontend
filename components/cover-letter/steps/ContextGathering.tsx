// @/components/cover-letter/steps/ContextGathering.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ContextGatheringProps {
  onComplete: (data: {
    style: string;
    tone: string;
    additionalContext: string;
    focusPoints: string[];
  }) => void;
}

export function ContextGathering({ onComplete }: ContextGatheringProps) {
  const [context, setContext] = useState({
    style: "professional",
    tone: "formal",
    additionalContext: "",
    focusPoints: [] as string[]
  });

  const styles = [
    { value: "professional", label: "Professional" },
    { value: "creative", label: "Creative" },
    { value: "academic", label: "Academic" },
    { value: "modern", label: "Modern" }
  ];

  const tones = [
    { value: "formal", label: "Formal" },
    { value: "confident", label: "Confident" },
    { value: "enthusiastic", label: "Enthusiastic" },
    { value: "conservative", label: "Conservative" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Writing Preferences</CardTitle>
          <CardDescription>
            Customize how your cover letter should be written.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Writing Style Selection */}
          <div className="space-y-4">
            <Label>Writing Style</Label>
            <RadioGroup
              value={context.style}
              onValueChange={(value) => 
                setContext(prev => ({ ...prev, style: value }))
              }
              className="grid grid-cols-2 gap-4"
            >
              {styles.map((style) => (
                <div key={style.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={style.value} id={style.value} />
                  <Label htmlFor={style.value}>{style.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Tone Selection */}
          <div className="space-y-4">
            <Label>Tone</Label>
            <RadioGroup
              value={context.tone}
              onValueChange={(value) => 
                setContext(prev => ({ ...prev, tone: value }))
              }
              className="grid grid-cols-2 gap-4"
            >
              {tones.map((tone) => (
                <div key={tone.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={tone.value} id={tone.value} />
                  <Label htmlFor={tone.value}>{tone.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Additional Context */}
          <div className="space-y-2">
            <Label>Additional Context</Label>
            <Textarea
              placeholder="Add any specific points you'd like to emphasize..."
              value={context.additionalContext}
              onChange={(e) => setContext(prev => ({
                ...prev,
                additionalContext: e.target.value
              }))}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end mt-6">
            <Button 
              onClick={() => onComplete(context)}
              variant="default"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}