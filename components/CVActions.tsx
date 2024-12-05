// components/CVActions.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash, Edit, Download } from "lucide-react";

interface CV {
    id: string;
    title: string;
    status: "published" | "draft";
    previewImageUrl: string;
    createdAt: string;
    updatedAt: string;
  }
  
interface CVActionsProps {
  cv: CV;
  onEdit: (id: string) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
}

const CVActions: React.FC<CVActionsProps> = ({ cv, onEdit, onDownload, onDelete }) => {
  return (
    <div className="flex gap-2">
      <Button onClick={() => onEdit(cv.id)} variant="outline" className="gap-2">
        <Edit className="w-4 h-4" />
        Edit
      </Button>
      <Button onClick={() => onDownload(cv.id)} variant="outline" className="gap-2">
        <Download className="w-4 h-4" />
        Download
      </Button>
      <Button onClick={() => onDelete(cv.id)} variant="outline" className="gap-2 text-red-500">
        <Trash className="w-4 h-4" />
        Delete
      </Button>
    </div>
  );
};

export default CVActions;
