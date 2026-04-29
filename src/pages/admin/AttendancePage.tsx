import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Download, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const STORAGE_KEY = "school_attendance";

const trend = [
  { day: "Mon", present: 92, absent: 8 },
  { day: "Tue", present: 94, absent: 6 },
  { day: "Wed", present: 89, absent: 11 },
  { day: "Thu", present: 95, absent: 5 },
  { day: "Fri", present: 91, absent: 9 },
];

const initialRoster = [
  { id: "BPS-2451", name: "Tatenda Moyo", status: "Present" as const },
  { id: "BPS-2452", name: "Chipo Ncube", status: "Present" as const },
  { id: "BPS-2453", name: "Tinashe Chikomba", status: "Late" as const },
  { id: "BPS-2454", name: "Rumbidzai Sibanda", status: "Present" as const },
  { id: "BPS-2455", name: "Farai Dube", status: "Absent" as const },
  { id: "BPS-2456", name: "Nyasha Mhlanga", status: "Present" as const },
  { id: "BPS-2457", name: "Kudzai Mutasa", status: "Present" as const },
  { id: "BPS-2458", name: "Tariro Banda", status: "Present" as const },
];

type Status = "Present" | "Absent" | "Late";

const loadRoster = () => { try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : initialRoster; } catch { return initialRoster; } };
const saveRoster = (r: typeof initialRoster) => localStorage.setItem(STORAGE_KEY, JSON.stringify(r));

const AttendancePage = () => {
  const [roster, setRoster] = useState(loadRoster);
  const [selectedClass, setSelectedClass] = useState("form4a");

  useEffect(() => { saveRoster(roster); }, [roster]);

  const setStatus = (id: string, status: Status) => setRoster(r => r.map(s => s.id === id ? { ...s, status } : s));

  const present = roster.filter(s => s.status === "Present").length;
  const absent = roster.filter(s => s.status === "Absent").length;
  const late = roster.filter(s => s.status === "Late").length;
  const percent = Math.round((present / roster.length) * 100);

  const exportAttendance = () => {
    const content = "Student ID,Name,Status\n" + roster.map(s => `${s.id},${s.name},${s.status}`).join("\n");
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const saveAttendance = () => { saveRoster(roster); alert("Attendance saved!"); };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Attendance Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Mark daily attendance and review trends.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportAttendance}><Download className="h-4 w-4" /> Export</Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={saveAttendance}><Save className="h-4 w-4" /> Save Attendance</Button>
        </div>
      </motion.div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Present", value: present, icon: CheckCircle2, color: "from-green-500 to-green-400" },
          { label: "Absent", value: absent, icon: XCircle, color: "from-red-500 to-red-400" },
          { label: "Late", value: late, icon: AlertCircle, color: "from-orange-500 to-orange-400" },
          { label: "Class Avg", value: `${percent}%`, icon: Clock, color: "from-accent to-accent/70" },
        ].map(s => (
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
            <CardTitle className="font-heading text-lg font-semibold">Mark Attendance — Form 4A</CardTitle>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Class" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="form4a">Form 4A</SelectItem>
                <SelectItem value="form4b">Form 4B</SelectItem>
                <SelectItem value="form3a">Form 3A</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader><TableRow className="bg-muted/40"><TableHead>Student</TableHead><TableHead>ID</TableHead><TableHead className="text-right">Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {roster.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell><TableCell className="font-mono text-xs text-muted-foreground">{s.id}</TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-1">
                          {(["Present", "Late", "Absent"] as Status[]).map(st => (
                            <Button key={st} size="sm" variant={s.status === st ? "default" : "outline"} onClick={() => setStatus(s.id, st)} className={s.status === st ? (st === "Present" ? "bg-green-600 hover:bg-green-700" : st === "Late" ? "bg-orange-500 hover:bg-orange-600" : "bg-red-500 hover:bg-red-600") : ""}>{st}</Button>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
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