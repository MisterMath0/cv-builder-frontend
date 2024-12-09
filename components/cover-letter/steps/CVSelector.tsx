// components/cover-letter/steps/CVSelector.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface CVSelectorProps {
  onComplete: (data: { cvId: string | null }) => void;
}

export function CVSelector({ onComplete }: CVSelectorProps) {
  const [selectedCV, setSelectedCV] = useState<string | null>(null);

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
              <Select onValueChange={setSelectedCV}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a CV" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cv1">Software Engineer CV</SelectItem>
                  <SelectItem value="cv2">Product Manager CV</SelectItem>
                </SelectContent>
              </Select>
            </TabsContent>

            <TabsContent value="upload">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">
                  Upload your CV (PDF, DOCX)
                </p>
                <Button variant="outline">Choose File</Button>
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