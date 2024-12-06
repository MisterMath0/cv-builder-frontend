// app/cv/create/page.tsx
'use client';

import  CVForm  from '@/components/CVForm';

export default function CreateCVPage() {
  return <CVForm isEditing={false} />;
}