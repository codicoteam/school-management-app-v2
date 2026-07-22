import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Search, Plus, Pencil, ArrowUp, ArrowRightLeft, Ban, Download, Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { subscribe, addItem, updateItem, deleteItem } from "@/lib/localDb";
import { toast } from "sonner";

type Status = "Active" | "Suspended";
interface Student {
  id: string;
  name: string;
  class: string;
  gender: "M" | "F";
  status: Status;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  guardianName?: string;
  guardianPhone?: string;
}

const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  class: z.string().min(1, "Class is required"),
  gender: z.enum(["M", "F"]),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

const initialStudents: Student[] = [
  { id: "BPS-2451", name: "Tatenda Moyo", class: "Form 2B", gender: "M", status: "Active" },
  { id: "BPS-2452", name: "Chipo Ncube", class: "Form 4A", gender: "F", status: "Active" },
];

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribe<Student>("students", (studentList) => {
      setStudents(studentList.length > 0 ? studentList : initialStudents);
    });
    return unsubscribe;
  }, []);

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<StudentFormData>({
    defaultValues: {
      name: "",
      class: "",
      gender: "M" as const,
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      guardianName: "",
      guardianPhone: "",
    },
  });

  const { register: editRegister, handleSubmit: handleEditSubmit, reset: editReset, formState: { errors: editErrors }, setValue: setEditValue } = useForm<StudentFormData>({
    defaultValues: {
      name: "",
      class: "",
      gender: "M" as const,
      email: "",
      phone: "",
      dateOfBirth: "",
      address: "",
      guardianName: "",
      guardianPhone: "",
    },
  });

  useEffect(() => {
    if (editDialogOpen && editingStudent) {
      setEditValue("name", editingStudent.name);
      setEditValue("class", editingStudent.class);
      setEditValue("gender", editingStudent.gender);
      setEditValue("email", editingStudent.email || "");
      setEditValue("phone", editingStudent.phone || "");
      setEditValue("dateOfBirth", editingStudent.dateOfBirth || "");
      setEditValue("address", editingStudent.address || "");
      setEditValue("guardianName", editingStudent.guardianName || "");
      setEditValue("guardianPhone", editingStudent.guardianPhone || "");
    }
  }, [editDialogOpen, editingStudent, setEditValue]);

  const onAddStudent = async (data: StudentFormData) => {
    try {
      addItem("students", {
        ...data,
        status: "Active",
        createdAt: new Date().toISOString(),
      });
      setAddDialogOpen(false);
      reset();
      toast.success("Student added successfully");
    } catch (error) {
      toast.error("Failed to add student.");
    }
  };

  const onEditStudent = async (data: StudentFormData) => {
    if (!editingStudent) return;
    try {
      updateItem("students", editingStudent.id, { ...data });
      setEditDialogOpen(false);
      setEditingStudent(null);
      editReset();
      toast.success("Student updated");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const confirmDelete = async () => {
    if (!deletingStudentId) return;
    try {
      deleteItem("students", deletingStudentId);
      setSelected(selected.filter(id => id !== deletingStudentId));
      setDialogOpen(false);
      setDeletingStudentId(null);
      toast.success("Student deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (studentId: string) => {
    setDeletingStudentId(studentId);
    setDialogOpen(true);
  };

  const filtered = useMemo(() => students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === "all" || s.class === classFilter;
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesClass && matchesStatus;
  }), [students, search, classFilter, statusFilter]);

  const allSelected = filtered.length > 0 && filtered.every((s) => selected.includes(s.id));
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map((s) => s.id));
  const toggleOne = (id: string) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const classes = Array.from(new Set(students.map((s) => s.class))).sort();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Student Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage student records in real time.</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white hover:bg-primary/90">
              <Plus className="h-4 w-4" /> Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>Enter details for the new student record.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onAddStudent)} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                <Input id="name" {...register("name")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="class">Class <span className="text-destructive">*</span></Label>
                <Select onValueChange={(v) => setValue("class", v)}>
                  <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Form 1A">Form 1A</SelectItem>
                    <SelectItem value="Form 1B">Form 1B</SelectItem>
                    <SelectItem value="Form 2A">Form 2A</SelectItem>
                    <SelectItem value="Form 3A">Form 3A</SelectItem>
                    <SelectItem value="Form 4A">Form 4A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Gender <span className="text-destructive">*</span></Label>
                <Select onValueChange={(v) => setValue("gender", v as "M" | "F")}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="mt-2">
                <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Add Student</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <Card className="border-none shadow-md">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[220px] flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={classFilter} onValueChange={setClassFilter}>
                 <SelectTrigger className="w-[160px]"><SelectValue placeholder="Class" /></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="all">All Classes</SelectItem>
                   {classes.map((c) => <SelectItem key={c as string} value={c as string}>{c as string}</SelectItem>)}
                 </SelectContent>
              </Select>
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={toggleAll} /></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell><Checkbox checked={selected.includes(s.id)} onCheckedChange={() => toggleOne(s.id)} /></TableCell>
                      <TableCell><span className="font-medium">{s.name}</span></TableCell>
                      <TableCell className="font-mono text-xs">{s.id}</TableCell>
                      <TableCell>{s.class}</TableCell>
                      <TableCell>
                        <Badge variant={s.status === "Active" ? "default" : "destructive"}>{s.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => openEditDialog(s)}><Pencil className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="text-destructive" onClick={() => openDeleteDialog(s.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Edit Student</DialogTitle></DialogHeader>
          <form onSubmit={handleEditSubmit(onEditStudent)} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Name</Label>
              <Input {...editRegister("name")} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Student?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudentsPage;
