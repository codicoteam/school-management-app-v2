import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Pencil, Mail, Phone, Users, GraduationCap, BookOpen, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface Teacher {
  id: string; name: string; subject: string; classes: string; email: string; phone: string; status: "Active" | "On Leave";
}

const teachers: Teacher[] = [
  { id: "TCH-001", name: "Mr. Tendai Mhlanga", subject: "Mathematics", classes: "Form 4A, 4B", email: "tmhlanga@burney.zw", phone: "+263 77 234 5678", status: "Active" },
  { id: "TCH-002", name: "Mrs. Rufaro Moyo", subject: "English", classes: "Form 2A, 3B", email: "rmoyo@burney.zw", phone: "+263 71 998 1122", status: "Active" },
  { id: "TCH-003", name: "Mr. Tinashe Dube", subject: "Science", classes: "Form 5A, 6A", email: "tdube@burney.zw", phone: "+263 78 445 9090", status: "Active" },
  { id: "TCH-004", name: "Mrs. Chiedza Banda", subject: "Shona", classes: "Form 1A, 1B, 1C", email: "cbanda@burney.zw", phone: "+263 77 121 3344", status: "On Leave" },
  { id: "TCH-005", name: "Mr. Farai Sibanda", subject: "History", classes: "Form 3A, 4A", email: "fsibanda@burney.zw", phone: "+263 71 778 2211", status: "Active" },
  { id: "TCH-006", name: "Ms. Nyasha Phiri", subject: "Geography", classes: "Form 2B, 5A", email: "nphiri@burney.zw", phone: "+263 78 332 0099", status: "Active" },
];

const stats = [
  { label: "Total Teachers", value: "45", icon: Users },
  { label: "Active Today", value: "42", icon: GraduationCap },
  { label: "Subjects Covered", value: "18", icon: BookOpen },
  { label: "On Leave", value: "3", icon: Clock },
];

const TeachersPage = () => {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("all");

  const filtered = useMemo(() => teachers.filter((t) =>
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase())) &&
    (subject === "all" || t.subject === subject)
  ), [search, subject]);

  const subjects = Array.from(new Set(teachers.map((t) => t.subject)));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Teacher Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Add teachers, assign subjects and classes, track performance.</p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="h-4 w-4" /> Add Teacher</Button>
      </motion.div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }}>
            <Card className="border-none shadow-md">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent"><s.icon className="h-5 w-5" /></div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-xl font-bold text-foreground">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-none shadow-md">
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[220px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search teachers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Subject" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Teacher</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Classes</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-secondary/70 text-xs font-bold text-secondary-foreground">
                          {t.name.split(" ").slice(-2).map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-medium">{t.name}</p>
                          <p className="font-mono text-xs text-muted-foreground">{t.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{t.subject}</TableCell>
                    <TableCell className="text-muted-foreground">{t.classes}</TableCell>
                    <TableCell>
                      <div className="space-y-0.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1"><Mail className="h-3 w-3" /> {t.email}</div>
                        <div className="flex items-center gap-1"><Phone className="h-3 w-3" /> {t.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={t.status === "Active" ? "bg-green-500/15 text-green-700 hover:bg-green-500/20" : "bg-orange-500/15 text-orange-700 hover:bg-orange-500/20"}>
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeachersPage;
