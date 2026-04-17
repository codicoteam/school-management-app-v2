import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, AlertCircle, Clock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const monthly = [
  { month: "Jan", rate: 95 }, { month: "Feb", rate: 93 },
  { month: "Mar", rate: 96 }, { month: "Apr", rate: 92 },
];

const recent = [
  { date: "Mon, 14 Apr", status: "Present", note: "All classes attended" },
  { date: "Fri, 11 Apr", status: "Late", note: "Arrived at 08:25 — minor issue" },
  { date: "Thu, 10 Apr", status: "Present" },
  { date: "Wed, 09 Apr", status: "Present" },
  { date: "Tue, 08 Apr", status: "Present" },
  { date: "Mon, 07 Apr", status: "Absent", note: "Excused — sick leave (medical note submitted)" },
];

const ParentAttendancePage = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="font-heading text-2xl font-bold text-foreground">Attendance Overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">Monitoring Tawanda's school attendance.</p>
    </motion.div>

    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
      {[
        { label: "Present (Apr)", value: 19, icon: CheckCircle2, color: "from-green-500 to-green-400" },
        { label: "Absent", value: 2, icon: XCircle, color: "from-red-500 to-red-400" },
        { label: "Late", value: 1, icon: AlertCircle, color: "from-orange-500 to-orange-400" },
        { label: "Term Rate", value: "92%", icon: Clock, color: "from-accent to-accent/70" },
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

    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-none shadow-md">
        <CardHeader className="flex flex-row items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          <CardTitle className="font-heading text-lg font-semibold">Monthly Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[80, 100]} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="rate" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 rounded-lg border border-green-500/20 bg-green-500/5 p-3">
            <p className="text-sm font-medium">Excellent attendance 🌟</p>
            <p className="mt-1 text-xs text-muted-foreground">Tawanda is on track for the term attendance award (≥90%).</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardHeader><CardTitle className="font-heading text-lg font-semibold">Recent Days</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {recent.map((r) => (
            <div key={r.date} className="flex items-start justify-between gap-3 rounded-lg bg-muted/40 p-3">
              <div className="min-w-0">
                <p className="text-sm font-medium">{r.date}</p>
                {r.note && <p className="mt-0.5 text-xs text-muted-foreground">{r.note}</p>}
              </div>
              <Badge className={
                r.status === "Present" ? "bg-green-500/15 text-green-700 hover:bg-green-500/20" :
                r.status === "Late" ? "bg-orange-500/15 text-orange-700 hover:bg-orange-500/20" :
                "bg-red-500/15 text-red-700 hover:bg-red-500/20"
              }>{r.status}</Badge>
            </div>
          ))}
          <div className="pt-2">
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-muted-foreground">Term progress</span>
              <span className="font-semibold">92%</span>
            </div>
            <Progress value={92} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default ParentAttendancePage;
