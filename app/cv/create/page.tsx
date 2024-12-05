// frontend/app/cv/create/page.tsx
'use client'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Camera, GripVertical } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight 
} from "lucide-react"
import { CVStatus } from '@/lib/api-client';
import { MinimalTiptapEditor } from '@/components/minimal-tiptap'
import { previewCV, exportCV, saveCVDraft, createCV } from '@/lib/api-client'
import { useToast } from "@/hooks/use-toast"
import { 
  Dialog, 
  DialogContent, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Save } from "lucide-react"; // Optional icon
import { useRouter } from 'next/navigation'


interface ApiError {
  response?: {
    data?: {
      detail?: string;
    };
  };
}

interface Section {
    id: string
    title: string
    type: 'contact' | 'text' | 'experience' | 'education' | 'skills' | 'languages' | 'hobbies'
    content: any
    order: number
  }

interface Experience {
    id: string;
    company: string;
    position: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    current: boolean;
    description: string;
  }
interface Education {
    id: string;
    institution: string;
    degree: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    current: boolean;
    description: string;
  }
  interface Language {
    id: string;
    name: string;
    level: string;
  }

  // Types for validation
interface ContactContent {
  name: string;
  email: string;
  phone: string;
  location: string;
}

interface ValidationError {
  field: string;
  message: string;
}


// Validation function
const validateCV = (sections: any[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  sections.forEach((section) => {
    if (section.type === 'contact') {
      const content = section.content as ContactContent;
      if (!content.name.trim()) {
        errors.push({ field: 'name', message: 'Name is required' });
      }
      if (!content.email.trim()) {
        errors.push({ field: 'email', message: 'Email is required' });
      }
      if (!content.phone.trim()) {
        errors.push({ field: 'phone', message: 'Phone is required' });
      }
      if (!content.location.trim()) {
        errors.push({ field: 'location', message: 'Location is required' });
      }
    }

    // Add validation for other required fields
    if (section.type === 'text' && (!section.content || section.content.trim() === '')) {
      errors.push({ 
        field: section.title, 
        message: `${section.title} cannot be empty` 
      });
    }
  });

  return errors;
};

const CVForm = () => {
  
  const [sections, setSections] = useState<Section[]>([
    { 
      id: 'contact',
      title: 'Contact Information',
      type: 'contact',
      content: { name: '', email: '', phone: '', location: '' },
      order: 0
    },
    {
      id: 'profile',
      title: 'Profile Summary',
      type: 'text',
      content: '',
      order: 1
    },
    {
        id: 'experience',
        title: 'Work Experience',
        type: 'experience',
        content: [] as Experience[],
        order: 2
    },
    {
        id: 'education',
        title: 'Education',
        type: 'education',
        content: [{
          id: crypto.randomUUID(),
          institution: '',
          degree: '',
          startDate: undefined,
          endDate: undefined,
          current: false,
          description: ''
        }],
        order: 3
    },
    {
        id: 'skills',
        title: 'Skills',
        type: 'skills',
        content: '',
        order: 4
      },
      {
        id: 'languages',
        title: 'Languages',
        type: 'languages',
        content: [{
          id: crypto.randomUUID(),
          name: '',
          level: ''
        }],
        order: 5
      },
      {
        id: 'hobbies',
        title: 'Interests & Hobbies',
        type: 'hobbies',
        content: '',
        order: 6
      }
  ])
  const { toast } = useToast()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewHtml, setPreviewHtml] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [draggedSection, setDraggedSection] = useState<string | null>(null)
  const [lastSavedContent, setLastSavedContent] = useState<string>('');
  const router = useRouter();
  const isContentChanged = () => {
  const currentContent = JSON.stringify(sections);
  return currentContent !== lastSavedContent;
  };

  // Update lastSavedContent after successful save
  const afterSuccessfulSave = () => {
    setLastSavedContent(JSON.stringify(sections));
  };
  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedSection(sectionId)
    e.currentTarget.classList.add('opacity-50')
  }

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50')
    setDraggedSection(null)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    const draggingElement = sections.find(s => s.id === draggedSection)
    const targetElement = sections.find(s => s.id === e.currentTarget.id)
    
    if (draggingElement && targetElement && draggingElement.id !== targetElement.id) {
      const newSections = sections.map(section => {
        if (section.id === draggingElement.id) {
          return { ...section, order: targetElement.order }
        }
        if (section.id === targetElement.id) {
          return { ...section, order: draggingElement.order }
        }
        return section
      })
      
      setSections(newSections.sort((a, b) => a.order - b.order))
    }
  }
  const [cvId, setCvId] = useState<string | null>(null);
  const handleTitleEdit = (id: string, newTitle: string) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, title: newTitle } : section
    ))
  }

  const handleContentChange = (id: string, value: string | object) => {
    setSections(prev => prev.map(section =>
      section.id === id ? { ...section, content: value } : section
    ))
  }
  const handlePreview = async () => {
    try {
      // Check validation before preview
      const validationErrors = validateCV(sections);
      if (validationErrors.length > 0) {
        const errorMessages = validationErrors.map(err => `${err.field}: ${err.message}`);
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields before previewing",
          variant: "destructive"
        });
        return;
      }
  
      setIsLoading(true);
      console.log('Starting preview with sections:', sections);
      const html = await previewCV(sections, 'professional');
      setPreviewHtml(html);
      setPreviewOpen(true);
    } catch (error: any) {
      console.error('Preview error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to generate preview",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const handleExport = async (format: 'pdf' | 'docx') => {
    try {
      // Check validation before exporting
      const validationErrors = validateCV(sections);
      if (validationErrors.length > 0) {
        const errorMessages = validationErrors.map(err => `${err.field}: ${err.message}`);
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields before exporting",
          variant: "destructive"
        });
        return;
      }
  
      setIsLoading(true);
      console.log(`Starting ${format} export with sections:`, sections);
      await exportCV(sections, 'professional', format);
      console.log('Export completed');
      toast({
        title: "Export Successful",
        description: `Your CV has been exported as ${format.toUpperCase()}`
      });
    } catch (error: any) {
      console.error('Export error:', error);
      const errorMessage = error.response?.data?.detail || error.message || "Operation failed";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateCV = async () => {
    if (!cvId) {  // Only create if no cvId exists
      try {
        setIsLoading(true);
        const formattedSections = sections.map((section, index) => ({
          type: section.type,
          title: section.title,
          content: section.content,
          order_index: index
        }));
  
        const response = await createCV('professional', formattedSections);
        if (response?.id) {
          setCvId(response.id);
        }
      } catch (error: any) {
        console.error('Create CV error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
  }, []); // Check auth once on mount

  // Separate effect for CV creation
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token && !cvId) {
      handleCreateCV();
    }
  }, [cvId]); // Only run when cvId changes
  
  const handleSaveDraft = async (status: CVStatus) => {
    if (!cvId) {
      console.log('No CV ID found, creating new CV...');
      await handleCreateCV();
      if (!cvId) {
        console.error('Failed to create CV ID');
        toast({
          title: "Error",
          description: "No CV created yet",
          variant: "destructive"
        });
        return;
      }
    }

    try {
      setIsLoading(true);
      // Validate before saving
      const validationErrors = validateCV(sections);
      if (validationErrors.length > 0) {
        const errorMessages = validationErrors.map(err => `${err.field}: ${err.message}`);
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      // Check if there are actual changes to save
      if (cvId && isContentChanged()) {  // You'll need to implement isContentChanged logic
        console.log('Saving draft for CV ID:', cvId, 'with sections:', sections);
        console.log(`Saving CV with status: ${status}`);
        await saveCVDraft(cvId!, sections, 'professional', status);
        afterSuccessfulSave();  
        console.log('Draft saved successfully');
        toast({
          title: "Success",
          description: `CV ${status === CVStatus.DRAFT ? 'saved as draft' : 'published'} successfully`
        });
      } else {
        console.log('No changes detected, skipping save');
        toast({
          title: "Info",
          description: "No changes to save"
        });
      }
    } catch (error: any) {
      console.error('Save draft error:', error);
      toast({
        title: "Save Failed",
        description: error.response?.data?.detail || error.message || "Could not save CV draft",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Effect to create CV on component mount
  useEffect(() => {
    console.log('Component mounted, creating initial CV...');
    handleCreateCV();
  }, []);

  const formatText = (command: string) => {
    document.execCommand(command, false)
  }
 // Experience section JSX
 const ExperienceSection = ({ section }: { section: Section }) => (
    <div className="space-y-6">
      {(section.content as Experience[]).map((exp: Experience, index: number) => (
        <div key={exp.id} className="relative p-4 border rounded-lg">
          {/* Company Name */}
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input
                value={exp.company}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setSections(prev => prev.map(section => 
                    section.id === section.id 
                        ? {
                            ...section,
                            content: section.content.map((item: Experience) =>
                            item.id === exp.id ? { ...item, company: e.target.value } : item
                            )
                        }
                        : section
                    ))
                }}
                className="font-bold text-xl"
                placeholder="Enter company name"
                />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !exp.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {exp.startDate ? format(exp.startDate, "MMM yyyy") : <span>Start date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={exp.startDate}
                    onSelect={(date: Date | undefined) => {
                      setSections(prev => prev.map(s => 
                        s.id === section.id 
                          ? {
                              ...s,
                              content: (s.content as Experience[]).map((e: Experience) =>
                                e.id === exp.id ? { ...e, startDate: date } : e
                              )
                            }
                          : s
                      ))
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !exp.endDate && "text-muted-foreground"
                    )}
                    disabled={exp.current}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {exp.current 
                      ? <span>Present</span> 
                      : exp.endDate 
                        ? format(exp.endDate, "MMM yyyy") 
                        : <span>End date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={exp.endDate}
                    onSelect={(date: Date | undefined) => {
                      setSections(prev => prev.map(s => 
                        s.id === section.id 
                          ? {
                              ...s,
                              content: (s.content as Experience[]).map((e: Experience) =>
                                e.id === exp.id ? { ...e, endDate: date } : e
                              )
                            }
                          : s
                      ))
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Current Position Checkbox */}
         {/* Current Position Toggle */}
            <div className="flex items-center space-x-2">
            <Checkbox
                id={`current-${exp.id}`}
                checked={exp.current}
                onCheckedChange={(checked: boolean) => {
                setSections(prev => prev.map(s => 
                    s.id === section.id 
                    ? {
                        ...s,
                        content: s.content.map((item: Experience) =>
                            item.id === exp.id 
                            ? { ...item, current: checked, endDate: checked ? undefined : item.endDate }
                            : item
                        )
                        }
                    : s
                ))
                }}
            />
            <Label htmlFor={`current-${exp.id}`}>Current Position</Label>
            </div>

          {/* Description */}
          <div className="space-y-2 mt-4">
            <Label>Description</Label>
            <div
              contentEditable
              className="min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              dangerouslySetInnerHTML={{ __html: exp.description }}
              onInput={(e) => {
                setSections(prev => prev.map(s => 
                  s.id === section.id 
                    ? {
                        ...s,
                        content: (s.content as Experience[]).map((ex: Experience) =>
                          ex.id === exp.id 
                            ? { ...ex, description: e.currentTarget.innerHTML }
                            : ex
                        )
                      }
                    : s
                ))
              }}
            />
          </div>
        </div>
      ))}

      {/* Add Experience Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full mt-4"
        onClick={() => {
          setSections(prev => prev.map(s => 
            s.id === section.id 
              ? {
                  ...s,
                  content: [
                    ...(s.content as Experience[]),
                    {
                      id: crypto.randomUUID(),
                      company: '',
                      position: '',
                      startDate: undefined,
                      endDate: undefined,
                      current: false,
                      description: ''
                    }
                  ]
                }
              : s
          ))
        }}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Experience
      </Button>
    </div>
  )

  return (
    <div className="h-full p-6 overflow-y-auto">
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Your CV</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content takes 3 columns */}
          <div className="lg:col-span-3 order-2 lg:order-1 space-y-6">
            {sections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                draggable
                onDragStart={(e) => handleDragStart(e, section.id)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                className="border border-transparent hover:border-gray-200 rounded-lg p-4 cursor-move"
              >
                  {/* Section Title with Drag Handle */}
                  <div className="flex items-center gap-2 mb-4">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                    <Input
                      value={section.title}
                      onChange={(e) => handleTitleEdit(section.id, e.target.value)}
                      className="text-lg font-semibold"
                    />
                  </div>

                  {/* Contact Information Section */}
                  {section.type === 'contact' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Required Fields */}
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          placeholder="Full Name"
                          value={section.content.name}
                          onChange={(e) => handleContentChange(section.id, { 
                            ...section.content, 
                            name: e.target.value 
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          placeholder="Email"
                          value={section.content.email}
                          onChange={(e) => handleContentChange(section.id, {
                            ...section.content,
                            email: e.target.value
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          placeholder="Phone"
                          value={section.content.phone}
                          onChange={(e) => handleContentChange(section.id, {
                            ...section.content,
                            phone: e.target.value
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          placeholder="Location"
                          value={section.content.location}
                          onChange={(e) => handleContentChange(section.id, {
                            ...section.content,
                            location: e.target.value
                          })}
                        />
                      </div>
                      
                      {/* Optional Fields */}
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn (Optional)</Label>
                        <Input
                          id="linkedin"
                          placeholder="LinkedIn URL"
                          value={section.content.linkedin}
                          onChange={(e) => handleContentChange(section.id, {
                            ...section.content,
                            linkedin: e.target.value
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub (Optional)</Label>
                        <Input
                          id="github"
                          placeholder="GitHub URL"
                          value={section.content.github}
                          onChange={(e) => handleContentChange(section.id, {
                            ...section.content,
                            github: e.target.value
                          })}
                        />
                      </div>
                    </div>
                  )}

                  {/* Profile Summary Section */}
                  {section.type === 'text' && (
                    <div className="space-y-2">
                      <Label htmlFor="profile">Professional Summary</Label>
                      <Textarea
                        id="profile"
                        value={section.content}
                        onChange={(e) => handleContentChange(section.id, e.target.value)}
                        className="min-h-[200px]"
                        placeholder="Write a brief professional summary..."
                      />
                    </div>
                  )}

                  {/* Other sections will be added here */}
                
                  {section.type === 'experience' && (
                    <div className="space-y-6">
                    {/* Existing experiences */}
                    {section.content.map((exp: Experience, index: number) => (
                        <div key={exp.id} className="relative p-4 border rounded-lg space-y-4">
                        {/* Delete button for experiences except the first one */}
                        {index > 0 && (
                            <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2"
                            onClick={() => {
                                setSections(prev => prev.map(s => 
                                s.id === section.id 
                                    ? { ...s, content: s.content.filter((e: Experience) => e.id !== exp.id) }
                                    : s
                                ))
                            }}
                            >
                            <X className="h-4 w-4" />
                            </Button>
                        )}

                        {/* Company Name */}
                        <div className="space-y-2">
                            <Label>Company Name</Label>
                            <Input
                            value={exp.company}
                            onChange={(e) => {
                                setSections(prev => prev.map(s => 
                                    s.id === section.id 
                                    ? {
                                        ...s,
                                        content: s.content.map((item: Experience) =>
                                            item.id === exp.id ? { ...item, company: e.target.value } : item
                                        )
                                        }
                                    : s
                                ))
                                
                            }}
                            className="font-bold text-xl"
                            placeholder="Enter company name"
                            />
                        </div>

                        {/* Position */}
                        <div className="space-y-2">
                            <Label>Position</Label>
                            <Input
                            value={exp.position}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setSections(prev => prev.map(s => 
                                    s.id === section.id 
                                    ? {
                                        ...s,
                                        content: s.content.map((item: Experience) =>
                                            item.id === exp.id ? { ...item, position: e.target.value } : item
                                        )
                                        }
                                    : s
                                ))
                                }}
                            className="font-semibold text-lg"
                            placeholder="Enter your position"
                            />
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !exp.startDate && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {exp.startDate ? format(exp.startDate, "MMM yyyy") : <span>Select date</span>}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={exp.startDate}
                                    onSelect={(date) => {
                                    setSections(prev => prev.map(s => 
                                        s.id === section.id 
                                        ? {
                                            ...s,
                                            content: s.content.map((e: Experience) =>
                                                e.id === exp.id ? { ...e, startDate: date } : e
                                            )
                                            }
                                        : s
                                    ))
                                    }}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            </div>

                            <div className="space-y-2">
                            <Label>End Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !exp.endDate && "text-muted-foreground"
                                    )}
                                    disabled={exp.current}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {exp.current 
                                    ? "Present" 
                                    : exp.endDate 
                                        ? format(exp.endDate, "MMM yyyy") 
                                        : <span>Select date</span>
                                    }
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={exp.endDate}
                                    onSelect={(date) => {
                                    setSections(prev => prev.map(s => 
                                        s.id === section.id 
                                        ? {
                                            ...s,
                                            content: s.content.map((e: Experience) =>
                                                e.id === exp.id ? { ...e, endDate: date } : e
                                            )
                                            }
                                        : s
                                    ))
                                    }}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            </div>
                        </div>

                        {/* Current Position Toggle */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                            id={`current-${exp.id}`}
                            checked={exp.current}
                            onCheckedChange={(checked) => {
                                setSections(prev => prev.map(s => 
                                s.id === section.id 
                                    ? {
                                        ...s,
                                        content: s.content.map((e: Experience) =>
                                        e.id === exp.id 
                                            ? { ...e, current: checked as boolean, endDate: checked ? undefined : e.endDate }
                                            : e
                                        )
                                    }
                                    : s
                                ))
                            }}
                            />
                            <Label htmlFor={`current-${exp.id}`}>Current Position</Label>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <MinimalTiptapEditor
                                value={exp.description}
                                onChange={(newContent) => {
                                setSections(prev => prev.map(s => 
                                    s.id === section.id 
                                    ? {
                                        ...s,
                                        content: s.content.map((item: Experience) =>
                                            item.id === exp.id ? { ...item, description: newContent } : item
                                        )
                                        }
                                    : s
                                ))
                                }}
                                placeholder="Describe your key responsibilities and achievements..."
                                editorContentClassName="p-3"
                                className="min-h-[200px]"
                            />
                            </div>
                        </div>
                    ))}

                    {/* Add Experience Button */}
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                        setSections(prev => prev.map(s => 
                            s.id === section.id 
                            ? {
                                ...s,
                                content: [
                                    ...s.content,
                                    {
                                    id: crypto.randomUUID(),
                                    company: '',
                                    position: '',
                                    startDate: undefined,
                                    endDate: undefined,
                                    current: false,
                                    description: ''
                                    }
                                ]
                                }
                            : s
                        ))
                        }}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Experience
                    </Button>
                    </div>
                    )}
                    {section.type === 'education' && (
  <div className="space-y-6">
    {section.content.map((edu: Education, index: number) => (
      <div key={edu.id} className="relative p-4 border rounded-lg space-y-4">
        {/* Delete button for education entries except first */}
        {index > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={() => {
              setSections(prev => prev.map(s => 
                s.id === section.id 
                  ? { ...s, content: s.content.filter((e: Education) => e.id !== edu.id) }
                  : s
              ))
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {/* Institution Name */}
        <div className="space-y-2">
          <Label>Institution Name</Label>
          <Input
            value={edu.institution}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSections(prev => prev.map(s => 
                s.id === section.id 
                  ? {
                      ...s,
                      content: s.content.map((item: Education) =>
                        item.id === edu.id ? { ...item, institution: e.target.value } : item
                      )
                    }
                  : s
              ))
            }}
            className="font-bold text-xl"
            placeholder="Enter institution name"
          />
        </div>

        {/* Degree */}
        <div className="space-y-2">
          <Label>Degree</Label>
          <Input
            value={edu.degree}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSections(prev => prev.map(s => 
                s.id === section.id 
                  ? {
                      ...s,
                      content: s.content.map((item: Education) =>
                        item.id === edu.id ? { ...item, degree: e.target.value } : item
                      )
                    }
                  : s
              ))
            }}
            className="font-semibold text-lg"
            placeholder="Enter degree name"
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !edu.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {edu.startDate ? format(edu.startDate, "MMM yyyy") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={edu.startDate}
                  onSelect={(date) => {
                    setSections(prev => prev.map(s => 
                      s.id === section.id 
                        ? {
                            ...s,
                            content: s.content.map((item: Education) =>
                              item.id === edu.id ? { ...item, startDate: date } : item
                            )
                          }
                        : s
                    ))
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !edu.endDate && "text-muted-foreground"
                  )}
                  disabled={edu.current}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {edu.current 
                    ? "Present" 
                    : edu.endDate 
                      ? format(edu.endDate, "MMM yyyy") 
                      : <span>Select date</span>
                  }
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={edu.endDate}
                  onSelect={(date) => {
                    setSections(prev => prev.map(s => 
                      s.id === section.id 
                        ? {
                            ...s,
                            content: s.content.map((item: Education) =>
                              item.id === edu.id ? { ...item, endDate: date } : item
                            )
                          }
                        : s
                    ))
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Current Education Toggle */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`current-${edu.id}`}
            checked={edu.current}
            onCheckedChange={(checked: boolean) => {
              setSections(prev => prev.map(s => 
                s.id === section.id 
                  ? {
                      ...s,
                      content: s.content.map((item: Education) =>
                        item.id === edu.id 
                          ? { ...item, current: checked, endDate: checked ? undefined : item.endDate }
                          : item
                      )
                    }
                  : s
              ))
            }}
          />
          <Label htmlFor={`current-${edu.id}`}>Currently Studying</Label>
        </div>

        {/* Description */}
        <div className="space-y-2">
            <Label>Description</Label>
            <MinimalTiptapEditor
                value={edu.description}
                onChange={(newContent) => {
                setSections(prev => prev.map(s => 
                    s.id === section.id 
                    ? {
                        ...s,
                        content: s.content.map((item: Education) =>
                            item.id === edu.id ? { ...item, description: newContent } : item
                        )
                        }
                    : s
                ))
                }}
                placeholder="Describe your courses, projects, achievements..."
                editorContentClassName="p-3"
                className="min-h-[200px]"
            />
            </div>
      </div>
    ))}

    {/* Add Education Button */}
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => {
        setSections(prev => prev.map(s => 
          s.id === section.id 
            ? {
                ...s,
                content: [
                  ...s.content,
                  {
                    id: crypto.randomUUID(),
                    institution: '',
                    degree: '',
                    startDate: undefined,
                    endDate: undefined,
                    current: false,
                    description: ''
                  }
                ]
              }
            : s
        ))
      }}
    >
      <Plus className="h-4 w-4 mr-2" />
      Add Education
    </Button>
  </div>
)}
{section.type === 'skills' && (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label>Skills</Label>
      <p className="text-sm text-muted-foreground">
        Organize your skills using headings, lists, and sections. Feel free to use the formatting tools to structure your content.
      </p>
      <MinimalTiptapEditor
        value={section.content}
        onChange={(newContent) => {
          setSections(prev => prev.map(s => 
            s.id === section.id ? { ...s, content: newContent } : s
          ))
        }}
        placeholder={`Example structure:
Technical Skills:
• Frontend: React, TypeScript, Next.js
• Backend: Node.js, Python, PostgreSQL
• Tools: Git, Docker, AWS
Soft Skills:
• Team Leadership
• Project Management
• Problem Solving`}
        editorContentClassName="p-4"
        className="min-h-[300px]"
      />
    </div>
  </div>
)}

{section.type === 'languages' && (
  <div className="space-y-4">
    <div className="space-y-2">
      {section.content.map((lang: Language, index: number) => (
        <div 
          key={lang.id} 
          className="flex items-center justify-center gap-4 group relative"
        >
          <div className="w-[300px]">
            <Input
              value={lang.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSections(prev => prev.map(s => 
                  s.id === section.id 
                    ? {
                        ...s,
                        content: s.content.map((item: Language, i: number) =>
                          i === index ? { ...item, name: e.target.value } : item
                        )
                      }
                    : s
                ))
              }}
              placeholder="Language (e.g., English)"
            />
          </div>

          <div className="w-[300px]">
            <Input
              value={lang.level}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSections(prev => prev.map(s => 
                  s.id === section.id 
                    ? {
                        ...s,
                        content: s.content.map((item: Language, i: number) =>
                          i === index ? { ...item, level: e.target.value } : item
                        )
                      }
                    : s
                ))
              }}
              placeholder="e.g., B2"
            />
          </div>

          {/* Delete button */}
          {index > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => {
                setSections(prev => prev.map(s => 
                  s.id === section.id 
                    ? { 
                        ...s, 
                        content: s.content.filter((_: any, i: number) => i !== index) 
                      }
                    : s
                ))
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}

      {/* Add Language Button */}
      <div className="flex justify-center mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setSections(prev => prev.map(s => 
              s.id === section.id 
                ? {
                    ...s,
                    content: [
                      ...s.content,
                      {
                        id: crypto.randomUUID(),
                        name: '',
                        level: ''
                      }
                    ]
                  }
                : s
            ))
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Language
        </Button>
      </div>
    </div>
  </div>
)}
{section.type === 'hobbies' && (
  <div className="space-y-4">
    <div className="space-y-2">
      <MinimalTiptapEditor
        value={section.content}
        onChange={(newContent) => {
          setSections(prev => prev.map(s => 
            s.id === section.id ? { ...s, content: newContent } : s
          ))
        }}
        placeholder={`Examples:
• Playing chess and participating in local tournaments
• Photography and digital art creation
• Learning new programming languages and contributing to open-source projects
• Playing basketball and volleyball
• Reading science fiction and historical novels
• Hiking and outdoor adventures`}
        editorContentClassName="p-4"
        className="min-h-[300px]"
      />
    </div>
  </div>
)}
                </div>
              ))}
            
            <div className="flex justify-end gap-4 mt-8">
              {/* Validation Feedback */}
            {(() => {
              const errors = validateCV(sections);
              return errors.length > 0 && (
                <div className="bg-red-50 p-4 rounded-md mt-4 w-full mb-4">
                  <h3 className="text-red-800 font-medium">Please fill in required fields:</h3>
                  <ul className="list-disc pl-5 mt-2 text-red-700">
                    {errors.map((error, index) => (
                      <li key={index}>{error.message}</li>
                    ))}
                  </ul>
                </div>
              );
            })()}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  disabled={isLoading || validateCV(sections).length > 0}
                  className="w-[150px]"
                >
                  {isLoading ? (
                    "Saving..."
                  ) : validateCV(sections).length > 0 ? (
                    "Fill Required Fields"
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save CV
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="text-blue-600 focus:text-blue-600 focus:bg-blue-50"
                  onClick={() => handleSaveDraft(CVStatus.PUBLISHED)}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Publish CV
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleSaveDraft(CVStatus.DRAFT)}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              onClick={handlePreview}
              disabled={isLoading || validateCV(sections).length > 0}
            >
              {isLoading ? "Loading..." : "Preview CV"}
            </Button>
            <Button 
              onClick={() => handleExport('pdf')}
              disabled={isLoading || validateCV(sections).length > 0}
            >
              Export PDF
            </Button>
            <Button 
              onClick={() => handleExport('docx')}
              disabled={isLoading || validateCV(sections).length > 0}
            >
              Export Word
            </Button>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
  <DialogContent className="max-w-4xl h-[80vh]">
    <DialogTitle className="sr-only">CV Preview</DialogTitle>
    <iframe
      srcDoc={previewHtml}
      className="w-full h-full"
      title="CV Preview"
    />
  </DialogContent>
</Dialog>
         
            </div>
            {/* Photo Upload - Now spans 1 column and comes second */}
            <div className="lg:col-span-1 order-1 lg:order-2">
      <div className="sticky top-6 flex flex-col items-center">
        <div className="w-48 h-48 bg-secondary rounded-full flex items-center justify-center mb-4">
          <Camera className="h-8 w-8" />
        </div>
        <Button>Upload Photo</Button>
      </div>
    </div>
          </div>
        </CardContent>
      </Card>
    </div>
    
  )
}

export default CVForm