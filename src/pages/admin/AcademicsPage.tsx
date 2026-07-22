import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, BookOpen, Users, Clock, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getClasses, createClass, deleteClass, getClassStudents, type ClassRecord } from "@/lib/classesApi";
import { getSubjects, createSubject, type SubjectRecord } from "@/lib/subjectsApi";
import { getTeachers, type TeacherRecord } from "@/lib/teachersApi";

const periods = ["08:00", "08:50", "09:40", "10:45", "11:35", "12:20"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const timetableSubjects = ["Math", "English", "Science", "Shona", "History", "Geography"];

interface ClassFormData {
  name: string;
  subject: string;
  grade: string;
  teacher_id: string;
}

interface SubjectFormData {
  name: string;
  description: string;
}

const AcademicsPage = () => {
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [classStudentCounts, setClassStudentCounts] = useState<Record<string, number>>({});

  const [subjects, setSubjects] = useState<SubjectRecord[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);

  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);

  const [classOpen, setClassOpen] = useState(false);
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [savingClass, setSavingClass] = useState(false);
  const [savingSubject, setSavingSubject] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm<ClassFormData>({
    defaultValues: { name: "", subject: "", grade: "", teacher_id: "" }
  });

  const { register: subjectRegister, handleSubmit: handleSubjectSubmit, reset: resetSubject } = useForm<SubjectFormData>({
    defaultValues: { name: "", description: "" }
  });

  const fetchClasses = async () => {
    setLoadingClasses(true);
    try {
      const records = await getClasses();
      setClasses(records);

      const counts: Record<string, number> = {};
      await Promise.all(records.map(async (c) => {
        try {
          const students = await getClassStudents(c.id);
          counts[c.id] = students.length;
        } catch {
          counts[c.id] = 0;
        }
      }));
      setClassStudentCounts(counts);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Failed to load classes");
    } finally {
      setLoadingClasses(false);
    }
  };

  const fetchSubjects = async () => {
    setLoadingSubjects(true);
    try {
      const records = await getSubjects();
      setSubjects(records);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to load subjects");
    } finally {
      setLoadingSubjects(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const records = await getTeachers();
      setTeachers(records);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
    fetchTeachers();
  }, []);

  const addClass = async (data: ClassFormData) => {
    setSavingClass(true);
    try {
      const created = await createClass(data);
      setClasses(prev => [...prev, created]);
      setClassStudentCounts(prev => ({ ...prev, [created.id]: 0 }));
      toast.success("Class added successfully");
      setClassOpen(false);
      reset();
    } catch (error: any) {
      console.error("Error creating class:", error);
      toast.error(error?.message || "Failed to add class");
    } finally {
      setSavingClass(false);
    }
  };

  const removeClass = async (id: string) => {
    try {
      await deleteClass(id);
      setClasses(prev => prev.filter(c => c.id !== id));
      toast.success("Class deleted");
    } catch (error: any) {
      console.error("Error deleting class:", error);
      toast.error(error?.message || "Failed to delete class");
    }
  };

  const addSubject = async (data: SubjectFormData) => {
    setSavingSubject(true);
    try {
      const created = await createSubject(data);
      setSubjects(prev => [...prev, created]);
      toast.success("Subject added successfully");
      setSubjectOpen(false);
      resetSubject();
    } catch (error: any) {
      console.error("Error creating subject:", error);
      toast.error(error?.message || "Failed to add subject");
    } finally {
      setSavingSubject(false);
    }
  };

  const teacherName = (id?: string | null) => teachers.find(t => t.id === id)?.name || "Unassigned";

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Academic Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage classes, subjects, timetables and learning resources.</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={subjectOpen} onOpenChange={setSubjectOpen}>
            <DialogTrigger asChild><Button variant="outline"><Plus className="h-4 w-4" /> New Subject</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Subject</DialogTitle></DialogHeader>
              <form onSubmit={handleSubjectSubmit(addSubject)} className="grid gap-4 py-4">
                <div className="grid gap-2"><Label>Subject Name *</Label><Input {...subjectRegister("name", { required: true })} placeholder="Mathematics" /></div>
                <div className="grid gap-2"><Label>Description</Label><Textarea {...subjectRegister("description")} /></div>
                <DialogFooter><Button type="button" variant="outline" onClick={() => setSubjectOpen(false)}>Cancel</Button><Button type="submit" disabled={savingSubject}>{savingSubject && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Add Subject</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={classOpen} onOpenChange={setClassOpen}>
            <DialogTrigger asChild><Button className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="h-4 w-4" /> New Class</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Class</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit(addClass)} className="grid gap-4 py-4">
                <div className="grid gap-2"><Label>Class Name *</Label><Input {...register("name", { required: true })} placeholder="Form 1A" /></div>
                <div className="grid gap-2"><Label>Subject</Label>
                  <Select onValueChange={(v) => setValue("subject", v)}>
                    <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                    <SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2"><Label>Grade</Label><Input {...register("grade")} placeholder="Form 1" /></div>
                <div className="grid gap-2"><Label>Class Teacher</Label>
                  <Select onValueChange={(v) => setValue("teacher_id", v)}>
                    <SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger>
                    <SelectContent>{teachers.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <DialogFooter><Button type="button" variant="outline" onClick={() => setClassOpen(false)}>Cancel</Button><Button type="submit" disabled={savingClass}>{savingClass && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Add Class</Button></DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <Tabs defaultValue="classes" className="space-y-4">
        <TabsList className="bg-muted"><TabsTrigger value="classes">Classes</TabsTrigger><TabsTrigger value="subjects">Subjects</TabsTrigger><TabsTrigger value="timetable">Timetable</TabsTrigger></TabsList>

        <TabsContent value="classes">
          {loadingClasses ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
          ) : classes.length === 0 ? (
            <p className="py-10 text-center text-sm italic text-muted-foreground">No classes yet.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {classes.map(c => (
                <Card key={c.id} className="border-none shadow-md hover:shadow-lg transition">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div><h3 className="font-heading text-lg font-bold">{c.name}</h3><p className="text-xs text-muted-foreground">Class teacher: {teacherName(c.teacher_id)}</p></div>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => removeClass(c.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {classStudentCounts[c.id] ?? 0} students</span>
                      {c.grade && <Badge>{c.grade}</Badge>}
                      {c.subject && <Badge variant="outline">{c.subject}</Badge>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="subjects">
          {loadingSubjects ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
          ) : subjects.length === 0 ? (
            <p className="py-10 text-center text-sm italic text-muted-foreground">No subjects yet.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.map(s => (
                <Card key={s.id} className="border-none shadow-md">
                  <CardContent className="p-5">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15"><BookOpen className="h-5 w-5 text-foreground" /></div>
                    <h3 className="font-heading text-base font-bold">{s.name}</h3>
                    <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground"><span>{s.teachersCount ?? 0} teachers</span><span>·</span><span>{s.classesCount ?? 0} classes</span></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="timetable">
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center gap-2"><Clock className="h-5 w-5 text-accent" /><CardTitle className="font-heading text-lg font-semibold">Form 4A — Weekly Timetable</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b text-xs text-muted-foreground"><th className="px-2 py-2 text-left">Time</th>{days.map(d => <th key={d} className="px-2 py-2 text-left">{d}</th>)}</tr></thead>
                <tbody>
                  {periods.map((p, i) => (
                    <tr key={p} className="border-b last:border-0"><td className="py-2 px-2 font-medium text-muted-foreground">{p}</td>
                      {days.map(d => <td key={d} className="py-2 px-2"><div className="rounded-md bg-muted/40 px-2 py-1 text-xs font-medium">{timetableSubjects[(i + d.length) % timetableSubjects.length]}</div></td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AcademicsPage;
