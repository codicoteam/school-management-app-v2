import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertCircle, Clock, Download } from "lucide-react";
import { motion } from "framer-motion";

const monthDays = Array.from({ length: 30 }, (_, i) => i + 1);
const dayStatus: Record<number, "present" | "absent" | "late" | "weekend" | "future"> = {};
monthDays.forEach(d => {
  const dow = (d + 1) % 7;
  if (dow === 0 || dow === 6) dayStatus[d] = "weekend";
  else if (d > 25) dayStatus[d] = "future";
  else if ([5, 18].includes(d)) dayStatus[d] = "absent";
  else if ([11].includes(d)) dayStatus[d] = "late";
  else dayStatus[d] = "present";
});

const recent = [
  { date: "Mon, 14 Apr", status: "Present" },
  { date: "Fri, 11 Apr", status: "Late", note: "Arrived at 08:25" },
  { date: "Thu, 10 Apr", status: "Present" },
  { date: "Wed, 09 Apr", status: "Present" },
  { date: "Tue, 08 Apr", status: "Present" },
  { date: "Mon, 07 Apr", status: "Absent", note: "Sick leave" },
];

const StudentAttendancePage = () => {
  const present = Object.values(dayStatus).filter(s => s === "present").length;
  const absent = Object.values(dayStatus).filter(s => s === "absent").length;
  const late = Object.values(dayStatus).filter(s => s === "late").length;
  const rate = Math.round(((present + late * 0.5) / (present + absent + late)) * 100);

  const downloadReport = () => {
    const content = `ATTENDANCE REPORT
================
Month: April 2025
Term: 2

Summary:
- Present: ${present} days
- Absent: ${absent} days
- Late: ${late} days
- Rate: ${rate}%

Recent Records:
${recent.map(r => `${r.date}: ${r.status}${r.note ? " (" + r.note + ")" : ""}`).join("\n")}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_report.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">My Attendance</h1>
          <p className="mt-1 text-sm text-muted-foreground">April 2025 — Term 2</p>
        </div>
        <Button variant="outline" onClick={downloadReport}><Download className="h-4 w-4" /> Export</Button>
      </motion.div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Present", value: present, icon: CheckCircle2, color: "from-primary to-primary/70" },
          { label: "Absent", value: absent, icon: XCircle, color: "from-accent to-accent/70" },
          { label: "Late", value: late, icon: AlertCircle, color: "from-secondary to-secondary/70" },
          { label: "Rate", value: `${rate}%`, icon: Clock, color: "from-accent to-accent/70" },
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
          <CardHeader><CardTitle className="font-heading text-lg font-semibold">Calendar — April</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={i} className="text-center text-xs font-medium text-muted-foreground">{d}</div>
              ))}
              {monthDays.map(d => (
                <div key={d} className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium ${
                  dayStatus[d] === "present" ? "bg-green-500/15 text-green-700" :
                  dayStatus[d] === "absent" ? "bg-red-500/15 text-red-700" :
                  dayStatus[d] === "late" ? "bg-orange-500/15 text-orange-700" :
                  dayStatus[d] === "weekend" ? "bg-muted/40 text-muted-foreground" :
                  "bg-muted/20 text-muted-foreground"
                }`}>
                  {dayStatus[d] !== "weekend" && dayStatus[d] !== "future" ? d : ""}
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-green-500/15" /> Present</span>
              <span className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-orange-500/15" /> Late</span>
              <span className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-red-500/15" /> Absent</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader><CardTitle className="font-heading text-lg font-semibold">Recent Records</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recent.map((r, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm">{r.date}</span>
                <Badge className={
                  r.status === "Present" ? "bg-primary/15 text-primary" :
                  r.status === "Late" ? "bg-secondary/15 text-secondary" :
                  "bg-accent/15 text-accent"
                }>{r.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentAttendancePage;