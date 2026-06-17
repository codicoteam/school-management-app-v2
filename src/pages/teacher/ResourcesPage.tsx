import React, { useState, useEffect } from 'react';
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
import { api } from '@/lib/api';

interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'video' | 'document' | 'audio';
  subject: string;
  class: string;
  size: string;
  uploadedDate: string;
  downloads: number;
  uploadedBy?: string;
}

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
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await api.getResources();
      setResources(data);
    } catch (error) {
      console.error('Failed to load resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // Determine file type
      const fileType = selectedFile.type.split('/')[0] as 'pdf' | 'image' | 'video' | 'audio' | 'document';
      let type: Resource['type'] = 'document';
      
      if (fileType === 'video') type = 'video';
      else if (fileType === 'image') type = 'image';
      else if (fileType === 'audio') type = 'audio';
      else if (selectedFile.name.endsWith('.pdf')) type = 'pdf';
      else type = 'document';

      // In a real app, you would upload the file to a storage service and get a URL
      // For now, we'll simulate by creating a resource object
      const resourceData = {
        name: selectedFile.name,
        type,
        subject: selectedSubject || 'General',
        class: selectedClass || 'General',
        size: `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedDate: new Date().toISOString().split('T')[0],
        downloads: 0,
      };

      await api.uploadResource(resourceData);
      await loadResources();
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error('Failed to upload resource:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await api.deleteResource(id);
        await loadResources();
      } catch (error) {
        console.error('Failed to delete resource:', error);
      }
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const filteredResources = resources.filter(resource => {
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
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4,.avi,.mov,.mp3,.wav"
            />
            <Button 
              asChild 
              variant="outline"
              className={uploading ? "opacity-50 cursor-not-allowed" : ""}
            >
              <label htmlFor="file-upload" className="cursor-pointer flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                {selectedFile ? 'Change File' : 'Select File'}
              </label>
            </Button>
            
            {selectedFile && (
              <div className="flex items-center gap-2 bg-muted rounded-md px-3 py-2 text-sm border border-border animate-in fade-in slide-in-from-left-2 transition-all">
                <FileText className="h-4 w-4 text-accent" />
                <span className="truncate max-w-[150px] font-medium">{selectedFile.name}</span>
                <Button 
                  onClick={handleUpload} 
                  disabled={uploading}
                  size="sm"
                  className="ml-2 h-8"
                >
                  {uploading ? (
                    <>
                      <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : (
                    'Confirm Upload'
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0" 
                  onClick={() => setSelectedFile(null)}
                  disabled={uploading}
                >
                  <Plus className="h-4 w-4 rotate-45" />
                </Button>
              </div>
            )}
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
            <Select value={selectedSubject || "all"} onValueChange={(v) => setSelectedSubject(v === "all" ? "" : v)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
                <SelectItem value="Biology">Biology</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedClass || "all"} onValueChange={(v) => setSelectedClass(v === "all" ? "" : v)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="Form 3A">Form 3A</SelectItem>
                <SelectItem value="Form 4A">Form 4A</SelectItem>
                <SelectItem value="Form 4B">Form 4B</SelectItem>
                <SelectItem value="Form 3B">Form 3B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Loading resources...</p>
        </div>
      )}

      {!loading && (
        <>
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
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete(resource.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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
        </>
      )}
    </div>
  );
}


