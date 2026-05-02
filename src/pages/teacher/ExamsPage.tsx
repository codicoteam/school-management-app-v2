import React, { useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Plus,
  Download,
  Edit2,
  Trash2,
  TrendingUp,
  Award,
  Users,
  FileText,
  Filter,
  Search,
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

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  marks: number;
  outOf: number;
  percentage: number;
  grade: string;
}

interface ExamData {
  id: string;
  name: string;
  subject: string;
  date: string;
  totalMarks: number;
  passingMarks: number;
  students: Student[];
}

interface PerformanceData {
  name: string;
  average: number;
  highest: number;
  lowest: number;
}

interface GradeDistribution {
  name: string;
  value: number;
  color: string;
}

const mockExams: ExamData[] = [
  {
    id: '1',
    name: 'Midterm Examination',
    subject: 'Mathematics',
    date: '2024-04-15',
    totalMarks: 100,
    passingMarks: 40,
    students: [
      {
        id: 's1',
        name: 'Arjun Sharma',
        rollNumber: '101',
        marks: 85,
        outOf: 100,
        percentage: 85,
        grade: 'A',
      },
      {
        id: 's2',
        name: 'Priya Verma',
        rollNumber: '102',
        marks: 92,
        outOf: 100,
        percentage: 92,
        grade: 'A+',
      },
      {
        id: 's3',
        name: 'Rahul Kumar',
        rollNumber: '103',
        marks: 78,
        outOf: 100,
        percentage: 78,
        grade: 'B',
      },
      {
        id: 's4',
        name: 'Neha Singh',
        rollNumber: '104',
        marks: 88,
        outOf: 100,
        percentage: 88,
        grade: 'A',
      },
      {
        id: 's5',
        name: 'Vikram Patel',
        rollNumber: '105',
        marks: 65,
        outOf: 100,
        percentage: 65,
        grade: 'C',
      },
    ],
  },
  {
    id: '2',
    name: 'Unit Test 1',
    subject: 'Science',
    date: '2024-04-08',
    totalMarks: 50,
    passingMarks: 20,
    students: [
      {
        id: 's1',
        name: 'Arjun Sharma',
        rollNumber: '101',
        marks: 42,
        outOf: 50,
        percentage: 84,
        grade: 'A',
      },
      {
        id: 's2',
        name: 'Priya Verma',
        rollNumber: '102',
        marks: 48,
        outOf: 50,
        percentage: 96,
        grade: 'A+',
      },
      {
        id: 's3',
        name: 'Rahul Kumar',
        rollNumber: '103',
        marks: 35,
        outOf: 50,
        percentage: 70,
        grade: 'B',
      },
      {
        id: 's4',
        name: 'Neha Singh',
        rollNumber: '104',
        marks: 44,
        outOf: 50,
        percentage: 88,
        grade: 'A',
      },
      {
        id: 's5',
        name: 'Vikram Patel',
        rollNumber: '105',
        marks: 28,
        outOf: 50,
        percentage: 56,
        grade: 'D',
      },
    ],
  },
];

const performanceData: PerformanceData[] = [
  { name: 'Mathematics', average: 81.6, highest: 92, lowest: 65 },
  { name: 'Science', average: 78.2, highest: 96, lowest: 56 },
  { name: 'English', average: 84.4, highest: 95, lowest: 72 },
  { name: 'History', average: 79.8, highest: 93, lowest: 68 },
];

const gradeDistribution: GradeDistribution[] = [
  { name: 'A+', value: 8, color: '#10b981' },
  { name: 'A', value: 15, color: '#3b82f6' },
  { name: 'B', value: 12, color: '#f59e0b' },
  { name: 'C', value: 7, color: '#ef4444' },
];

const monthlyPerformance = [
  { month: 'Jan', average: 72, students: 48 },
  { month: 'Feb', average: 75, students: 48 },
  { month: 'Mar', average: 78, students: 48 },
  { month: 'Apr', average: 81, students: 48 },
  { month: 'May', average: 83, students: 48 },
];

export default function ExamsPage() {
  const [selectedExam, setSelectedExam] = useState<ExamData>(mockExams[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [newMarks, setNewMarks] = useState('');

  const filteredStudents = selectedExam.students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesGrade =
      filterGrade === 'all' || student.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  const handleEditMarks = (student: Student) => {
    setEditingStudent(student);
    setNewMarks(student.marks.toString());
    setIsDialogOpen(true);
  };

  const handleSaveMarks = () => {
    if (editingStudent && newMarks) {
      const marks = parseInt(newMarks);
      if (marks >= 0 && marks <= selectedExam.totalMarks) {
        editingStudent.marks = marks;
        editingStudent.percentage = (marks / selectedExam.totalMarks) * 100;
        editingStudent.grade = getGrade(editingStudent.percentage);
        setIsDialogOpen(false);
        setEditingStudent(null);
        setNewMarks('');
      }
    }
  };

  const getGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const generateReportCard = () => {
    const csv = [
      ['Roll No', 'Name', 'Marks', 'Out Of', 'Percentage', 'Grade'],
      ...selectedExam.students.map((s) => [
        s.rollNumber,
        s.name,
        s.marks,
        s.outOf,
        s.percentage.toFixed(2),
        s.grade,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(csv)
    );
    element.setAttribute('download', `${selectedExam.name}-results.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exams & Marks</h1>
          <p className="text-sm text-gray-600">
            Manage student marks and generate report cards
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generateReportCard}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Exam
          </Button>
        </div>
      </div>

      {/* Exam Selection */}
      <div className="flex gap-2">
        <Select
          value={selectedExam.id}
          onValueChange={(value) => {
            const exam = mockExams.find((e) => e.id === value);
            if (exam) setSelectedExam(exam);
          }}
        >
          <SelectTrigger className="w-64">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {mockExams.map((exam) => (
              <SelectItem key={exam.id} value={exam.id}>
                {exam.name} - {exam.subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Passed</p>
                <p className="text-2xl font-bold text-green-600">{stats.passed}</p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.average.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Highest Score</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.highest.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Class Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Avg Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Subject Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" fill="#3b82f6" name="Average" />
              <Bar dataKey="highest" fill="#10b981" name="Highest" />
              <Bar dataKey="lowest" fill="#ef4444" name="Lowest" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Student Marks Table */}
      <Card>
        <CardHeader className="space-y-4">
          <CardTitle>Student Results</CardTitle>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterGrade} onValueChange={setFilterGrade}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
                <SelectItem value="F">F</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="text-right">Marks</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
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
                    <TableCell className="text-right">
                      {student.marks}/{student.outOf}
                    </TableCell>
                    <TableCell className="text-right">
                      {student.percentage.toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          student.grade === 'A+'
                            ? 'bg-green-100 text-green-800'
                            : student.grade === 'A'
                            ? 'bg-blue-100 text-blue-800'
                            : student.grade === 'B'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {student.grade}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student.marks >= selectedExam.passingMarks
                            ? 'default'
                            : 'destructive'
                        }
                      >
                        {student.marks >= selectedExam.passingMarks
                          ? 'Passed'
                          : 'Failed'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditMarks(student)}
                        >
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

      {/* Edit Marks Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student Marks</DialogTitle>
          </DialogHeader>
          {editingStudent && (
            <div className="space-y-4">
              <div>
                <Label>Student Name</Label>
                <p className="text-sm font-medium text-gray-900">
                  {editingStudent.name}
                </p>
              </div>
              <div>
                <Label>Roll Number</Label>
                <p className="text-sm font-medium text-gray-900">
                  {editingStudent.rollNumber}
                </p>
              </div>
              <div>
                <Label htmlFor="marks">Marks (out of {selectedExam.totalMarks})</Label>
                <Input
                  id="marks"
                  type="number"
                  min="0"
                  max={selectedExam.totalMarks}
                  value={newMarks}
                  onChange={(e) => setNewMarks(e.target.value)}
                  placeholder="Enter marks"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMarks}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}