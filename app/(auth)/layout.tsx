'use client';

import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import "@/app/globals.css"; // Ensure global styles are applied
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipLoader } from "react-spinners";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      // If token is found, redirect to /cv/create
      router.push("/cv/create");
    } else {
      setIsAuthenticated(true); // If no token, allow to show the layout
    }
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <ClipLoader size={50} color="#4b5563" />
      </div>
    );
  }

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
