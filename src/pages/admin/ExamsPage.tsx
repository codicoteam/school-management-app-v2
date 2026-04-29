import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, FileText, Send, Trophy, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

interface Exam {
  id: string;
  name: string;
  type: "Midterm" | "Final" | "Test";
  class: string;
  date: string;
  status: "Scheduled" | "Ongoing" | "Completed";
}

const STORAGE_KEY_EXAMS = "school_exams";
const STORAGE_KEY_MARKS = "school_marks";

const initialExams: Exam[] = [
  { id: "EX-001", name: "Term 2 Midterm", type: "Midterm", class: "Form 4A", date: "2025-04-22", status: "Scheduled" },
  { id: "EX-002", name: "Mathematics Test 3", type: "Test", class: "Form 2B", date: "2025-04-15", status: "Completed" },
  { id: "EX-003", name: "End of Year Final", type: "Final", class: "Form 6A", date: "2025-11-10", status: "Scheduled" },
  { id: "EX-004", name: "Science Practical", type: "Test", class: "Form 3B", date: "2025-04-18", status: "Ongoing" },
];

const subjects = ["Mathematics", "English", "Science"] as const;
type Subject = typeof subjects[number];

interface MarkRow {
  id: string;
  name: string;
  marks: Record<Subject, number>;
}

const initialMarks: MarkRow[] = [
  { id: "BPS-2451", name: "Tatenda Moyo", marks: { Mathematics: 78, English: 82, Science: 89 } },
  { id: "BPS-2452", name: "Chipo Ncube", marks: { Mathematics: 92, English: 88, Science: 94 } },
  { id: "BPS-2453", name: "Tinashe Chikomba", marks: { Mathematics: 67, English: 71, Science: 74 } },
  { id: "BPS-2454", name: "Rumbidzai Sibanda", marks: { Mathematics: 85, English: 90, Science: 81 } },
  { id: "BPS-2456", name: "Nyasha Mhlanga", marks: { Mathematics: 73, English: 79, Science: 68 } },
];

const loadExams = (): Exam[] => { try { const s = localStorage.getItem(STORAGE_KEY_EXAMS); return s ? JSON.parse(s) : initialExams; } catch { return initialExams; } };
const saveExams = (e: Exam[]) => localStorage.setItem(STORAGE_KEY_EXAMS, JSON.stringify(e));
const loadMarks = (): MarkRow[] => { try { const s = localStorage.getItem(STORAGE_KEY_MARKS); return s ? JSON.parse(s) : initialMarks; } catch { return initialMarks; } };
const saveMarks = (m: MarkRow[]) => localStorage.setItem(STORAGE_KEY_MARKS, JSON.stringify(m));

const grade = (avg: number) => avg >= 80 ? "A" : avg >= 70 ? "B" : avg >= 60 ? "C" : avg >= 50 ? "D" : "E";

const ExamsPage = () => {
  const [exams, setExams] = useState<Exam[]>(loadExams);
  const [marks, setMarks] = useState<MarkRow[]>(loadMarks);
  const [createOpen, setCreateOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<{ name: string; type: string; class: string; date: string }>();

  useEffect(() => { saveExams(exams); }, [exams]);
  useEffect(() => { saveMarks(marks); }, [marks]);

  const onCreateExam = (data: { name: string; type: string; class: string; date: string }) => {
    const newExam: Exam = { id: `EX-${String(exams.length + 1).padStart(3, "0")}`, name: data.name, type: data.type as Exam["type"], class: data.class, date: data.date, status: "Scheduled" };
    setExams([...exams, newExam]);
    setCreateOpen(false);
    reset();
  };

  const deleteExam = (id: string) => setExams(exams.filter(e => e.id !== id));

  const ranked = useMemo(() => {
    const withTotals = marks.map(r => {
      const total = subjects.reduce((sum, s) => sum + r.marks[s], 0);
      const avg = total / subjects.length;
      return { ...r, total, avg };
    });
    return [...withTotals].sort((a, b) => b.avg - a.avg).map((r, i) => ({ ...r, rank: i + 1 }));
  }, [marks]);

  const updateMark = (id: string, subject: Subject, value: string) => {
    const v = Math.max(0, Math.min(100, Number(value) || 0));
    setMarks(m => m.map(row => row.id === id ? { ...row, marks: { ...row.marks, [subject]: v } } : row));
  };

  const downloadReport = (student: typeof marks[0]) => {
    const content = `Report Card\nStudent: ${student.name}\nID: ${student.id}\n\nSubjects:\n${subjects.map(s => `${s}: ${student.marks[s]}`).join("\n")}\n\nAverage: ${(subjects.reduce((sum,s) => sum + student.marks[s], 0)/3).toFixed(1)}\nGrade: ${grade(subjects.reduce((sum,s) => sum + student.marks[s], 0)/3)}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report_${student.id}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground">Exams & Results</h1>
        <p className="mt-1 text-sm text-muted-foreground">Schedule exams, capture marks, and publish report cards.</p>
      </motion.div>

      <Tabs defaultValue="exams" className="space-y-4">
        <TabsList className="bg-muted"><TabsTrigger value="exams">Exams</TabsTrigger><TabsTrigger value="marks">Marks Entry</TabsTrigger><TabsTrigger value="reports">Report Cards</TabsTrigger></TabsList>

        <TabsContent value="exams" className="space-y-4">
          <Card className="border-none shadow-md">
            <CardHeader><CardTitle className="font-heading text-lg font-semibold">Create Exam</CardTitle></CardHeader>
            <CardContent>
              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild><Button className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="h-4 w-4" /> Schedule Exam</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>New Exam</DialogTitle><DialogDescription>Enter exam details.</DialogDescription></DialogHeader>
                  <form onSubmit={handleSubmit(onCreateExam)} className="grid gap-4 py-4">
                    <div className="grid gap-2"><Label>Exam Name *</Label><Input {...register("name", { required: true })} /></div>
                    <div className="grid gap-2"><Label>Type</Label>
                      <Select onValueChange={(v) => {}}><SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger><SelectContent><SelectItem value="Midterm">Midterm</SelectItem><SelectItem value="Final">Final</SelectItem><SelectItem value="Test">Test</SelectItem></SelectContent></Select>
                    </div>
                    <div className="grid gap-2"><Label>Class</Label><Input {...register("class")} placeholder="Form 4A" /></div>
                    <div className="grid gap-2"><Label>Date</Label><Input type="date" {...register("date")} /></div>
                    <DialogFooter><Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button><Button type="submit">Create</Button></DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader><CardTitle className="font-heading text-lg font-semibold">Scheduled Exams</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow className="bg-muted/40"><TableHead>Exam</TableHead><TableHead>Type</TableHead><TableHead>Class</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {exams.map(e => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.name}</TableCell><TableCell>{e.type}</TableCell><TableCell>{e.class}</TableCell><TableCell>{e.date}</TableCell>
                      <TableCell><Badge className={e.status === "Completed" ? "bg-green-500/15 text-green-700" : e.status === "Ongoing" ? "bg-secondary/30" : "bg-accent/15 text-accent"}>{e.status}</Badge></TableCell>
                      <TableCell><Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteExam(e.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marks" className="space-y-4">
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-start justify-between">
              <div><CardTitle className="font-heading text-lg font-semibold">Marks Entry — Form 2B Midterm</CardTitle><p className="text-xs text-muted-foreground">Auto-calculate totals and averages.</p></div>
              <Button className="bg-primary text-primary-foreground"><Send className="h-4 w-4" /> Publish Results</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow className="bg-muted/40"><TableHead>Student</TableHead>{subjects.map(s => <TableHead key={s}>{s}</TableHead>)}<TableHead>Total</TableHead><TableHead>Average</TableHead><TableHead>Grade</TableHead></TableRow></TableHeader>
                <TableBody>
                  {ranked.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      {subjects.map(s => <TableCell key={s}><Input type="number" min={0} max={100} value={r.marks[s]} onChange={e => updateMark(r.id, s, e.target.value)} className="h-9 w-20" /></TableCell>)}
                      <TableCell className="font-semibold">{r.total}</TableCell><TableCell className="font-semibold">{r.avg.toFixed(1)}</TableCell>
                      <TableCell><Badge className="bg-accent/15 text-accent">{grade(r.avg)}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center gap-2"><Trophy className="h-5 w-5 text-secondary" /><CardTitle>Class Ranking</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {ranked.map(r => (
                <div key={r.id} className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${r.rank === 1 ? "bg-secondary text-secondary-foreground" : r.rank === 2 ? "bg-muted-foreground/20" : r.rank === 3 ? "bg-orange-500/20 text-orange-700" : "bg-muted text-muted-foreground"}`}>{r.rank}</div>
                  <span className="flex-1 font-medium">{r.name}</span>
                  <span className="text-sm text-muted-foreground">Avg: <span className="font-semibold">{r.avg.toFixed(1)}</span></span>
                  <Badge className="bg-accent/15 text-accent">{grade(r.avg)}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-start justify-between">
              <div><CardTitle className="font-heading text-lg font-semibold">Report Cards</CardTitle><p className="text-xs text-muted-foreground">Download per-student reports.</p></div>
              <Button className="bg-accent text-accent-foreground"><FileText className="h-4 w-4" /> Generate All</Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {ranked.map(r => (
                  <div key={r.id} className="rounded-lg border border-border bg-card p-4 transition hover:border-accent hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent/70 text-sm font-bold text-white">{r.name.split(" ").map(n => n[0]).join("")}</div>
                      <div className="min-w-0 flex-1"><p className="truncate font-medium">{r.name}</p><p className="text-xs text-muted-foreground">{r.id}</p></div>
                      <Badge className="bg-accent/15 text-accent">{grade(r.avg)}</Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground"><span>Avg: <span className="font-semibold">{r.avg.toFixed(1)}</span></span><span>Rank: <span className="font-semibold">#{r.rank}</span></span></div>
                    <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => downloadReport(r)}><FileText className="h-4 w-4" /> Download</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExamsPage;