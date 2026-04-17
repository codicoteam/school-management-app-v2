import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";

const monthDays = Array.from({ length: 30 }, (_, i) => i + 1);
// Realistic mock — mostly present, a few absent/late
const dayStatus: Record<number, "present" | "absent" | "late" | "weekend" | "future"> = {};
monthDays.forEach((d) => {
  const dow = (d + 1) % 7; // arbitrary
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

const StudentAttendancePage = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="font-heading text-2xl font-bold text-foreground">My Attendance</h1>
      <p className="mt-1 text-sm text-muted-foreground">April 2025 — Term 2</p>
    </motion.div>

    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
      {[
        { label: "Present", value: 19, icon: CheckCircle2, color: "from-green-500 to-green-400" },
        { label: "Absent", value: 2, icon: XCircle, color: "from-red-500 to-red-400" },
        { label: "Late", value: 1, icon: AlertCircle, color: "from-orange-500 to-orange-400" },
        { label: "Rate", value: "92%", icon: Clock, color: "from-accent to-accent/70" },
      ].map((s) => (
        <Card key={s.label} className="relative overflow-hidden border-none shadow-md">
          <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-[0.08]`} />
          <CardContent className="relative flex items-center gap-3 p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color}`}>
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold">{s.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="border-none shadow-md lg:col-span-2">
        <CardHeader><CardTitle className="font-heading text-lg font-semibold">Calendar — April</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1.5 text-center">
            {["S","M","T","W","T","F","S"].map((d) => (
              <div key={d} className="text-xs font-semibold text-muted-foreground">{d}</div>
            ))}
            {monthDays.map((d) => {
              const s = dayStatus[d];
              const cls =
                s === "present" ? "bg-green-500/15 text-green-700 border-green-500/30" :
                s === "absent" ? "bg-red-500/15 text-red-700 border-red-500/30" :
                s === "late" ? "bg-orange-500/15 text-orange-700 border-orange-500/30" :
                s === "weekend" ? "bg-muted/40 text-muted-foreground border-transparent" :
                "bg-muted/20 text-muted-foreground/40 border-transparent";
              return (
                <div key={d} className={`aspect-square rounded-md border text-xs font-medium flex items-center justify-center ${cls}`}>
                  {d}
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Present</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> Late</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Absent</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" /> Weekend</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardHeader><CardTitle className="font-heading text-lg font-semibold">Term Progress</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Attendance rate</span>
              <span className="font-semibold">92%</span>
            </div>
            <Progress value={92} className="h-2" />
          </div>
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
            <p className="text-sm font-medium">You're doing great! 🎉</p>
            <p className="mt-1 text-xs text-muted-foreground">Keep your attendance above 90% to qualify for the term award.</p>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Recent days</p>
            <div className="space-y-2">
              {recent.map((r) => (
                <div key={r.date} className="flex items-center justify-between gap-2 rounded-md bg-muted/40 px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{r.date}</p>
                    {r.note && <p className="text-[10px] text-muted-foreground">{r.note}</p>}
                  </div>
                  <Badge className={
                    r.status === "Present" ? "bg-green-500/15 text-green-700 hover:bg-green-500/20" :
                    r.status === "Late" ? "bg-orange-500/15 text-orange-700 hover:bg-orange-500/20" :
                    "bg-red-500/15 text-red-700 hover:bg-red-500/20"
                  }>{r.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default StudentAttendancePage;
