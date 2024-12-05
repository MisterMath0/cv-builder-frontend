// components/CVCard.tsx
import React from "react";
import { motion } from "framer-motion";
import CVActions from "./CVActions";

interface CV {
    id: string;
    title: string;
    status: "published" | "draft";
    previewImageUrl: string;
    createdAt: string;
    updatedAt: string;
  }
  
interface CVCardProps {
  cv: CV;
  onEdit: (id: string) => void;
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
}

const CVCard: React.FC<CVCardProps> = ({ cv, onEdit, onDownload, onDelete }) => {
  return (
    <motion.div
      className="bg-white rounded-md shadow-md p-4 hover:shadow-lg transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h3 className="text-lg font-semibold">{cv.title}</h3>
      <p className="text-sm text-gray-500 mb-2">Status: {cv.status}</p>
      <img
        src={cv.previewImageUrl}
        alt={`Preview of ${cv.title}`}
        className="w-full h-32 object-cover rounded-md mb-4"
      />
      <CVActions cv={cv} onEdit={onEdit} onDownload={onDownload} onDelete={onDelete} />
    </motion.div>
  );
};

export default CVCard;
