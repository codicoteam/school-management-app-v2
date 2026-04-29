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
  { id: "BPS-2453", name: "Tinashe Chikomba", class: "Form 1C", gender: "M", status: "Active" },
  { id: "BPS-2454", name: "Rumbidzai Sibanda", class: "Form 3B", gender: "F", status: "Active" },
  { id: "BPS-2455", name: "Farai Dube", class: "Form 5A", gender: "M", status: "Suspended" },
  { id: "BPS-2456", name: "Nyasha Mhlanga", class: "Form 2A", gender: "F", status: "Active" },
  { id: "BPS-2457", name: "Kudzai Mutasa", class: "Form 4B", gender: "M", status: "Active" },
  { id: "BPS-2458", name: "Tariro Banda", class: "Form 1A", gender: "F", status: "Active" },
  { id: "BPS-2459", name: "Simbarashe Phiri", class: "Form 3A", gender: "M", status: "Suspended" },
  { id: "BPS-2460", name: "Chiedza Marufu", class: "Form 6A", gender: "F", status: "Active" },
];

const STORAGE_KEY = "school_students";

const loadStudents = (): Student[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return initialStudents;
};

const saveStudents = (students: Student[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
};

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>(loadStudents);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null);

  useEffect(() => {
    saveStudents(students);
  }, [students]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<StudentFormData>({
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

  const { register: editRegister, handleSubmit: handleEditSubmit, reset: editReset, formState: { errors: editErrors }, setValue } = useForm<StudentFormData>({
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
      setValue("name", editingStudent.name);
      setValue("class", editingStudent.class);
      setValue("gender", editingStudent.gender);
      setValue("email", editingStudent.email || "");
      setValue("phone", editingStudent.phone || "");
      setValue("dateOfBirth", editingStudent.dateOfBirth || "");
      setValue("address", editingStudent.address || "");
      setValue("guardianName", editingStudent.guardianName || "");
      setValue("guardianPhone", editingStudent.guardianPhone || "");
    }
  }, [editDialogOpen, editingStudent, setValue]);

  const generateId = () => {
    const num = 2451 + students.length;
    return `BPS-${num}`;
  };

  const onAddStudent = (data: StudentFormData) => {
    const newStudent: Student = {
      id: generateId(),
      name: data.name,
      class: data.class,
      gender: data.gender,
      status: "Active",
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      address: data.address,
      guardianName: data.guardianName,
      guardianPhone: data.guardianPhone,
    };
    setStudents([...students, newStudent]);
    setAddDialogOpen(false);
    reset();
  };

  const onEditStudent = (data: StudentFormData) => {
    if (!editingStudent) return;
    setStudents(students.map(s => 
      s.id === editingStudent.id 
        ? { ...s, name: data.name, class: data.class, gender: data.gender, email: data.email, phone: data.phone, dateOfBirth: data.dateOfBirth, address: data.address, guardianName: data.guardianName, guardianPhone: data.guardianPhone }
        : s
    ));
    setEditDialogOpen(false);
    setEditingStudent(null);
    editReset();
  };

  const confirmDelete = () => {
    if (!deletingStudentId) return;
    setStudents(students.filter(s => s.id !== deletingStudentId));
    setSelected(selected.filter(id => id !== deletingStudentId));
    setDeleteDialogOpen(false);
    setDeletingStudentId(null);
  };

  const deleteSelected = () => {
    setStudents(students.filter(s => !selected.includes(s.id)));
    setSelected([]);
  };

  const openEditDialog = (student: Student) => {
    setEditingStudent(student);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (studentId: string) => {
    setDeletingStudentId(studentId);
    setDeleteDialogOpen(true);
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
          <p className="mt-1 text-sm text-muted-foreground">Manage student records, enrollments, and statuses.</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4" /> Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>Enter the student details below to register a new student.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onAddStudent)} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                <Input id="name" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="class">Class <span className="text-destructive">*</span></Label>
                <Select {...register("class", { valueAsNumber: true })} onValueChange={(v) => setValue("class", v)}>
                  <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Form 1A">Form 1A</SelectItem>
                    <SelectItem value="Form 1B">Form 1B</SelectItem>
                    <SelectItem value="Form 1C">Form 1C</SelectItem>
                    <SelectItem value="Form 2A">Form 2A</SelectItem>
                    <SelectItem value="Form 2B">Form 2B</SelectItem>
                    <SelectItem value="Form 3A">Form 3A</SelectItem>
                    <SelectItem value="Form 3B">Form 3B</SelectItem>
                    <SelectItem value="Form 4A">Form 4A</SelectItem>
                    <SelectItem value="Form 4B">Form 4B</SelectItem>
                    <SelectItem value="Form 5A">Form 5A</SelectItem>
                    <SelectItem value="Form 6A">Form 6A</SelectItem>
                  </SelectContent>
                </Select>
                {errors.class && <p className="text-xs text-destructive">{errors.class.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label>Gender <span className="text-destructive">*</span></Label>
                <Select {...register("gender")} onValueChange={(v) => setValue("gender", v as "M" | "F")}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" {...register("dateOfBirth")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register("address")} />
              </div>
              <h3 className="font-medium pt-2">Guardian Details</h3>
              <div className="grid gap-2">
                <Label htmlFor="guardianName">Guardian Name</Label>
                <Input id="guardianName" {...register("guardianName")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="guardianPhone">Guardian Phone</Label>
                <Input id="guardianPhone" {...register("guardianPhone")} />
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
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[220px] flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search by name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Class" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk actions */}
            {selected.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-accent/30 bg-accent/5 p-3">
                <span className="text-sm font-medium text-foreground">{selected.length} selected</span>
                <div className="ml-auto flex flex-wrap gap-2">
                  <Button size="sm" variant="outline"><ArrowUp className="h-4 w-4" /> Promote</Button>
                  <Button size="sm" variant="outline"><Download className="h-4 w-4" /> Export</Button>
                  <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => { setDeletingStudentId(selected[0]); setDeleteDialogOpen(true); }}><Trash2 className="h-4 w-4" /> Delete</Button>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="w-10"><Checkbox checked={allSelected} onCheckedChange={toggleAll} /></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell><Checkbox checked={selected.includes(s.id)} onCheckedChange={() => toggleOne(s.id)} /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent/70 text-xs font-bold text-white">
                            {s.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="font-medium text-foreground">{s.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{s.id}</TableCell>
                      <TableCell>{s.class}</TableCell>
                      <TableCell>{s.gender === "M" ? "Male" : "Female"}</TableCell>
                      <TableCell>
                        <Badge variant={s.status === "Active" ? "default" : "destructive"} className={s.status === "Active" ? "bg-green-500/15 text-green-700 hover:bg-green-500/20" : ""}>
                          {s.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" title="Edit" onClick={() => openEditDialog(s)}><Pencil className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" title="Promote"><ArrowUp className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" title="Transfer"><ArrowRightLeft className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" title="Suspend" onClick={() => {
                            setStudents(students.map(st => st.id === s.id ? { ...st, status: st.status === "Active" ? "Suspended" : "Active" } : st));
                          }} className="text-destructive hover:text-destructive"><Ban className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" title="Delete" onClick={() => openDeleteDialog(s.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow><TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">No students match your filters.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>Showing {filtered.length} of {students.length} students</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled>Previous</Button>
                <Button size="sm" variant="outline" disabled>Next</Button>
              </div>
            </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>Update the student details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit(onEditStudent)} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Full Name <span className="text-destructive">*</span></Label>
              <Input id="edit-name" {...editRegister("name")} />
              {editErrors.name && <p className="text-xs text-destructive">{editErrors.name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label>Class <span className="text-destructive">*</span></Label>
              <Select {...editRegister("class")} onValueChange={(v) => setValue("class", v)}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Form 1A">Form 1A</SelectItem>
                  <SelectItem value="Form 1B">Form 1B</SelectItem>
                  <SelectItem value="Form 1C">Form 1C</SelectItem>
                  <SelectItem value="Form 2A">Form 2A</SelectItem>
                  <SelectItem value="Form 2B">Form 2B</SelectItem>
                  <SelectItem value="Form 3A">Form 3A</SelectItem>
                  <SelectItem value="Form 3B">Form 3B</SelectItem>
                  <SelectItem value="Form 4A">Form 4A</SelectItem>
                  <SelectItem value="Form 4B">Form 4B</SelectItem>
                  <SelectItem value="Form 5A">Form 5A</SelectItem>
                  <SelectItem value="Form 6A">Form 6A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Gender</Label>
              <Select {...editRegister("gender")} onValueChange={(v) => setValue("gender", v as "M" | "F")}>
                <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Male</SelectItem>
                  <SelectItem value="F">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" {...editRegister("email")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input id="edit-phone" {...editRegister("phone")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-dob">Date of Birth</Label>
              <Input id="edit-dob" type="date" {...editRegister("dateOfBirth")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Address</Label>
              <Input id="edit-address" {...editRegister("address")} />
            </div>
            <h3 className="font-medium pt-2">Guardian Details</h3>
            <div className="grid gap-2">
              <Label htmlFor="edit-guardianName">Guardian Name</Label>
              <Input id="edit-guardianName" {...editRegister("guardianName")} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-guardianPhone">Guardian Phone</Label>
              <Input id="edit-guardianPhone" {...editRegister("guardianPhone")} />
            </div>
            <DialogFooter className="mt-2">
              <Button type="button" variant="outline" onClick={() => { setEditDialogOpen(false); setEditingStudent(null); }}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this student? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingStudentId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default StudentsPage;
