// components/cover-letter/CreditsDisplay.tsx
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function CreditsDisplay() {
  return (
    <div className="flex justify-end mb-4">
      <Card className="w-fit">
        <CardContent className="py-2 px-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>10 credits remaining</span>
        </CardContent>
      </Card>
    </div>
  );
}