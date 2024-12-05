'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // For navigation
import axios, { deleteCV, getUserCVs } from "../../../lib/api-client";
import CVGrid from "../../../components/CVGrid";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://cv-builder-backend-production.up.railway.app'; 

// Define the expected CV structure
interface CV {
  id: string;
  title: string;
  status: "published" | "draft";
  previewImageUrl: string;
  createdAt: string;
  updatedAt: string;
}


const CVPage = () => {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch CVs using the `getUserCVs` API function
    const fetchCVs = async () => {
      try {
        setLoading(true);
        const data = await getUserCVs(); // Fetch CVs
        setCvs(data); // Set CVs to the state
      } catch (err) {
        console.error("Failed to fetch CVs:", err);
        setError("Failed to fetch CVs. Please check your connection or login status.");
      } finally {
        setLoading(false);
      }
    };

    fetchCVs();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/app/cvs/edit/${id}`); // Navigate to the edit page
  };

  const handleDownload = (id: string) => {
    // Trigger download logic
    const url = `${API_BASE_URL}/api/cv/${id}`;
    window.open(url, "_blank");
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCV(id);
      // Remove the deleted CV from the state
      setCvs((prev) => prev.filter((cv) => cv.id !== id));
      toast({
        title: "Success",
        description: "CV deleted successfully"
      });
    } catch (err) {
      console.error("Failed to delete CV:", err);
      toast({
        title: "Error",
        description: "Failed to delete the CV. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="h-full p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">Your CVs</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && cvs.length === 0 && (
        <p>No CVs found. Create a new one to get started!</p>
      )}

      {!loading && !error && cvs.length > 0 && (
        <CVGrid cvs={cvs} onEdit={handleEdit} onDownload={handleDownload} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default CVPage;
