// app/ai-writer/page.tsx
'use client';

import { Suspense } from 'react';
import CoverLetterBuilder from '@/components/cover-letter/CoverLetterBuilder';
import { Toaster } from "@/components/ui/sonner";
import { LoadingSection } from '@/components/ui/loading-section';

export default function AIWriter() {
  return (
    <>
      {/* Add global toast notifications */}
      <Toaster />
      
      {/* Main content with loading fallback */}
      <Suspense fallback={<LoadingSection />}>
        <main className="min-h-screen bg-background">
          <CoverLetterBuilder />
        </main>
      </Suspense>
    </>
  );
}