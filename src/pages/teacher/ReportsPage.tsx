import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Award,
  Download,
  Filter,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

interface PerformanceData {
  subject: string;
  average: number;
  target: number;
  students: number;
}

interface AttendanceData {
  month: string;
  attendance: number;
}

interface GradeData {
  name: string;
  value: number;
  color: string;
}

interface StudentPerformance {
  name: string;
  rollNumber: string;
  average: number;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'average' | 'poor';
}

const classPerformanceData: PerformanceData[] = [
  { subject: 'Mathematics', average: 78, target: 80, students: 35 },
  { subject: 'Physics', average: 82, target: 75, students: 32 },
  { subject: 'Chemistry', average: 85, target: 80, students: 30 },
  { subject: 'Biology', average: 79, target: 75, students: 33 },
  { subject: 'English', average: 81, target: 75, students: 35 },
];

const attendanceTrend: AttendanceData[] = [
  { month: 'January', attendance: 92 },
  { month: 'February', attendance: 88 },
  { month: 'March', attendance: 95 },
  { month: 'April', attendance: 90 },
  { month: 'May', attendance: 93 },
];

const gradeDistribution: GradeData[] = [
  { name: 'A+ (95-100)', value: 8, color: '#10b981' },
  { name: 'A (80-94)', value: 18, color: '#3b82f6' },
  { name: 'B (70-79)', value: 15, color: '#f59e0b' },
  { name: 'C (60-69)', value: 10, color: '#f97316' },
  { name: 'D (<60)', value: 4, color: '#ef4444' },
];

const studentPerformance: StudentPerformance[] = [
  {
    name: 'Arjun Sharma',
    rollNumber: '101',
    average: 92,
    trend: 'up',
    status: 'excellent',
  },
  {
    name: 'Priya Verma',
    rollNumber: '102',
    average: 95,
    trend: 'stable',
    status: 'excellent',
  },
  {
    name: 'Rahul Kumar',
    rollNumber: '103',
    average: 78,
    trend: 'down',
    status: 'average',
  },
  {
    name: 'Neha Singh',
    rollNumber: '104',
    average: 88,
    trend: 'up',
    status: 'good',
  },
  {
    name: 'Vikram Patel',
    rollNumber: '105',
    average: 62,
    trend: 'stable',
    status: 'poor',
  },
];

const monthlyEnrollment = [
  { month: 'Jan', students: 145, activeStudents: 140 },
  { month: 'Feb', students: 145, activeStudents: 142 },
  { month: 'Mar', students: 148, activeStudents: 147 },
  { month: 'Apr', students: 150, activeStudents: 148 },
  { month: 'May', students: 150, activeStudents: 149 },
];

export default function ReportsPage() {
  const [selectedClass, setSelectedClass] = useState('Class 10A');
  const [selectedTerm, setSelectedTerm] = useState('current');

  const stats = {
    totalStudents: 150,
    averagePerformance: 81.2,
    averageAttendance: 91.6,
    improvementRate: 15,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'average':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (trend === 'down') {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return <TrendingUp className="h-4 w-4 text-gray-600" />;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-600">
            Class performance, attendance, and grading analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Class 10A">Class 10A</SelectItem>
            <SelectItem value="Class 10B">Class 10B</SelectItem>
            <SelectItem value="Class 11A">Class 11A</SelectItem>
            <SelectItem value="Class 11B">Class 11B</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedTerm} onValueChange={setSelectedTerm}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Term</SelectItem>
            <SelectItem value="previous">Previous Term</SelectItem>
            <SelectItem value="year">Academic Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalStudents}
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
                <p className="text-sm font-medium text-gray-600">
                  Avg Performance
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.averagePerformance.toFixed(1)}%
                </p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg Attendance
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.averageAttendance.toFixed(1)}%
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Improvement Rate
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  +{stats.improvementRate}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance vs Target</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={classPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" fill="#3b82f6" name="Average" />
                <Bar dataKey="target" fill="#10b981" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Attendance %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Grade Distribution and Enrollment */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
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

        {/* Monthly Enrollment */}
        <Card>
          <CardHeader>
            <CardTitle>Student Enrollment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyEnrollment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Total Students"
                />
                <Line
                  type="monotone"
                  dataKey="activeStudents"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Active Students"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Student Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead className="text-right">Average Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Trend</TableHead>
                  <TableHead className="text-right">Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentPerformance.map((student) => (
                  <TableRow key={student.rollNumber}>
                    <TableCell className="font-medium">
                      {student.rollNumber}
                    </TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {student.average}%
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(student.status)}>
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex justify-center">
                      {getTrendIcon(student.trend)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={student.average} className="w-24" />
                        <span className="text-xs font-medium text-gray-600">
                          {student.average}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Subject Performance Details */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {classPerformanceData.map((subject) => (
              <div key={subject.subject} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {subject.subject}
                    </p>
                    <p className="text-xs text-gray-600">
                      {subject.students} students
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {subject.average}%
                    </p>
                    <p className="text-xs text-gray-600">
                      Target: {subject.target}%
                    </p>
                  </div>
                </div>
                <Progress value={subject.average} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};