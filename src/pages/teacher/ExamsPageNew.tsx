import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Download, TrendingUp, BarChart3 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";

const ExamsPage = () => {
  const [selectedClass, setSelectedClass] = useState("Form 3A");
  const [selectedExam, setSelectedExam] = useState("Midterm");

  const classes = ["Form 3A", "Form 4A", "Form 4B"];
  const exams = ["Midterm", "Final", "Mock", "Continuous"];

  const examsData = [
    { id: 1, name: "Midterm Exams 2026", class: "Form 3A", date: "2026-04-15", subject: "Physics", totalMarks: 100 },
    { id: 2, name: "Mathematics Paper 1", class: "Form 3A", date: "2026-04-16", subject: "Mathematics", totalMarks: 100 },
    { id: 3, name: "Chemistry Practical", class: "Form 4A", date: "2026-04-20", subject: "Chemistry", totalMarks: 50 },
  ];

  const studentMarks = [
    { id: 1, name: "Alice Johnson", marks: 85, percentage: 85, grade: "A" },
    { id: 2, name: "Bob Smith", marks: 72, percentage: 72, grade: "B" },
    { id: 3, name: "Charlie Brown", marks: 68, percentage: 68, grade: "C" },
    { id: 4, name: "Diana Wilson", marks: 92, percentage: 92, grade: "A+" },
    { id: 5, name: "Edward Davis", marks: 78, percentage: 78, grade: "B" },
  ];

  const performanceData = [
    { subject: "Physics", average: 78, previous: 75 },
    { subject: "Mathematics", average: 82, previous: 79 },
    { subject: "Chemistry", average: 80, previous: 77 },
    { subject: "Biology", average: 85, previous: 82 },
  ];

  const classPerformance = [
    { exam: "Exam 1", average: 76 },
    { exam: "Exam 2", average: 79 },
    { exam: "Exam 3", average: 82 },
    { exam: "Exam 4", average: 85 },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Examinations & Grading</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage exams, enter marks, and generate reports</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Exam
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Exam</label>
                <Select value={selectedExam} onValueChange={setSelectedExam}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map(exam => (
                      <SelectItem key={exam} value={exam}>{exam}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Analytics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="grid gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Subject Performance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                <Legend />
                <Bar dataKey="average" fill="hsl(var(--chart-1))" name="Current" />
                <Bar dataKey="previous" fill="hsl(var(--chart-2))" name="Previous" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Class Average Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={classPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="exam" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                <Line type="monotone" dataKey="average" stroke="hsl(var(--chart-1)))" strokeWidth={2} dot={{ fill: "hsl(var(--chart-1))" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Student Marks Entry */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <Card className="border-none shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Enter Marks - {selectedClass} ({selectedExam})</CardTitle>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Marks (100)</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentMarks.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>
                        <Input type="number" defaultValue={student.marks} className="w-24" min="0" max="100" />
                      </TableCell>
                      <TableCell className="font-medium">{student.percentage}%</TableCell>
                      <TableCell>
                        <Badge variant={student.grade === 'A' || student.grade === 'A+' ? 'default' : 'secondary'}>
                          {student.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">Entered</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex gap-3">
              <Button>Save Marks</Button>
              <Button variant="outline">Generate Report Card</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Exams */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Recent Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {examsData.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-3 rounded-lg border border-border/60">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{exam.name}</p>
                    <p className="text-sm text-muted-foreground">{exam.subject} • {exam.class}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{new Date(exam.date).toLocaleDateString()}</p>
                    <Badge variant="outline">{exam.totalMarks} marks</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ExamsPage;
