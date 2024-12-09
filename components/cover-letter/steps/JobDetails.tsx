// components/cover-letter/steps/JobDetails.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "lucide-react";

interface JobDetailsProps {
  onComplete: (data: { 
    jobDescription: string;
    jobUrl?: string;
    companyName?: string;
    jobTitle?: string;
  }) => void;
}

export function JobDetails({ onComplete }: JobDetailsProps) {
  const [jobDetails, setJobDetails] = useState({
    jobDescription: "",
    jobUrl: "",
    companyName: "",
    jobTitle: ""
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>
            Provide the job description or paste the job posting URL.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="text">Enter Text</TabsTrigger>
              <TabsTrigger value="url">Job URL</TabsTrigger>
            </TabsList>

            <TabsContent value="text">
              <div className="space-y-4">
                <div>
                  <Input 
                    placeholder="Company Name"
                    value={jobDetails.companyName}
                    onChange={(e) => setJobDetails(prev => ({
                      ...prev,
                      companyName: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Input 
                    placeholder="Job Title"
                    value={jobDetails.jobTitle}
                    onChange={(e) => setJobDetails(prev => ({
                      ...prev,
                      jobTitle: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Textarea 
                    placeholder="Paste job description here..."
                    value={jobDetails.jobDescription}
                    onChange={(e) => setJobDetails(prev => ({
                      ...prev,
                      jobDescription: e.target.value
                    }))}
                    className="min-h-[200px]"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="url">
              <div className="flex gap-2">
                <Input 
                  placeholder="Paste job posting URL"
                  value={jobDetails.jobUrl}
                  onChange={(e) => setJobDetails(prev => ({
                    ...prev,
                    jobUrl: e.target.value
                  }))}
                />
                <Button variant="outline">
                  <Link className="h-4 w-4 mr-2" />
                  Fetch
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button 
              onClick={() => onComplete(jobDetails)}
              disabled={!jobDetails.jobDescription && !jobDetails.jobUrl}
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}