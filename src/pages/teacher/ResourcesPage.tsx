import React, { useState } from 'react';
import {
  Upload,
  Download,
  Trash2,
  Search,
  Filter,
  FolderOpen,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Plus,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'video' | 'document' | 'audio';
  subject: string;
  class: string;
  size: string;
  uploadedDate: string;
  downloads: number;
}

const mockResources: Resource[] = [
  {
    id: '1',
    name: 'Quadratic Equations Worksheet',
    type: 'pdf',
    subject: 'Mathematics',
    class: 'Form 3A',
    size: '2.3 MB',
    uploadedDate: '2024-04-20',
    downloads: 45,
  },
  {
    id: '2',
    name: 'Newton\'s Laws Presentation',
    type: 'document',
    subject: 'Physics',
    class: 'Form 4A',
    size: '5.1 MB',
    uploadedDate: '2024-04-19',
    downloads: 28,
  },
  {
    id: '3',
    name: 'Chemistry Lab Diagrams',
    type: 'image',
    subject: 'Chemistry',
    class: 'Form 4B',
    size: '1.8 MB',
    uploadedDate: '2024-04-18',
    downloads: 62,
  },
  {
    id: '4',
    name: 'Photosynthesis Animation',
    type: 'video',
    subject: 'Biology',
    class: 'Form 3B',
    size: '145 MB',
    uploadedDate: '2024-04-17',
    downloads: 34,
  },
];

const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
];
const classes = [
  'Form 3A',
  'Form 4A',
  'Form 4B',
  'Form 3B',
];

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'image':
        return <ImageIcon className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'audio':
        return <Music className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Handle file upload logic here
    console.log('File uploaded', e.target.files);
  };

  const filteredResources = mockResources.filter(resource => {
    const matchesSubject = !selectedSubject || resource.subject === selectedSubject;
    const matchesClass = !selectedClass || resource.class === selectedClass;
    const matchesSearch = !searchQuery ||
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSubject && matchesClass && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">Resources</h1>
        <div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4,.avi"
          />
          <Button asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Upload Resource
            </label>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Subjects</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="Biology">Biology</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Classes</SelectItem>
                <SelectItem value="Form 3A">Form 3A</SelectItem>
                <SelectItem value="Form 4A">Form 4A</SelectItem>
                <SelectItem value="Form 4B">Form 4B</SelectItem>
                <SelectItem value="Form 3B">Form 3B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource) => (
          <Card key={resource.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      {getFileIcon(resource.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" title={resource.name}>
                        {resource.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{resource.size}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{resource.subject}</Badge>
                  <Badge variant="outline">{resource.class}</Badge>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Uploaded: {resource.uploadedDate}</span>
                  <span>{resource.downloads} downloads</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No resources found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or upload some teaching materials.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}