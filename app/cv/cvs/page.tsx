'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCV, getUserCVs, exportCV, previewCV } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreVertical, Download, Eye, Trash, File } from "lucide-react";
import CVGrid from "@/components/CVGrid";

export interface CV {
  id: string;
  title: string;
  status: "published" | "draft";
  previewImageUrl: string;
  sections: any[];
  template_id: string;
  created_at: string;
  updated_at: string;
}

const CVPage = () => {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    try {
      setLoading(true);
      const response = await getUserCVs();
      setCvs(response);
    } catch (err) {
      console.error("Failed to fetch CVs:", err);
      toast({
        title: "Error",
        description: "Failed to fetch CVs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/cv/cvs/edit/${id}`); // Match your folder structure
  };

  const handlePreview = async (cv: CV) => {
    try {
      const html = await previewCV(cv.sections, cv.template_id);
      setPreviewHtml(html);
      setPreviewOpen(true);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to generate preview",
        variant: "destructive"
      });
    }
  };

  const handleExport = async (cv: CV, format: 'pdf' | 'docx') => {
    try {
      await exportCV(cv.sections, cv.template_id, format);
      toast({
        title: "Success",
        description: `CV exported as ${format.toUpperCase()}`
      });
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to export as ${format.toUpperCase()}`,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this CV?')) return;
    
    try {
      await deleteCV(id);
      setCvs((prev) => prev.filter((cv) => cv.id !== id));
      toast({
        title: "Success",
        description: "CV deleted successfully"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete the CV",
        variant: "destructive"
      });
    }
  };
  const handleDownload = async (cv: CV) => {
    try {
      await exportCV(cv.sections, cv.template_id, 'pdf');
      toast({
        title: "Success",
        description: "CV exported successfully"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to export CV",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your CVs</h1>
        <Button 
          onClick={() => router.push('/cv/create')}
          className="bg-primary hover:bg-primary/90"
        >
          Create New CV
        </Button>
      </div>
  
      {loading && <p>Loading your CVs...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && (
       <CVGrid
        cvs={cvs}
        onEdit={handleEdit}
        onPreview={handlePreview}
        onDownload={handleDownload}
        onDelete={handleDelete}
     />
      )}
  
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogTitle>CV Preview</DialogTitle>
          <iframe
            srcDoc={previewHtml}
            className="w-full h-full"
            title="CV Preview"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CVPage;