import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, BookOpen, Users, Clock, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";

const initialSubjects = [
  { name: "Mathematics", teachers: 4, classes: 12, color: "bg-accent" },
  { name: "English", teachers: 3, classes: 12, color: "bg-secondary" },
  { name: "Science", teachers: 4, classes: 10, color: "bg-green-500" },
  { name: "Shona", teachers: 2, classes: 8, color: "bg-purple-500" },
  { name: "History", teachers: 2, classes: 6, color: "bg-orange-500" },
  { name: "Geography", teachers: 2, classes: 6, color: "bg-pink-500" },
];

const periods = ["08:00", "08:50", "09:40", "10:45", "11:35", "12:20"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const timetableSubjects = ["Math", "English", "Science", "Shona", "History", "Geography"];

const AcademicsPage = () => {
  const [classes, setClasses] = useState<Array<{ id: string; name: string; teacher: string; room: string; students: number }>>([]);
  const [subjects] = useState(initialSubjects);
  const [classOpen, setClassOpen] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [timetableRows, setTimetableRows] = useState<Array<any>>([]);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm<{ name: string; teacher: string; students: number; room: string }>({
    defaultValues: { name: "", teacher: "", students: 30, room: "" },
  });

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const rows = await api.getClasses();
        const mapped = (rows || []).map((cls: any) => ({
          id: cls.id,
          name: cls.name || cls.grade || "Unnamed Class",
          teacher: cls.subject || cls.teacher_id || "TBA",
          room: cls.grade || "N/A",
          students: Number(cls.subject_code) || 0,
        }));
        setClasses(mapped);
        if (mapped.length) setSelectedClassId(mapped[0].id);
      } catch (error) {
        console.error("Error loading classes:", error);
      }
    };

    loadClasses();
  }, []);

  useEffect(() => {
    if (!selectedClassId) return;

    const loadTimetable = async () => {
      try {
        const rows = await api.getTimetable(selectedClassId);
        setTimetableRows(rows || []);
      } catch (error) {
        console.error("Error loading timetable:", error);
      }
    };

    loadTimetable();
  }, [selectedClassId]);

  const addClass = async (data: { name: string; teacher: string; students: number; room: string }) => {
    setSaving(true);
    try {
      const created = await api.createClass({
        name: data.name,
        subject: data.teacher,
        grade: data.room,
        subject_code: String(data.students || 0),
      });

      setClasses((prev) => [
        ...prev,
        {
          id: created.id,
          name: created.name || created.grade || "Unnamed Class",
          teacher: created.subject || created.teacher_id || "TBA",
          room: created.grade || "N/A",
          students: Number(created.subject_code) || 0,
        },
      ]);
      setClassOpen(false);
      reset({ name: "", teacher: "", students: 30, room: "" });
    } catch (error) {
      console.error("Error creating class:", error);
    } finally {
      setSaving(false);
    }
  };

  const deleteClass = async (id: string) => {
    try {
      await api.deleteClass(id);
      setClasses((prev) => prev.filter((c) => c.id !== id));
      if (selectedClassId === id) {
        const nextClass = classes.find((c) => c.id !== id);
        setSelectedClassId(nextClass?.id || "");
      }
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Academic Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage classes, subjects, timetables and learning resources.</p>
        </div>
        <Dialog open={classOpen} onOpenChange={setClassOpen}>
          <DialogTrigger asChild><Button className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="h-4 w-4" /> New Class</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Class</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit(addClass)} className="grid gap-4 py-4">
              <div className="grid gap-2"><Label>Class Name</Label><Input {...register("name")} placeholder="Form 1A" /></div>
              <div className="grid gap-2"><Label>Class Teacher</Label><Input {...register("teacher")} /></div>
              <div className="grid gap-2"><Label>Room</Label><Input {...register("room")} placeholder="Rm 1" /></div>
              <div className="grid gap-2"><Label>Max Students</Label><Input type="number" {...register("students")} /></div>
              <DialogFooter><Button type="button" variant="outline" onClick={() => setClassOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving..." : "Add Class"}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <Tabs defaultValue="classes" className="space-y-4">
        <TabsList className="bg-muted"><TabsTrigger value="classes">Classes</TabsTrigger><TabsTrigger value="subjects">Subjects</TabsTrigger><TabsTrigger value="timetable">Timetable</TabsTrigger></TabsList>

        <TabsContent value="classes">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {classes.map((c) => (
              <Card key={c.id} className="border-none shadow-md hover:shadow-lg transition">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div><h3 className="font-heading text-lg font-bold">{c.name}</h3><p className="text-xs text-muted-foreground">Class teacher: {c.teacher}</p></div>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteClass(c.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {c.students || 0} students</span><Badge>{c.room}</Badge></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subjects">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map(s => (
              <Card key={s.name} className="border-none shadow-md">
                <CardContent className="p-5">
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${s.color}/15`}><BookOpen className="h-5 w-5 text-foreground" /></div>
                  <h3 className="font-heading text-base font-bold">{s.name}</h3>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground"><span>{s.teachers} teachers</span><span>·</span><span>{s.classes} classes</span></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timetable">
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center gap-2"><Clock className="h-5 w-5 text-accent" /><CardTitle className="font-heading text-lg font-semibold">Class Timetable</CardTitle></CardHeader>
            <CardContent>
              <div className="mb-6 grid gap-4 md:grid-cols-[minmax(220px,320px)_1fr] items-end">
                <div>
                  <Label>Class</Label>
                  <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                    <SelectTrigger><SelectValue placeholder="Choose a class" /></SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-2xl border border-muted p-4 bg-muted/50">
                  <p className="text-sm text-muted-foreground">Timetable entries are loaded from the backend.</p>
                  <p className="text-sm mt-2">If no data exists, use the schedule builder to add a class timetable later.</p>
                </div>
              </div>

              {timetableRows.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b text-xs text-muted-foreground"><th className="px-2 py-2 text-left">Day</th><th className="px-2 py-2 text-left">Time</th><th className="px-2 py-2 text-left">Subject</th><th className="px-2 py-2 text-left">Room</th></tr></thead>
                    <tbody>
                      {timetableRows.map((row) => (
                        <tr key={row.id} className="border-b last:border-0">
                          <td className="py-2 px-2">{row.day}</td>
                          <td className="py-2 px-2">{row.period}</td>
                          <td className="py-2 px-2">{row.subject || "TBA"}</td>
                          <td className="py-2 px-2">{row.room || "TBA"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-muted p-8 text-center text-sm text-muted-foreground">
                  No timetable data available for the selected class yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AcademicsPage;