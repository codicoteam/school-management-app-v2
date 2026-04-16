import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ClipboardList, Plus, Search, FileText, Trophy, TrendingUp, Calendar, Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Exam {
  id: string;
  name: string;
  type: "Midterm" | "Final" | "Test";
  term: string;
  classes: string[];
  date: string;
  status: "Upcoming" | "In Progress" | "Completed" | "Published";
}

interface Result {
  id: string;
  student: string;
  class: string;
  subject: string;
  marks: number;
  total: number;
  grade: string;
  rank: number;
}

const initialExams: Exam[] = [
  { id: "1", name: "Midterm Examinations", type: "Midterm", term: "Term 1", classes: ["Grade 7A", "Grade 7B"], date: "2026-03-15", status: "Published" },
  { id: "2", name: "End of Term 1 Finals", type: "Final", term: "Term 1", classes: ["Grade 8A", "Grade 8B", "Grade 9A"], date: "2026-04-20", status: "Completed" },
  { id: "3", name: "Science Quiz Week", type: "Test", term: "Term 2", classes: ["Grade 7A"], date: "2026-05-10", status: "Upcoming" },
  { id: "4", name: "Mathematics Assessment", type: "Test", term: "Term 2", classes: ["Grade 8A", "Grade 8B"], date: "2026-05-18", status: "In Progress" },
  { id: "5", name: "Midterm Term 2", type: "Midterm", term: "Term 2", classes: ["Grade 7A", "Grade 7B", "Grade 8A"], date: "2026-06-01", status: "Upcoming" },
];

const sampleResults: Result[] = [
  { id: "1", student: "Tatenda Moyo", class: "Grade 7A", subject: "Mathematics", marks: 92, total: 100, grade: "A", rank: 1 },
  { id: "2", student: "Chipo Ndlovu", class: "Grade 7A", subject: "Mathematics", marks: 88, total: 100, grade: "A", rank: 2 },
  { id: "3", student: "Blessing Mutasa", class: "Grade 7A", subject: "Mathematics", marks: 76, total: 100, grade: "B", rank: 3 },
  { id: "4", student: "Farai Chirwa", class: "Grade 7A", subject: "Mathematics", marks: 71, total: 100, grade: "B", rank: 4 },
  { id: "5", student: "Nyasha Dube", class: "Grade 7A", subject: "Mathematics", marks: 65, total: 100, grade: "C", rank: 5 },
  { id: "6", student: "Rudo Mhandu", class: "Grade 7A", subject: "Mathematics", marks: 58, total: 100, grade: "C", rank: 6 },
  { id: "7", student: "Tinashe Gumbo", class: "Grade 7A", subject: "Mathematics", marks: 45, total: 100, grade: "D", rank: 7 },
];

const stats = [
  { label: "Total Exams", value: "5", icon: ClipboardList, gradient: "from-accent to-accent/70" },
  { label: "Published Results", value: "1", icon: FileText, gradient: "from-green-500 to-green-400" },
  { label: "Avg. Pass Rate", value: "86%", icon: TrendingUp, gradient: "from-secondary to-secondary/70" },
  { label: "Top Performer", value: "T. Moyo", icon: Trophy, gradient: "from-purple-500 to-purple-400" },
];

const statusColor: Record<string, string> = {
  Upcoming: "bg-muted text-muted-foreground",
  "In Progress": "bg-secondary/20 text-secondary-foreground",
  Completed: "bg-accent/15 text-accent",
  Published: "bg-green-100 text-green-700",
};

const gradeColor: Record<string, string> = {
  A: "bg-green-100 text-green-700",
  B: "bg-accent/15 text-accent",
  C: "bg-secondary/20 text-secondary-foreground",
  D: "bg-orange-100 text-orange-700",
  F: "bg-destructive/15 text-destructive",
};

export default function ExamsPage() {
  const [exams, setExams] = useState(initialExams);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newExam, setNewExam] = useState({ name: "", type: "Midterm" as Exam["type"], term: "Term 1", date: "" });

  const filtered = exams.filter(
    (e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.type.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = () => {
    if (!newExam.name || !newExam.date) {
      toast.error("Please fill in all fields");
      return;
    }
    const exam: Exam = {
      id: String(exams.length + 1),
      ...newExam,
      classes: ["Grade 7A"],
      status: "Upcoming",
    };
    setExams([exam, ...exams]);
    setNewExam({ name: "", type: "Midterm", term: "Term 1", date: "" });
    setDialogOpen(false);
    toast.success("Exam created successfully");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground">Exams & Results</h1>
        <p className="mt-1 text-sm text-muted-foreground">Create exams, enter marks, generate report cards and rankings.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.06 }}>
            <Card className="relative overflow-hidden border-none shadow-md">
              <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-[0.07]`} />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} shadow-sm`}>
                  <s.icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
        <Tabs defaultValue="exams" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="exams" className="gap-1.5"><Calendar className="h-4 w-4" /> Exams</TabsTrigger>
            <TabsTrigger value="results" className="gap-1.5"><Trophy className="h-4 w-4" /> Results</TabsTrigger>
            <TabsTrigger value="rankings" className="gap-1.5"><Users className="h-4 w-4" /> Rankings</TabsTrigger>
          </TabsList>

          {/* Exams Tab */}
          <TabsContent value="exams">
            <Card className="border-none shadow-md">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="font-heading text-lg">All Exams</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search exams..."
                      className="pl-9 w-[200px]"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-1.5">
                        <Plus className="h-4 w-4" /> New Exam
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="font-heading">Create New Exam</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div className="space-y-2">
                          <Label>Exam Name</Label>
                          <Input placeholder="e.g. Midterm Examinations" value={newExam.name} onChange={(e) => setNewExam({ ...newExam, name: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={newExam.type} onValueChange={(v) => setNewExam({ ...newExam, type: v as Exam["type"] })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Midterm">Midterm</SelectItem>
                                <SelectItem value="Final">Final</SelectItem>
                                <SelectItem value="Test">Test</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Term</Label>
                            <Select value={newExam.term} onValueChange={(v) => setNewExam({ ...newExam, term: v })}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Term 1">Term 1</SelectItem>
                                <SelectItem value="Term 2">Term 2</SelectItem>
                                <SelectItem value="Term 3">Term 3</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input type="date" value={newExam.date} onChange={(e) => setNewExam({ ...newExam, date: e.target.value })} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleCreate}>Create Exam</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="hidden sm:table-cell">Term</TableHead>
                      <TableHead className="hidden md:table-cell">Classes</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.name}</TableCell>
                        <TableCell><Badge variant="outline">{exam.type}</Badge></TableCell>
                        <TableCell className="hidden sm:table-cell">{exam.term}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{exam.classes.join(", ")}</TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">{new Date(exam.date).toLocaleDateString()}</TableCell>
                        <TableCell><Badge className={statusColor[exam.status]}>{exam.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No exams found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Exam Results — Midterm Examinations (Grade 7A, Mathematics)</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead className="hidden sm:table-cell">Rank</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleResults.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="text-muted-foreground">{r.rank}</TableCell>
                        <TableCell className="font-medium">{r.student}</TableCell>
                        <TableCell>{r.marks}/{r.total}</TableCell>
                        <TableCell><Badge className={gradeColor[r.grade]}>{r.grade}</Badge></TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {r.rank <= 3 ? (
                            <span className="flex items-center gap-1 text-secondary font-semibold">
                              <Trophy className="h-3.5 w-3.5" /> #{r.rank}
                            </span>
                          ) : `#${r.rank}`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rankings Tab */}
          <TabsContent value="rankings">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Class Rankings — Grade 7A (Term 1)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {sampleResults.slice(0, 5).map((r, i) => (
                    <div
                      key={r.id}
                      className={`flex items-center gap-4 rounded-xl p-4 transition-colors ${
                        i === 0 ? "bg-secondary/10 border border-secondary/30" : "bg-muted/50"
                      }`}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-sm ${
                        i === 0 ? "bg-secondary text-secondary-foreground" : i === 1 ? "bg-muted-foreground/20 text-muted-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground">{r.student}</p>
                        <p className="text-xs text-muted-foreground">{r.class}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">{r.marks}%</p>
                        <Badge className={gradeColor[r.grade] + " text-xs"}>{r.grade}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
