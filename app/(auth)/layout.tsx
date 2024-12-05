import React, { Suspense } from "react";
import { cn } from "@/lib/utils";
import "@/app/globals.css"; // Ensure global styles are applied
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Suspense>
    <div className={cn("min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900 p-4")}>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <img src="/favicon.ico" alt="Logo" className="w-20 h-20 mx-auto mb-2" />
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">SMART CV BUILDER</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
    </Suspense>
  );
};

export default AuthLayout;
