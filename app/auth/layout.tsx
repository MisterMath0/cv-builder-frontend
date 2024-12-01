import React from "react";
import { cn } from "@/lib/utils";
import "@/app/globals.css"; // Ensure global styles are applied
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={cn("min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900 p-4")}>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <img src="/favicon.ico" alt="Logo" className="w-12 h-12 mx-auto mb-2" />
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">Welcome</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};

export default AuthLayout;
