// components/cover-letter/CoverLetterHeader.tsx
import { motion } from "framer-motion";

export function CoverLetterHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h1 className="text-3xl font-bold mb-2">AI Cover Letter Writer</h1>
      <p className="text-muted-foreground">
        Create personalized cover letters using AI that matches your CV with the job requirements.
      </p>
    </motion.div>
  );
}