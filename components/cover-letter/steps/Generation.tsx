// @/components/cover-letter/steps/Generation.tsx
'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MinimalTiptapEditor } from "@/components/minimal-tiptap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Download,
  FileText, 
  Loader2, 
  Sparkles,
  FileCheck
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generateCoverLetter } from "@/lib/api-client";

interface GenerationProps {
  formData: {
    cvId: string | null;
    jobDescription: string;
    context: {
      style: string;
      tone: string;
      additionalContext: string;
    };
  };
}

export function Generation({ formData }: GenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [matchScore, setMatchScore] = useState(0);
  const { toast } = useToast();
const handleContentChange = (newContent: any) => {
    setGeneratedContent(newContent);
  };
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const data = await generateCoverLetter(formData);
      setGeneratedContent(data.content);
      setMatchScore(data.matching_score);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Generation Card */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Cover Letter</CardTitle>
          <CardDescription>
            AI will generate a personalized cover letter based on your CV and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!generatedContent ? (
            <div className="text-center py-8">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Ready to Generate</h3>
              <p className="text-muted-foreground mb-4">
                Click generate to create your personalized cover letter.
              </p>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Cover Letter
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Match Score */}
              <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Match Score</h4>
                  <p className="text-sm text-muted-foreground">
                    Based on job requirements
                  </p>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {matchScore}%
                </div>
              </div>

              {/* Editor */}
              <Card>
                <CardContent className="p-4">
                  <MinimalTiptapEditor
                    value={generatedContent}
                    onChange={handleContentChange}
                    editorContentClassName="prose max-w-none min-h-[400px] p-4"
                  />
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(true)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => handleGenerate()}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                  <Button>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Cover Letter Preview</DialogTitle>
            <DialogDescription>
              Preview how your cover letter will look when exported.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-6 bg-white rounded-lg">
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: generatedContent }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}