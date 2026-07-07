import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Download, TrendingUp, BarChart3, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from "recharts";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const ExamsPage = () => {
  const { user } = useAuth();
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [examsData, setExamsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subject: "Mathematics",
    date: new Date().toISOString().split('T')[0],
    totalMarks: "100"
  });

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

  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoading(true);
        const data = await api.getClasses();
        setClasses(data || []);
        if (data && data.length > 0) {
          setSelectedClass(data[0].id);
        }
      } catch (error) {
        console.error("Failed to load classes:", error);
      } finally {
        setLoading(false);
      }
    };
    loadClasses();
  }, []);

  useEffect(() => {
    const loadExams = async () => {
      if (!selectedClass) return;
      try {
        const data = await api.getExams(selectedClass);
        setExamsData(data || []);
      } catch (error) {
        console.error("Failed to load exams:", error);
      }
    };
    loadExams();
  }, [selectedClass]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateExam = async () => {
    if (!formData.name || !formData.subject || !formData.date || !selectedClass) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await api.createExam({
        class_id: selectedClass,
        teacher_id: user?.id,
        name: formData.name,
        subject: formData.subject,
        date: formData.date,
        total_marks: Number(formData.totalMarks),
      });
      alert("Exam created successfully");
      setFormData({ name: "", subject: "Mathematics", date: new Date().toISOString().split('T')[0], totalMarks: "100" });
      setIsDialogOpen(false);
      // Reload exams
      const data = await api.getExams(selectedClass);
      setExamsData(data || []);
    } catch (error) {
      console.error("Failed to create exam:", error);
      alert("Failed to create exam");
    }
  };

  const deleteExam = (id: number) => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      setExamsData(examsData.filter((e: any) => e.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Examinations & Grading</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage exams, enter marks, and generate reports</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Exam
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Exam</DialogTitle>
                <DialogDescription>
                  Enter the details for the new examination.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => { e.preventDefault(); handleCreateExam(); }} className="space-y-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Exam Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Midterm 2026"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Subject</Label>
                    <Select value={formData.subject} onValueChange={(v) => handleInputChange('subject', v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Chemistry">Chemistry</SelectItem>
                        <SelectItem value="Biology">Biology</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Class</Label>
                    <Select value={selectedClass || ""} onValueChange={(v) => setSelectedClass(v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Exam Date</Label>
                    <Input 
                      id="date" 
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="marks">Total Marks</Label>
                    <Input 
                      id="marks" 
                      type="number"
                      value={formData.totalMarks}
                      onChange={(e) => handleInputChange('totalMarks', e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter className="pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Create Exam</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Class</label>
                <Select value={selectedClass || ""} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls: any) => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
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
            <div className="space-y-3 group">
              {examsData.map((exam: any) => (
                <div key={exam.id} className="flex items-center justify-between p-3 rounded-lg border border-border/60 hover:bg-muted/30 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{exam.name}</p>
                    <p className="text-sm text-muted-foreground">{exam.subject} • {exam.class}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{new Date(exam.date).toLocaleDateString()}</p>
                      <Badge variant="outline">{exam.totalMarks} marks</Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteExam(exam.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
