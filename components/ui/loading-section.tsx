// components/ui/loading-section.tsx
import { Loader2 } from "lucide-react";

export function LoadingSection() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}