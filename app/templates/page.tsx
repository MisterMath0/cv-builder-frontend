'use client';
import CTASection from "@/components/home/cta-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

export default function TemplatesPage() {
  return (
    <div className="flex flex-col min-h-screen">
    <div className="container mx-auto py-8 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold">CV Templates 2025 - Professional Resume Formats</h1>
        <p className="text-muted-foreground">
          Choose from our professional templates to create your standout CV quickly and easily.
        </p>
      </div>

     {/* Template Examples Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
        {['classic', 'modern', 'professional'].map((template) => (
            <Card key={template} className="overflow-hidden">
            <CardContent className="p-1">
                <div className="aspect-[4/4] relative bg-muted">
                <img
                    src="/api/placeholder/400/533"
                    alt={`${template} CV template`}
                    className="w-full h-full object-cover"
                />
                </div>
                <div className="p-4 text-center">
                <h3 className="font-semibold capitalize mb-2">{template} Template</h3>
                <Link 
                    href="/cv/create" 
                    onClick={() => {
                        localStorage.setItem('cv-template', template);
                        toast({
                        title: "Template Selected",
                        description: `${template.charAt(0).toUpperCase() + template.slice(1)} template will be used`,
                        duration: 2000
                        });
                    }}
                    >
                    <Button>Use This Template</Button>
                    </Link>
                </div>
            </CardContent>
            </Card>
        ))}
        </div>

      {/* How It Works */}
      <div className="bg-muted rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">How to Create Your CV</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <h3 className="font-semibold">1. Choose a CV template</h3>
            <p className="text-sm text-muted-foreground">
              Select from our professionally designed templates that match your style and industry.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">2. Edit the content</h3>
            <p className="text-sm text-muted-foreground">
              Fill in your information using our intuitive editor. All sections are clearly organized.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">3. Download & Submit</h3>
            <p className="text-sm text-muted-foreground">
              Export your CV in PDF or DOCX format, ready to submit to employers.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Why Choose Our CV Builder</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Quick and easy to edit</h3>
            <p className="text-sm text-muted-foreground">
              Our templates use clearly organized sections and fields, making it simple to input and format your information.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Professional design standards</h3>
            <p className="text-sm text-muted-foreground">
              Templates are designed to highlight relevant information effectively while maintaining a clean, professional look.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">ATS-friendly formats</h3>
            <p className="text-sm text-muted-foreground">
              Our templates are optimized for Applicant Tracking Systems, ensuring your CV gets past automated screenings.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Multiple export options</h3>
            <p className="text-sm text-muted-foreground">
              Download your CV in PDF or Word format, perfect for both digital applications and printing.
            </p>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-muted rounded-lg p-8 mt-12">
        <h2 className="text-2xl font-bold mb-6">CV Writing Tips</h2>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            • Keep your CV concise - recruiters typically spend only 10 seconds reviewing each CV initially.
          </p>
          <p className="text-sm text-muted-foreground">
            • Include a professional photo - applications with photos often receive more attention from recruiters.
          </p>
          <p className="text-sm text-muted-foreground">
            • Customize for each job - adapt your CV to match the specific requirements in the job description.
          </p>
          <p className="text-sm text-muted-foreground">
            • Highlight achievements - use specific examples and metrics to demonstrate your impact.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Ready to Create Your Professional CV?</h2>
        <Link href="/cv/create">
          <Button size="lg">
            Create Your CV Now
          </Button>
        </Link>
      </div>
      
    </div>
    <CTASection />
    </div>
  );
}