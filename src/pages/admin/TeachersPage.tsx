import { useMemo, useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, Pencil, Trash2, Mail, Phone, Users, GraduationCap, BookOpen, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

interface Teacher {
  id: string;
  name: string;
  subject: string;
  classes: string;
  email: string;
  phone: string;
  status: "Active" | "On Leave";
  qualification?: string;
}

const initialTeachers: Teacher[] = [
  { id: "TCH-001", name: "Mr. Tendai Mhlanga", subject: "Mathematics", classes: "Form 4A, 4B", email: "tmhlanga@nexushigh.edu", phone: "+263 77 234 5678", status: "Active", qualification: "BSc Mathematics, UZ" },
  { id: "TCH-002", name: "Mrs. Rufaro Moyo", subject: "English", classes: "Form 2A, 3B", email: "rmoyo@nexushigh.edu", phone: "+263 71 998 1122", status: "Active", qualification: "BA English, UZ" },
  { id: "TCH-003", name: "Mr. Tinashe Dube", subject: "Science", classes: "Form 5A, 6A", email: "tdube@nexushigh.edu", phone: "+263 78 445 9090", status: "Active", qualification: "BSc Chemistry, NUST" },
  { id: "TCH-004", name: "Mrs. Chiedza Banda", subject: "Shona", classes: "Form 1A, 1B, 1C", email: "cbanda@nexushigh.edu", phone: "+263 77 121 3344", status: "On Leave", qualification: "BA Shona, UZ" },
  { id: "TCH-005", name: "Mr. Farai Sibanda", subject: "History", classes: "Form 3A, 4A", email: "fsibanda@nexushigh.edu", phone: "+263 71 778 2211", status: "Active", qualification: "BA History, UZ" },
  { id: "TCH-006", name: "Ms. Nyasha Phiri", subject: "Geography", classes: "Form 2B, 5A", email: "nphiri@nexushigh.edu", phone: "+263 78 332 0099", status: "Active", qualification: "BA Geography, UZ" },
];

const TeachersPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const loadTeachers = async () => {
      setLoading(true);
      try {
        const rows = await api.getTeachers();
        setTeachers(rows || []);
      } catch (error) {
        console.error("Error loading teachers:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTeachers();
  }, []);

  const { register, handleSubmit, reset, setValue } = useForm<Teacher>({
    defaultValues: { name: "", subject: "", classes: "", email: "", phone: "", status: "Active", qualification: "" }
  });

  const { register: editReg, handleSubmit: handleEdit, reset: editReset, setValue: setEditVal } = useForm<Teacher>({
    defaultValues: { name: "", subject: "", classes: "", email: "", phone: "", status: "Active", qualification: "" }
  });

  useEffect(() => {
    if (editOpen && editId) {
      const t = teachers.find(x => x.id === editId);
      if (t) { setEditVal("name", t.name); setEditVal("subject", t.subject); setEditVal("classes", t.classes); setEditVal("email", t.email); setEditVal("phone", t.phone); setEditVal("status", t.status); setEditVal("qualification", t.qualification || ""); }
    }
  }, [editOpen, editId, teachers, setEditVal]);

  const onAdd = async (data: Teacher) => {
    try {
      const created = await api.createTeacher(data);
      setTeachers(prev => [created, ...prev]);
      setAddOpen(false);
      reset();
    } catch (error) {
      console.error("Error creating teacher:", error);
    }
  };

  const onEdit = async (data: Teacher) => {
    if (!editId) return;
    try {
      const updated = await api.updateTeacher(editId, data);
      setTeachers(prev => prev.map(t => (t.id === editId ? updated : t)));
      setEditOpen(false);
      editReset();
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };

  const onDelete = async () => {
    if (!deleteId) return;
    try {
      await api.deleteTeacher(deleteId);
      setTeachers(prev => prev.filter(t => t.id !== deleteId));
      setSelected(prev => prev.filter(id => id !== deleteId));
      setDeleteOpen(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  const filtered = useMemo(() => teachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = subjectFilter === "all" || t.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  }), [teachers, search, subjectFilter]);

  const subjects = Array.from(new Set(teachers.map(t => t.subject).filter(Boolean)));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-bold">Teacher Management</h1>
          <p className="mt-2 text-sm text-muted-foreground">Loading teachers from the backend...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Teacher Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Add teachers, assign subjects and classes, track performance.</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild><Button className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="h-4 w-4" /> Add Teacher</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Teacher</DialogTitle><DialogDescription>Enter teacher details below.</DialogDescription></DialogHeader>
            <form onSubmit={handleSubmit(onAdd)} className="grid gap-4 py-4">
              <div className="grid gap-2"><Label>Full Name *</Label><Input {...register("name", { required: true })} /></div>
              <div className="grid gap-2"><Label>Email *</Label><Input type="email" {...register("email", { required: true })} /></div>
              <div className="grid gap-2"><Label>Phone</Label><Input {...register("phone")} /></div>
              <div className="grid gap-2"><Label>Subject *</Label>
                <Select onValueChange={(v) => setValue("subject", v)}>
                  <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                  <SelectContent>
                    {["Mathematics", "English", "Science", "Shona", "History", "Geography", "Chemistry", "Physics", "Biology"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"><Label>Classes</Label><Input {...register("classes")} placeholder="Form 4A, 4B" /></div>
              <div className="grid gap-2"><Label>Qualification</Label><Input {...register("qualification")} /></div>
              <DialogFooter><Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button><Button type="submit">Add Teacher</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[{ label: "Total Teachers", value: teachers.length, icon: Users }, { label: "Active Today", value: teachers.filter(t => t.status === "Active").length, icon: GraduationCap }, { label: "Subjects", value: subjects.length, icon: BookOpen }, { label: "On Leave", value: teachers.filter(t => t.status === "On Leave").length, icon: Clock }].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }}>
            <Card className="border-none shadow-md"><CardContent className="flex items-center gap-3 p-4"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent"><s.icon className="h-5 w-5" /></div><div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-xl font-bold text-foreground">{s.value}</p></div></CardContent></Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-none shadow-md">
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px] flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search teachers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}><SelectTrigger className="w-[180px]"><SelectValue placeholder="Subject" /></SelectTrigger><SelectContent><SelectItem value="all">All Subjects</SelectItem>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          </div>
          {selected.length > 0 && <div className="mt-4 flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 p-3"><span className="text-sm font-medium">{selected.length} selected</span><Button size="sm" variant="outline" className="text-destructive" onClick={() => { setDeleteId(selected[0]); setDeleteOpen(true); }}><Trash2 className="h-4 w-4" /> Delete</Button></div>}
          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader><TableRow className="bg-muted/40"><TableHead>Teacher</TableHead><TableHead>Subject</TableHead><TableHead>Classes</TableHead><TableHead>Contact</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.map(t => (
                  <TableRow key={t.id}>
                    <TableCell><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-secondary/70 text-xs font-bold text-secondary-foreground">{t.name.split(" ").slice(-2).map(n => n[0]).join("")}</div><div><p className="font-medium">{t.name}</p><p className="font-mono text-xs text-muted-foreground">{t.id}</p></div></div></TableCell>
                    <TableCell>{t.subject}</TableCell><TableCell>{t.classes}</TableCell>
                    <TableCell><div className="space-y-0.5 text-xs"><div className="flex items-center gap-1"><Mail className="h-3 w-3" /> {t.email}</div><div className="flex items-center gap-1"><Phone className="h-3 w-3" /> {t.phone}</div></div></TableCell>
                    <TableCell><Badge className={t.status === "Active" ? "bg-green-500/15 text-green-700" : "bg-orange-500/15 text-orange-700"}>{t.status}</Badge></TableCell>
                    <TableCell className="text-right"><Button size="icon" variant="ghost" onClick={() => { setEditId(t.id); setEditOpen(true); }}><Pencil className="h-4 w-4" /></Button><Button size="icon" variant="ghost" className="text-destructive" onClick={() => { setDeleteId(t.id); setDeleteOpen(true); }}><Trash2 className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent><DialogHeader><DialogTitle>Edit Teacher</DialogTitle></DialogHeader>
          <form onSubmit={handleEdit(onEdit)} className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Full Name</Label><Input {...editReg("name")} /></div>
            <div className="grid gap-2"><Label>Email</Label><Input type="email" {...editReg("email")} /></div>
            <div className="grid gap-2"><Label>Phone</Label><Input {...editReg("phone")} /></div>
            <div className="grid gap-2"><Label>Subject</Label><Select onValueChange={(v) => setEditVal("subject", v)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
            <div className="grid gap-2"><Label>Classes</Label><Input {...editReg("classes")} /></div>
            <div className="grid gap-2"><Label>Status</Label><Select onValueChange={(v) => setEditVal("status", v as "Active" | "On Leave")}><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="On Leave">On Leave</SelectItem></SelectContent></Select></div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button><Button type="submit">Save</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Teacher</AlertDialogTitle><AlertDialogDescription>Are you sure? This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={onDelete} className="bg-destructive">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeachersPage;