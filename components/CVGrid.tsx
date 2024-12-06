// components/CVGrid.tsx
import React from "react";
import CVCard from "./CVCard";
import { File } from "lucide-react";

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
  
  interface CVGridProps {
    cvs: CV[];
    onEdit: (id: string) => void;
    onPreview: (cv: CV) => Promise<void>;
    onDownload: (cv: CV) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
  }

const CVGrid: React.FC<CVGridProps> = ({ 
  cvs, 
  onEdit, 
  onPreview,
  onDownload, 
  onDelete 
}) => {
  if (cvs.length === 0) {
    return (
      <div className="text-center py-12">
        <File className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No CVs Found</h3>
        <p className="text-gray-500">Create your first CV to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cvs.map((cv) => (
        <CVCard
          key={cv.id}
          cv={cv}
          onEdit={onEdit}
          onPreview={onPreview}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CVGrid;