import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Download, Clock, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { getClasses, getClassStudents, type ClassRecord, type ClassStudent } from "@/lib/classesApi";
import {
  getClassAttendance,
  createAttendance,
  getAdminAttendanceStats,
  getAdminAttendanceWeeklyTrend,
  type AttendanceStats,
  type WeeklyTrendItem,
} from "@/lib/attendanceApi";

type Status = "Present" | "Absent" | "Late";

const AttendancePage = () => {
  const [classes, setClasses] = useState<ClassRecord[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState<string>("");

  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [saving, setSaving] = useState(false);

  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [trend, setTrend] = useState<WeeklyTrendItem[]>([]);
  const [loadingTrend, setLoadingTrend] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoadingClasses(true);
      try {
        const records = await getClasses();
        setClasses(records);
        if (records.length > 0) setSelectedClassId(records[0].id);
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast.error("Failed to load classes");
      } finally {
        setLoadingClasses(false);
      }
    };
    fetchClasses();
  }, []);

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      setStats(await getAdminAttendanceStats());
    } catch (error) {
      console.error("Error fetching attendance stats:", error);
      toast.error("Failed to load attendance stats");
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchTrend = useCallback(async () => {
    setLoadingTrend(true);
    try {
      setTrend(await getAdminAttendanceWeeklyTrend());
    } catch (error) {
      console.error("Error fetching weekly attendance trend:", error);
      toast.error("Failed to load weekly attendance trend");
    } finally {
      setLoadingTrend(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchTrend();
  }, [fetchStats, fetchTrend]);

  useEffect(() => {
    if (!selectedClassId) return;

    const fetchRoster = async () => {
      setLoadingRoster(true);
      try {
        const [classStudents, records] = await Promise.all([
          getClassStudents(selectedClassId),
          getClassAttendance(selectedClassId),
        ]);
        setStudents(classStudents);

        const nextStatuses: Record<string, Status> = {};
        classStudents.forEach(s => { nextStatuses[s.id] = "Present"; });
        records.forEach((r: any) => {
          const studentId = r.studentId || r.student_id;
          const status = r.status as Status;
          if (studentId && status) nextStatuses[studentId] = status;
        });
        setStatuses(nextStatuses);
      } catch (error) {
        console.error("Error fetching class roster:", error);
        toast.error("Failed to load class roster");
        setStudents([]);
        setStatuses({});
      } finally {
        setLoadingRoster(false);
      }
    };
    fetchRoster();
  }, [selectedClassId]);

  const setStatus = (studentId: string, status: Status) =>
    setStatuses(prev => ({ ...prev, [studentId]: status }));

  const present = Object.values(statuses).filter(s => s === "Present").length;
  const absent = Object.values(statuses).filter(s => s === "Absent").length;
  const late = Object.values(statuses).filter(s => s === "Late").length;

  const exportAttendance = () => {
    const content = "Student ID,Name,Status\n" +
      students.map(s => `${s.id},${s.name},${statuses[s.id] || "Present"}`).join("\n");
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveAttendance = async () => {
    if (!selectedClassId || students.length === 0) return;
    setSaving(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      await createAttendance(students.map(s => ({
        studentId: s.id,
        classId: selectedClassId,
        status: statuses[s.id] || "Present",
        date: today,
      })));
      toast.success("Attendance saved!");
      fetchStats();
      fetchTrend();
    } catch (error: any) {
      console.error("Error saving attendance:", error);
      toast.error(error?.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const selectedClass = classes.find(c => c.id === selectedClassId);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Attendance Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Mark daily attendance and review trends.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportAttendance} disabled={students.length === 0}><Download className="h-4 w-4" /> Export</Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={saveAttendance} disabled={saving || students.length === 0}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Attendance
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {loadingStats ? (
          <div className="col-span-2 lg:col-span-4 flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
        ) : (
          [
            { label: "Present", value: stats?.present ?? 0, icon: CheckCircle2, color: "from-green-500 to-green-400" },
            { label: "Absent", value: stats?.absent ?? 0, icon: XCircle, color: "from-red-500 to-red-400" },
            { label: "Late", value: stats?.late ?? 0, icon: AlertCircle, color: "from-orange-500 to-orange-400" },
            { label: "Class Avg", value: `${stats?.["classAvg%"] ?? 0}%`, icon: Clock, color: "from-accent to-accent/70" },
          ].map(s => (
            <Card key={s.label} className="relative overflow-hidden border-none shadow-md">
              <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-[0.08]`} />
              <CardContent className="relative flex items-center gap-3 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color}`}><s.icon className="h-5 w-5 text-white" /></div>
                <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-xl font-bold">{s.value}</p></div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-none shadow-md lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-lg font-semibold">Mark Attendance{selectedClass ? ` — ${selectedClass.name}` : ""}</CardTitle>
            <Select value={selectedClassId} onValueChange={setSelectedClassId} disabled={loadingClasses || classes.length === 0}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Class" /></SelectTrigger>
              <SelectContent>
                {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-border">
              {loadingRoster ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
              ) : students.length === 0 ? (
                <p className="py-10 text-center text-sm italic text-muted-foreground">No students in this class.</p>
              ) : (
                <Table>
                  <TableHeader><TableRow className="bg-muted/40"><TableHead>Student</TableHead><TableHead>ID</TableHead><TableHead className="text-right">Status</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {students.map(s => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.name}</TableCell><TableCell className="font-mono text-xs text-muted-foreground">{s.id}</TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex gap-1">
                            {(["Present", "Late", "Absent"] as Status[]).map(st => (
                              <Button key={st} size="sm" variant={statuses[s.id] === st ? "default" : "outline"} onClick={() => setStatus(s.id, st)} className={statuses[s.id] === st ? (st === "Present" ? "bg-green-600 hover:bg-green-700" : st === "Late" ? "bg-orange-500 hover:bg-orange-600" : "bg-red-500 hover:bg-red-600") : ""}>{st}</Button>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader><CardTitle className="font-heading text-lg font-semibold">Weekly Trend</CardTitle></CardHeader>
          <CardContent>
            {loadingTrend ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="percentage" name="Attendance %" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendancePage;
