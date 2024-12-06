'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCV } from "@/lib/api-client";
import CVForm from "@/components/CVForm";
import { toast } from "@/hooks/use-toast";

// EditCVPage.tsx
const EditCVPage = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [cvData, setCvData] = useState(null);
  
    useEffect(() => {
      const loadCV = async () => {
        try {
          setLoading(true);
          const response = await getCV(id as string);
          console.log('CV Data from API:', response.data); // Debug log
          setCvData(response.data.sections);
          setLoading(false);
        } catch (error) {
          console.error('Failed to load CV:', error);
          toast({
            title: "Error",
            description: "Failed to load CV data",
            variant: "destructive"
          });
        }
      };
  
      if (id) {
        console.log('Loading CV with ID:', id); // Debug log
        loadCV();
      }
    }, [id]);
  
    if (loading) return <div>Loading CV data...</div>;
  
    console.log('Passing data to CVForm:', cvData); // Debug log
    return <CVForm isEditing={true} existingCvId={id as string} initialData={cvData} />;
  };

export default EditCVPage;