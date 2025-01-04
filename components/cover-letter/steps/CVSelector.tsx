// components/cover-letter/steps/CVSelector.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getCV, getUserCVs } from "@/lib/api-client";

interface CVData {
  sections: {
    type: string;
    title: string;
    content: any;
  }[];
  contact?: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  }

interface CV {
  id: string;
  title: string;
  created_at: string;
  sections: any[];  // Add sections
  template_id: string;
}

interface CVSelectorProps {
  onComplete: (data: { 
    cvId: string | null;
    cvContent?: any[];  // Add CV content
  }) => void;
}
export function CVSelector({ onComplete }: CVSelectorProps) {
  const [selectedCV, setSelectedCV] = useState<string | null>(null);
  const [savedCVs, setSavedCVs] = useState<CV[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedCVs();
  }, []);

  const loadSavedCVs = async () => {
    try {
      setIsLoading(true);
      const cvs = await getUserCVs();
      setSavedCVs(cvs);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your CVs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleCVSelect = async (cvId: string) => {
    try {
      setIsLoading(true);
      const response = await getCV(cvId);
      setSelectedCV(cvId);
      onComplete({ 
        cvId: cvId,
        cvContent: response.data.sections  // Pass sections data
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load CV data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File",
        description: "Please upload a PDF or DOCX file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "File size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      // Here you would implement your file upload logic
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "CV uploaded successfully",
      });

      // Refresh the CV list
      await loadSavedCVs();
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload CV. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Select Your CV</CardTitle>
          <CardDescription>
            Choose a CV or upload a new one to use for your cover letter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="saved" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="saved">Saved CVs</TabsTrigger>
              <TabsTrigger value="upload">Upload CV</TabsTrigger>
            </TabsList>

            <TabsContent value="saved">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : savedCVs.length > 0 ? (
                <Select onValueChange={handleCVSelect} value={selectedCV ?? undefined}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a CV" />
                  </SelectTrigger>
                  <SelectContent>
                    {savedCVs.map(cv => (
                      <SelectItem key={cv.id} value={cv.id}>
                        {cv.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No saved CVs found. Please upload a new one.
                </div>
              )}
            </TabsContent>

            <TabsContent value="upload">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="cv-upload"
                  className="hidden"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">
                  Upload your CV (PDF, DOCX)
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('cv-upload')?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Choose File'
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button 
              onClick={() => onComplete({ cvId: selectedCV })}
              disabled={!selectedCV}
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}