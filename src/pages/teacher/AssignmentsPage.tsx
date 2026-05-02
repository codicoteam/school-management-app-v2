import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, FileText, Calendar, Users, Eye, Download, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const AssignmentsPage = () => {
  const [selectedClass, setSelectedClass] = useState("Form 3A");
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    dueDate: "",
  });

  const classes = ["Form 3A", "Form 4A", "Form 4B"];

  const assignments = [
    {
      id: 1,
      title: "Physics Chapter 5 Problems",
      subject: "Physics",
      class: "Form 3A",
      dueDate: "2026-05-05",
      description: "Solve problems 1-20 from Chapter 5. Show all working.",
      totalSubmissions: 22,
      totalStudents: 25,
      averageGrade: 78,
      status: "active"
    },
    {
      id: 2,
      title: "Mathematics Algebra Worksheet",
      subject: "Mathematics",
      class: "Form 3A",
      dueDate: "2026-04-30",
      description: "Complete the algebra worksheet covering quadratic equations.",
      totalSubmissions: 24,
      totalStudents: 25,
      averageGrade: 82,
      status: "pending"
    },
    {
      id: 3,
      title: "Biology Lab Report",
      subject: "Biology",
      class: "Form 4A",
      dueDate: "2026-05-10",
      description: "Submit a comprehensive lab report on mitosis.",
      totalSubmissions: 18,
      totalStudents: 28,
      averageGrade: 85,
      status: "active"
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Assignments & Homework</h1>
            <p className="mt-1 text-sm text-muted-foreground">Create and manage student assignments</p>
          </div>
          <Button onClick={() => setShowNewAssignment(!showNewAssignment)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Assignment
          </Button>
        </div>
      </motion.div>

      {/* Create Assignment Form */}
      {showNewAssignment && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Create New Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Assignment title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Class</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(cls => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Assignment instructions..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button>Create Assignment</Button>
                <Button variant="outline" onClick={() => setShowNewAssignment(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Class Filter */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {classes.map(cls => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Assignments Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assignments.map((assignment, i) => (
          <Card key={assignment.id} className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{assignment.subject}</p>
                  </div>
                  <Badge variant={assignment.status === 'active' ? 'default' : 'secondary'}>
                    {assignment.status === 'active' ? 'Active' : 'Pending'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{assignment.description}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Submissions: {assignment.totalSubmissions}/{assignment.totalStudents}</span>
                  <span className="font-medium">{Math.round((assignment.totalSubmissions / assignment.totalStudents) * 100)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(assignment.totalSubmissions / assignment.totalStudents) * 100}%` }}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Eye className="h-3 w-3" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Grade
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
};

export default AssignmentsPage;