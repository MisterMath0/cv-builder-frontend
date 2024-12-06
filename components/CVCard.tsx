import React from "react";
import { motion } from "framer-motion";
import { Eye, Download, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  interface CVCardProps {
    cv: CV;
    onEdit: (id: string) => void;
    onPreview: (cv: CV) => Promise<void>;
    onDownload: (cv: CV) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
  }

const CVCard: React.FC<CVCardProps> = ({ cv, onEdit, onPreview, onDownload, onDelete }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold truncate">{cv.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            cv.status === 'published' 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-amber-100 text-amber-700 border border-amber-200'
          }`}>
            {cv.status.charAt(0).toUpperCase() + cv.status.slice(1)}
          </span>
        </div>

        <div className="relative aspect-[3/4] mb-4 rounded-md overflow-hidden bg-gray-100">
          {cv.previewImageUrl ? (
            <img
              src={cv.previewImageUrl}
              alt={`Preview of ${cv.title}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No preview available
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500 mb-4">
          Last updated: {new Date(cv.updated_at).toLocaleDateString()}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(cv.id)}
            className="w-full"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPreview(cv)}
            className="w-full"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onDownload(cv)}
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(cv.id)}
            className="w-full"
          >
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CVCard;