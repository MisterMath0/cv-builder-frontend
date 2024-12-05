// app/(auth)/login/page.tsx
"use client";
import { setCookie } from 'nookies';
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
// Validation schema
const loginSchema = z.object({
  email: z.string()
    .email({ message: "Please enter a valid email address" }),
  password: z.string()
    .min(1, { message: "Password is required" })
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const { setAuth, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/cv/create");
    }
    
  }, [isAuthenticated, router]);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await loginUser(data);
  
      // Successful login: store token, update state, and redirect
      localStorage.setItem("access_token", res.data.access_token);
      setAuth(res.data.user);
      setCookie({ res }, 'acess_token', res.data.access_token, {
        maxAge: 30 * 24 * 60 * 60, // Cookie expiry time (30 days)
        path: '/', // Make cookie accessible across the entire domain
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Use Secure cookie in production (only sent over HTTPS)
        sameSite: 'Strict', // Protects against CSRF attacks
      });
      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
        duration: 1000,
      });
  
      router.push("/cv/create"); // Redirect to CV creation page
    } catch (err: any) {
      const errorDetail = err.response?.data?.detail || "An unexpected error occurred";
  
      // Handle specific errors and display them below the form
      if (errorDetail === "Please verify your email first") {
        router.push(`/unverified?email=${encodeURIComponent(data.email)}`); // Redirect for unverified email
      } else {
        form.setError("email", { message: errorDetail }); // Show the error below the form field
      }
  
      toast({
        title: "Login failed",
        description: errorDetail,
        variant: "destructive",
        duration: 5000,
      });
    }
  };
  
  
  
  if (isAuthenticated) {
    return null; // or a loading spinner
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-gray-500">
          Sign in to your CV Builder account
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="your@email.com" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="*********"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-right">
            <Link 
              href="/forgot-password" 
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>

      <div className="text-center space-y-4">
        <div className="text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Create one here
          </Link>
        </div>

        {/* Optional: Social Login Buttons */}
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" type="button" disabled>
              {/* Add Google Icon */}
              Google
            </Button>
            <Button variant="outline" type="button" disabled>
              {/* Add GitHub Icon */}
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}