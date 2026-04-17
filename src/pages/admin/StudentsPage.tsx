import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  Search, Plus, Pencil, ArrowUp, ArrowRightLeft, Ban, Download, Trash2,
} from "lucide-react";
import { motion } from "framer-motion";

type Status = "Active" | "Suspended";
interface Student {
  id: string; name: string; class: string; gender: "M" | "F"; status: Status;
}

const allStudents: Student[] = [
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

const StudentsPage = () => {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => allStudents.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase());
    const matchesClass = classFilter === "all" || s.class === classFilter;
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesClass && matchesStatus;
  }), [search, classFilter, statusFilter]);

  const allSelected = filtered.length > 0 && filtered.every((s) => selected.includes(s.id));
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map((s) => s.id));
  const toggleOne = (id: string) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const classes = Array.from(new Set(allStudents.map((s) => s.class))).sort();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Student Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage student records, enrollments, and statuses.</p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4" /> Add Student
        </Button>
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
                  <Button size="sm" variant="outline" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /> Delete</Button>
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
                          <Button size="icon" variant="ghost" title="Edit"><Pencil className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" title="Promote"><ArrowUp className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" title="Transfer"><ArrowRightLeft className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" title="Suspend" className="text-destructive hover:text-destructive"><Ban className="h-4 w-4" /></Button>
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
              <span>Showing {filtered.length} of {allStudents.length} students</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled>Previous</Button>
                <Button size="sm" variant="outline" disabled>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default StudentsPage;
