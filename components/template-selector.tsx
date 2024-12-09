import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const TEMPLATES = [
  { id: 'classic', name: 'Classic' },
  { id: 'modern', name: 'Modern' },
  { id: 'professional', name: 'Professional' }
] as const;

interface TemplateSelectorProps {
  onTemplateChange: (template: string) => void;
}

export default function TemplateSelector({ onTemplateChange }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(() => 
    typeof window !== 'undefined' 
      ? localStorage.getItem('cv-template') || 'professional'
      : 'professional'
  );

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    localStorage.setItem('cv-template', template);
    onTemplateChange(template);
  };

  return (
    <div  className="w-full md:w-auto">
      
      <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select template" />
        </SelectTrigger>
        <SelectContent>
          {TEMPLATES.map(template => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center">
        <span className="text-sm font-bold text-muted-foreground">
            Current Template
        </span>
        </div>
    </div>
  );
}