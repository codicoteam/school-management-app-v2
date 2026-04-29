import React, { useState } from 'react';
import {
  Upload,
  Download,
  Search,
  Filter,
  FolderOpen,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  BookOpen,
  Users,
  Clock,
  MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface Resource {
  id: string;
  name: string;
  description: string;
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
    description: 'Practice worksheet for quadratic equations',
    type: 'pdf',
    subject: 'Mathematics',
    class: 'Class 10A',
    size: '2.3 MB',
    uploadedDate: '2024-04-20',
    downloads: 45,
  },
  {
    id: '2',
    name: 'Newton\'s Laws Presentation',
    description: 'PowerPoint presentation on Newton\'s three laws',
    type: 'document',
    subject: 'Physics',
    class: 'Class 11A',
    size: '5.1 MB',
    uploadedDate: '2024-04-19',
    downloads: 28,
  },
  {
    id: '3',
    name: 'Chemistry Lab Diagrams',
    description: 'Diagrams for chemistry lab experiments',
    type: 'image',
    subject: 'Chemistry',
    class: 'Class 11B',
    size: '1.8 MB',
    uploadedDate: '2024-04-18',
    downloads: 62,
  },
  {
    id: '4',
    name: 'Photosynthesis Animation',
    description: 'Video animation explaining photosynthesis',
    type: 'video',
    subject: 'Biology',
    class: 'Class 10B',
    size: '145 MB',
    uploadedDate: '2024-04-17',
    downloads: 34,
  },
  {
    id: '5',
    name: 'English Literature Notes',
    description: 'Study notes for English literature',
    type: 'document',
    subject: 'English',
    class: 'Class 10A',
    size: '3.2 MB',
    uploadedDate: '2024-04-16',
    downloads: 19,
  },
];

const subjectOptions = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History',
];

const classOptions = [
  'Class 10A',
  'Class 10B',
  'Class 11A',
  'Class 11B',
  'Class 11C',
];

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    name: '',
    type: 'pdf' as const,
    subject: '',
    class: '',
  });

  const getResourceIcon = (type: string) => {
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

  const handleFileUpload = () => {
    // TODO: Implement file upload logic
    setIsUploadDialogOpen(false);
    setUploadData({
      name: '',
      type: 'pdf',
      subject: '',
      class: '',
    });
  };

  const filteredResources = mockResources.filter((resource) => {
    const matchesSubject = selectedSubject === 'All Subjects' || resource.subject === selectedSubject;
    const matchesClass = selectedClass === 'All Classes' || resource.class === selectedClass;
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesClass && matchesSearch;
  });

  const stats = {
    totalResources: mockResources.length,
    totalDownloads: mockResources.reduce((acc, r) => acc + r.downloads, 0),
    totalSize: '450 MB',
  };

  return (
    <div className="space-y-6 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Resources</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalResources}
                </p>
              </div>
              <FolderOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalDownloads}
                </p>
              </div>
              <Download className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.totalSize}
                </p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="subject-filter">Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Subjects">All Subjects</SelectItem>
                  {subjectOptions.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="class-filter">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Classes">All Classes</SelectItem>
                  {classOptions.map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.length > 0 ? (
          filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        {getResourceIcon(resource.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" title={resource.name}>
                          {resource.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{resource.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{resource.subject}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{resource.class}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span>{resource.downloads} downloads</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{resource.uploadDate}</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <div className="text-center py-8">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No resources found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or upload some teaching materials.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Resource</DialogTitle>
            <DialogDescription>
              Add a new teaching material to your resource library.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Resource Name</Label>
              <Input
                id="name"
                value={uploadData.name}
                onChange={(e) => setUploadData({ ...uploadData, name: e.target.value })}
                placeholder="Enter resource name"
              />
            </div>
            <div>
              <Label htmlFor="type">Resource Type</Label>
              <Select
                value={uploadData.type}
                onValueChange={(value) => setUploadData({ ...uploadData, type: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={uploadData.subject}
                onValueChange={(value) => setUploadData({ ...uploadData, subject: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjectOptions.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="class">Class</Label>
              <Select
                value={uploadData.class}
                onValueChange={(value) => setUploadData({ ...uploadData, class: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classOptions.map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUploadDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleFileUpload}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          className="gap-2"
          onClick={() => setIsUploadDialogOpen(true)}
        >
          <Upload className="h-5 w-5" />
          Upload New Resource
        </Button>
      </div>
    </div>
  );
}