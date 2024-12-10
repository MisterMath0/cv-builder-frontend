// @/components/cover-letter/steps/Generation.tsx
'use client';
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useToast } from "@/hooks/use-toast";
import { 
  Download,
  FileText, 
  Loader2, 
  Sparkles,
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
  onGenerate: (content: string) => Promise<void>;
  onExport: (letterId: string, format: 'pdf' | 'docx') => Promise<void>;
  isLoading: boolean;
}

export function Generation({ formData, onGenerate, onExport, isLoading }: GenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [matchScore, setMatchScore] = useState(0);
  const [letterId, setLetterId] = useState<string | null>(null);
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none min-h-[400px] p-4 focus:outline-none'
      }
    }
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await generateCoverLetter(formData);
      editor?.commands.setContent(response.content);
      setMatchScore(response.matching_score);
      setLetterId(response.id);
      
      await onGenerate(response.content);
      
      toast({
        title: "Success",
        description: "Cover letter generated successfully!"
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate cover letter",
        variant: "destructive"
      });
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
      <Card>
        <CardHeader>
          <CardTitle>Generate Cover Letter</CardTitle>
          <CardDescription>
            AI will generate a personalized cover letter based on your CV and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!editor?.getText() ? (
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

              <Card>
                <CardContent className="p-4">
                  <EditorContent editor={editor} />
                </CardContent>
              </Card>

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
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                  <Button
                    onClick={() => onExport(letterId!, 'pdf')}
                    disabled={!letterId}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onExport(letterId!, 'docx')}
                    disabled={!letterId}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export DOCX
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

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
              dangerouslySetInnerHTML={{ __html: editor?.getHTML() || '' }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
