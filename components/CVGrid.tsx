// components/CVGrid.tsx
import React from "react";
import CVCard from "./CVCard";

interface CV {
    id: string;
    title: string;
    status: "published" | "draft";
    previewImageUrl: string;
    createdAt: string;
    updatedAt: string;
  }
  
interface CVGridProps {
  cvs: CV[];
  onEdit: (id: string) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
}

const CVGrid: React.FC<CVGridProps> = ({ cvs, onEdit, onDownload, onDelete }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cvs.map((cv) => (
        <CVCard
          key={cv.id}
          cv={cv}
          onEdit={onEdit}
          onDownload={onDownload}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CVGrid;
