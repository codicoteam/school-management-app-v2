import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen, ClipboardList, Clock, DollarSign, Calendar, Bell, CheckCircle2, AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "Subjects", value: "8", icon: BookOpen, gradient: "from-accent to-accent/70" },
  { label: "Avg. Grade", value: "B+", icon: ClipboardList, gradient: "from-secondary to-secondary/70" },
  { label: "Attendance", value: "92%", icon: Clock, gradient: "from-green-500 to-green-400" },
  { label: "Fee Balance", value: "$120", icon: DollarSign, gradient: "from-orange-500 to-orange-400" },
];

const timetable = [
  { time: "08:00 — 08:45", subject: "Mathematics", room: "Rm 12", color: "bg-accent" },
  { time: "08:50 — 09:35", subject: "English", room: "Rm 7", color: "bg-secondary" },
  { time: "09:40 — 10:25", subject: "Shona", room: "Rm 4", color: "bg-purple-500" },
  { time: "10:45 — 11:30", subject: "Science", room: "Lab 2", color: "bg-green-500" },
  { time: "11:35 — 12:20", subject: "History", room: "Rm 9", color: "bg-orange-500" },
];

const assignments = {
  pending: [
    { title: "Algebra Problem Set 4", subject: "Mathematics", due: "Tomorrow" },
    { title: "Essay: My Hero", subject: "English", due: "Fri 18 Apr" },
  ],
  submitted: [
    { title: "Plant Cell Diagram", subject: "Science", grade: "A-" },
    { title: "Independence Essay", subject: "History", grade: "B+" },
  ],
};

const results = [
  { subject: "Mathematics", score: 78, color: "bg-accent" },
  { subject: "English", score: 85, color: "bg-secondary" },
  { subject: "Science", score: 89, color: "bg-green-500" },
  { subject: "Shona", score: 92, color: "bg-purple-500" },
];

const announcements = [
  { title: "Sports Day next Friday — wear house colours", time: "2 hours ago" },
  { title: "Library hours extended for exam prep", time: "1 day ago" },
  { title: "New uniform policy effective May 1", time: "3 days ago" },
];

const StudentDashboard = () => (
  <div className="space-y-6">
    {/* Greeting */}
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="overflow-hidden border-none shadow-md">
        <div className="relative bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-secondary/20 blur-2xl" />
          <div className="relative">
            <h1 className="font-heading text-2xl font-bold">Hi Tawanda 👋</h1>
            <p className="mt-1 text-sm text-primary-foreground/80">Form 4A · School Management · Today is Tuesday, 15 April</p>
          </div>
        </div>
      </Card>
    </motion.div>

    {/* Stats */}
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.06 }}>
          <Card className="relative overflow-hidden border-none shadow-md">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-[0.07]`} />
            <CardContent className="p-4">
              <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-sm`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>

    {/* Timetable + Assignments */}
    <div className="grid gap-4 lg:grid-cols-2">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
        <Card className="border-none shadow-md h-full">
          <CardHeader className="flex flex-row items-center gap-2">
            <Calendar className="h-5 w-5 text-accent" />
            <CardTitle className="font-heading text-lg font-semibold">Today's Timetable</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {timetable.map((t, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                <div className={`h-10 w-1 rounded-full ${t.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{t.subject}</p>
                  <p className="text-xs text-muted-foreground">{t.time} · {t.room}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
        <Card className="border-none shadow-md h-full">
          <CardHeader><CardTitle className="font-heading text-lg font-semibold">Assignments</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-600">
                <AlertCircle className="h-3.5 w-3.5" /> Pending
              </div>
              <div className="space-y-2">
                {assignments.pending.map((a, i) => (
                  <div key={i} className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
                    <p className="text-sm font-medium text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.subject} · Due {a.due}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-green-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> Submitted
              </div>
              <div className="space-y-2">
                {assignments.submitted.map((a, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.subject}</p>
                    </div>
                    <Badge className="bg-green-500/15 text-green-700 hover:bg-green-500/20">{a.grade}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>

    {/* Results + Announcements */}
    <div className="grid gap-4 lg:grid-cols-2">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}>
        <Card className="border-none shadow-md h-full">
          <CardHeader><CardTitle className="font-heading text-lg font-semibold">Latest Results</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {results.map((r, i) => (
              <div key={i}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{r.subject}</span>
                  <span className="text-sm font-semibold text-foreground">{r.score}%</span>
                </div>
                <Progress value={r.score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
        <Card className="border-none shadow-md h-full">
          <CardHeader className="flex flex-row items-center gap-2">
            <Bell className="h-5 w-5 text-secondary" />
            <CardTitle className="font-heading text-lg font-semibold">Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.map((a, i) => (
              <div key={i} className="rounded-lg bg-muted/40 p-3">
                <p className="text-sm font-medium text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{a.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  </div>
);

export default StudentDashboard;
