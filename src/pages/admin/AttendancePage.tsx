import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Download, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface Student {
  id: string;
  name: string;
}

type Status = "Present" | "Absent" | "Late";

const trend = [
  { day: "Mon", present: 92, absent: 8 },
  { day: "Tue", present: 94, absent: 6 },
  { day: "Wed", present: 89, absent: 11 },
  { day: "Thu", present: 95, absent: 5 },
  { day: "Fri", present: 91, absent: 9 },
];

const AttendancePage = () => {
  const [classes, setClasses] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, Status>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadClasses = async () => {
      setLoading(true);
      try {
        const rows = await api.getClasses();
        const mapped = (rows || []).map((cls: any) => ({ id: cls.id, name: cls.name || cls.grade || "Unnamed Class" }));
        setClasses(mapped);
        if (mapped.length > 0) {
          setSelectedClassId(mapped[0].id);
        }
      } catch (error) {
        console.error("Error loading classes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadClasses();
  }, []);

  useEffect(() => {
    if (!selectedClassId) {
      setStudents([]);
      setAttendance({});
      return;
    }

    const loadAttendance = async () => {
      setLoading(true);
      try {
        const roster = await api.getStudentsByClass(selectedClassId);
        const attendanceRows = await api.getAttendance(selectedClassId);
        const today = new Date().toISOString().split("T")[0];
        const initialAttendance: Record<string, Status> = {};

        (roster || []).forEach((student: any) => {
          const record = (attendanceRows || []).find((row: any) => row.student_id === student.id && row.date === today);
          initialAttendance[student.id] = record
            ? record.status === "late"
              ? "Late"
              : record.status === "present"
              ? "Present"
              : "Absent"
            : "Present";
        });

        setStudents((roster || []).map((student: any) => ({ id: student.id, name: student.name || student.id })));
        setAttendance(initialAttendance);
      } catch (error) {
        console.error("Error loading attendance roster:", error);
        setStudents([]);
        setAttendance({});
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, [selectedClassId]);

  const setStatus = (id: string, status: Status) => setAttendance((prev) => ({ ...prev, [id]: status }));
  const present = students.filter((s) => attendance[s.id] === "Present").length;
  const absent = students.filter((s) => attendance[s.id] === "Absent").length;
  const late = students.filter((s) => attendance[s.id] === "Late").length;
  const percent = students.length ? Math.round((present / students.length) * 100) : 0;
  const selectedClassName = classes.find((cls) => cls.id === selectedClassId)?.name || "Class";

  const exportAttendance = () => {
    const content = "Student ID,Name,Status\n" + students.map((student) => `${student.id},${student.name},${attendance[student.id] || "Present"}`).join("\n");
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const saveAttendance = async () => {
    if (!selectedClassId) return;
    setSaving(true);
    try {
      const payload = students.map((student) => ({
        class_id: selectedClassId,
        student_id: student.id,
        date: new Date().toISOString().split("T")[0],
        status: attendance[student.id]?.toLowerCase() || "present",
      }));
      await api.markAttendance(payload);
      alert("Attendance saved successfully.");
    } catch (error) {
      console.error("Failed to save attendance:", error);
      alert("Failed to save attendance. See console for details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Attendance Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Mark daily attendance and review trends.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportAttendance}><Download className="h-4 w-4" /> Export</Button>
          <Button disabled={!students.length || saving} className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={saveAttendance}><Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Attendance"}</Button>
        </div>
      </motion.div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Present", value: present, icon: CheckCircle2, color: "from-green-500 to-green-400" },
          { label: "Absent", value: absent, icon: XCircle, color: "from-red-500 to-red-400" },
          { label: "Late", value: late, icon: AlertCircle, color: "from-orange-500 to-orange-400" },
          { label: "Class Avg", value: `${percent}%`, icon: Clock, color: "from-accent to-accent/70" },
        ].map((s) => (
          <Card key={s.label} className="relative overflow-hidden border-none shadow-md">
            <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-[0.08]`} />
            <CardContent className="relative flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color}`}><s.icon className="h-5 w-5 text-white" /></div>
              <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-xl font-bold">{s.value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-none shadow-md lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-lg font-semibold">Mark Attendance — {selectedClassName}</CardTitle>
            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Select class" /></SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading roster...</p>
            ) : !students.length ? (
              <p className="text-sm text-muted-foreground">No students found for this class.</p>
            ) : (
              <div className="overflow-hidden rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead>Student</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{student.id}</TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex gap-1">
                            {(["Present", "Late", "Absent"] as Status[]).map((st) => (
                              <Button
                                key={st}
                                size="sm"
                                variant={attendance[student.id] === st ? "default" : "outline"}
                                onClick={() => setStatus(student.id, st)}
                                className={attendance[student.id] === st ? (st === "Present" ? "bg-green-600 hover:bg-green-700" : st === "Late" ? "bg-orange-500 hover:bg-orange-600" : "bg-red-500 hover:bg-red-600") : ""}
                              >
                                {st}
                              </Button>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader><CardTitle className="font-heading text-lg font-semibold">Weekly Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="present" stackId="a" fill="hsl(var(--accent))" radius={[0, 0, 0, 0]} />
                <Bar dataKey="absent" stackId="a" fill="hsl(var(--destructive))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendancePage;
