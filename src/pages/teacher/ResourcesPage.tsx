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
    class: 'Class 10A',
    size: '2.3 MB',
    uploadedDate: '2024-04-20',
    downloads: 45,
  },
  {
    id: '2',
    name: 'Newton\'s Laws Presentation',
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
    type: 'document',
    subject: 'English',
    class: 'Class 10A',
    size: '3.2 MB',
    uploadedDate: '2024-04-16',
    downloads: 19,
  },
  {
    id: '6',
    name: 'Historical Timeline Audio',
    type: 'audio',
    subject: 'History',
    class: 'Class 11C',
    size: '45 MB',
    uploadedDate: '2024-04-15',
    downloads: 12,
  },
];

const subjects = [
  'All Subjects',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History',
];
const classes = [
  'All Classes',
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

  const stats = {
    totalResources: mockResources.length,
    totalDownloads: mockResources.reduce((acc, r) => acc + r.downloads, 0),
    totalSize: '450 MB',
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resources</h1>
          <p className="text-sm text-gray-600">
            Upload, organize, and manage learning materials
          </p>
        </div>
        <Button
          size="sm"
          className="gap-2"
          onClick={() => setIsUploadDialogOpen(true)}
        >
          <Upload className="h-4 w-4" />
          Upload Resource
        </Button>
      </div>

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
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((resource) => (
          <Card
            key={resource.id}
            className="hover:shadow-lg transition-shadow flex flex-col"
          >
            <CardContent className="pt-6 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  {getResourceIcon(resource.type)}
                </div>
                <Badge variant="outline" className="text-xs">
                  {resource.type.toUpperCase()}
                </Badge>
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                  {resource.name}
                </h3>
                <div className="space-y-1 text-xs text-gray-600 mb-4">
                  <p>Subject: {resource.subject}</p>
                  <p>Class: {resource.class}</p>
                  <p>Size: {resource.size}</p>
                  <div className="flex items-center gap-1 text-gray-500 pt-1">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(resource.uploadedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-xs font-medium text-gray-600">
                  {resource.downloads} downloads
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No resources found</p>
            <p className="text-sm text-gray-500">Try adjusting your search filters</p>
          </CardContent>
        </Card>
      )}

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="resourceName">Resource Name</Label>
              <Input
                id="resourceName"
                value={uploadData.name}
                onChange={(e) =>
                  setUploadData({ ...uploadData, name: e.target.value })
                }
                placeholder="Enter resource name"
              />
            </div>
            <div>
              <Label htmlFor="resourceType">Resource Type</Label>
              <select
                id="resourceType"
                value={uploadData.type}
                onChange={(e) =>
                  setUploadData({
                    ...uploadData,
                    type: e.target.value as any,
                  })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="pdf">PDF</option>
                <option value="document">Document</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
              </select>
            </div>
            <div>
              <Label htmlFor="resourceSubject">Subject</Label>
              <select
                id="resourceSubject"
                value={uploadData.subject}
                onChange={(e) =>
                  setUploadData({ ...uploadData, subject: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">Select Subject</option>
                {subjects.slice(1).map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="resourceClass">Class</Label>
              <select
                id="resourceClass"
                value={uploadData.class}
                onChange={(e) =>
                  setUploadData({ ...uploadData, class: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">Select Class</option>
                {classes.slice(1).map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="file">Select File</Label>
              <input
                id="file"
                type="file"
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUploadDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUploadResource}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


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
};

export default ResourcesPage;