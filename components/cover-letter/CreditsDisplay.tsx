// @/components/cover-letter/CreditsDisplay.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface CreditsDisplayProps {
  credits: number;
}

export function CreditsDisplay({ credits }: CreditsDisplayProps) {
  return (
    <div className="flex justify-end mb-4">
      <Card className="w-fit">
        <CardContent className="py-2 px-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>{credits} credits remaining</span>
        </CardContent>
      </Card>
    </div>
  );
}