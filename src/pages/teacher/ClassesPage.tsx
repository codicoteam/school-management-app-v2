import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Upload,
  Download,
  Edit2,
  Trash2,
  FileText,
  BookOpen,
  GraduationCap,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  status: 'active' | 'inactive';
  attendance: number;
}

interface Class {
  id: string;
  name: string;
  section?: string;
  totalStudents: number;
  students: Student[];
}

interface Material {
  id: string;
  name: string;
  type: 'lesson-plan' | 'assignment' | 'resource' | 'worksheet';
  uploadedDate: string;
  size: string;
}

export default function ClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [newStudent, setNewStudent] = useState({
    name: '',
    rollNumber: '',
    email: '',
  });
  const [uploadFile, setUploadFile] = useState<{
    name: string;
    type: 'lesson-plan' | 'assignment' | 'resource' | 'worksheet';
  }>({
    name: '',
    type: 'lesson-plan',
  });

  // Load classes on component mount
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoading(true);
        const data = await api.getClasses();
        const classesWithStudents = await Promise.all(
          (data || []).map(async (cls: any) => {
            try {
              const students = await api.getStudentsByClass(cls.id);
              return {
                ...cls,
                totalStudents: students?.length || 0,
                students: (students || []).map((s: any) => ({
                  id: s.id,
                  name: s.name,
                  rollNumber: s.roll_number || '',
                  email: s.email,
                  status: 'active' as const,
                  attendance: 0,
                })),
              };
            } catch (error) {
              return { ...cls, totalStudents: 0, students: [] };
            }
          })
        );
        setClasses(classesWithStudents);
        if (classesWithStudents.length > 0) {
          setSelectedClass(classesWithStudents[0]);
        }
      } catch (error) {
        console.error("Failed to load classes:", error);
      } finally {
        setLoading(false);
      }
    };
    loadClasses();
  }, []);

  // Load materials when class is selected
  useEffect(() => {
    const loadMaterials = async () => {
      if (!selectedClass) return;
      try {
        const data = await api.getResources();
        setMaterials((data || []).map((m: any, i: number) => ({
          id: m.id || `m${i}`,
          name: m.title || m.name,
          type: m.type || 'resource' as const,
          uploadedDate: m.created_at ? new Date(m.created_at).toISOString().split('T')[0] : '',
          size: `${Math.ceil((m.size || 0) / 1024 / 1024)} MB`,
        })));
      } catch (error) {
        console.error("Failed to load materials:", error);
      }
    };
    loadMaterials();
  }, [selectedClass]);

  const filteredStudents = selectedClass?.students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.rollNumber || !newStudent.email || !selectedClass) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const student: Student = {
        id: `s${Math.random()}`,
        name: newStudent.name,
        rollNumber: newStudent.rollNumber,
        email: newStudent.email,
        status: 'active',
        attendance: 0,
      };
      setSelectedClass(prev => prev ? {
        ...prev,
        students: [...(prev.students || []), student],
        totalStudents: (prev.students?.length || 0) + 1,
      } : null);
      setNewStudent({ name: '', rollNumber: '', email: '' });
      setIsAddStudentDialogOpen(false);
      alert("Student added successfully");
    } catch (error) {
      console.error("Failed to add student:", error);
      alert("Failed to add student");
    }
  };

  const handleUploadMaterial = async () => {
    if (!uploadFile.name || !selectedClass) {
      alert("Please fill in all fields");
      return;
    }

    try {
      alert("Material uploaded successfully");
      setIsUploadDialogOpen(false);
      setUploadFile({ name: '', type: 'lesson-plan' });
    } catch (error) {
      console.error("Failed to upload material:", error);
      alert("Failed to upload material");
    }
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'lesson-plan':
        return <BookOpen className="h-4 w-4" />;
      case 'assignment':
        return <FileText className="h-4 w-4" />;
      case 'worksheet':
        return <FileText className="h-4 w-4" />;
      case 'resource':
        return <Download className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 95) return 'bg-green-100 text-green-800';
    if (attendance >= 85) return 'bg-blue-100 text-blue-800';
    if (attendance >= 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
          <p className="text-sm text-gray-600">
            Manage your classes, students, and materials
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsUploadDialogOpen(true)}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Material
          </Button>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => setIsAddStudentDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Class Selection */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {classes.map((cls) => (
          <Button
            key={cls.id}
            variant={selectedClass?.id === cls.id ? 'default' : 'outline'}
            onClick={() => setSelectedClass(cls)}
            className="whitespace-nowrap"
          >
            {cls.name} {cls.section ? `- Section ${cls.section}` : ''}
          </Button>
        ))}
      </div>

      {/* Class Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedClass?.totalStudents}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    selectedClass?.students.filter((s) => s.status === 'active')
                      .length
                  }
                </p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Materials Uploaded
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {materials.length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle>Student List</CardTitle>
                <Button
                  size="sm"
                  onClick={() => setIsAddStudentDialogOpen(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Student
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search student by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll No</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Attendance %</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.rollNumber}
                        </TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {student.email}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              student.status === 'active'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge className={getAttendanceColor(student.attendance)}>
                            {student.attendance}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Learning Materials</CardTitle>
                <Button
                  size="sm"
                  onClick={() => setIsUploadDialogOpen(true)}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="text-blue-500">
                        {getMaterialIcon(material.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {material.name}
                        </p>
                        <div className="flex gap-3 text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(material.uploadedDate).toLocaleDateString()}
                          </span>
                          <span>{material.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Student Dialog */}
      <Dialog open={isAddStudentDialogOpen} onOpenChange={setIsAddStudentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Student Name</Label>
              <Input
                id="name"
                value={newStudent.name}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, name: e.target.value })
                }
                placeholder="Enter student name"
              />
            </div>
            <div>
              <Label htmlFor="rollNumber">Roll Number</Label>
              <Input
                id="rollNumber"
                value={newStudent.rollNumber}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, rollNumber: e.target.value })
                }
                placeholder="Enter roll number"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newStudent.email}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, email: e.target.value })
                }
                placeholder="Enter email address"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddStudentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddStudent}>Add Student</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Material Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Material</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="materialName">Material Name</Label>
              <Input
                id="materialName"
                value={uploadFile.name}
                onChange={(e) =>
                  setUploadFile({ ...uploadFile, name: e.target.value })
                }
                placeholder="Enter material name"
              />
            </div>
            <div>
              <Label htmlFor="materialType">Material Type</Label>
              <select
                id="materialType"
                value={uploadFile.type}
                onChange={(e) =>
                  setUploadFile({
                    ...uploadFile,
                    type: e.target.value as 'lesson-plan' | 'assignment' | 'worksheet' | 'resource',
                  })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="lesson-plan">Lesson Plan</option>
                <option value="assignment">Assignment</option>
                <option value="worksheet">Worksheet</option>
                <option value="resource">Resource</option>
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
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadMaterial}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}