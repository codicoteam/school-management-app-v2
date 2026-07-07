import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users, BookOpen, FileText, Clock, TrendingUp, ArrowUpRight,
  CheckCircle, AlertCircle, Calendar, MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";

const stats = [
  { label: "Total Students", value: "245", change: "+2%", icon: Users, gradient: "from-accent to-accent/70" },
  { label: "Assigned Classes", value: "4", change: "0%", icon: BookOpen, gradient: "from-secondary to-secondary/70" },
  { label: "Pending Assignments", value: "8", change: "+3", icon: FileText, gradient: "from-primary to-primary/70" },
  { label: "Attendance Rate", value: "92%", change: "+5%", icon: Clock, gradient: "from-primary/90 to-primary/60" },
];

const todaysSchedule = [
  { time: "08:00 - 09:00", subject: "Mathematics", class: "Form 3A", room: "Room 201" },
  { time: "09:00 - 10:00", subject: "Physics", class: "Form 4B", room: "Lab 1" },
  { time: "10:30 - 11:30", subject: "Chemistry", class: "Form 4A", room: "Lab 2" },
  { time: "13:00 - 14:00", subject: "Biology", class: "Form 3B", room: "Lab 3" },
];

const announcements = [
  { title: "Mid-term Exams", message: "Mid-term examinations will begin on Monday, April 15th. Please ensure all students are prepared.", time: "2 hours ago", priority: "high" },
  { title: "Science Fair", message: "Science Fair registration is now open. Students can submit their projects by May 1st.", time: "1 day ago", priority: "medium" },
  { title: "Parent-Teacher Meeting", message: "Scheduled for next Friday. Please prepare student reports.", time: "2 days ago", priority: "medium" },
];

const assignmentData = [
  { subject: "Math", submitted: 22, total: 25 },
  { subject: "Physics", submitted: 18, total: 23 },
  { subject: "Chemistry", submitted: 20, total: 22 },
  { subject: "Biology", submitted: 19, total: 24 },
];

const quickActions = [
  { label: "Mark Attendance", icon: CheckCircle, href: "/teacher/attendance" },
  { label: "Create Assignment", icon: FileText, href: "/teacher/assignments" },
  { label: "Send Message", icon: MessageSquare, href: "/teacher/messages" },
  { label: "View Calendar", icon: Calendar, href: "/teacher/calendar" },
];

const TeacherDashboard = () => (
  <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground">Teacher Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome back! Here's your teaching overview for today.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.06 }}>
            <Card className="relative overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-[0.07]`} />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-sm`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <div className="mt-1 flex items-center gap-1 text-xs font-medium text-primary">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change} from last month
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Today's Schedule and Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-semibold">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todaysSchedule.map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-border/60 bg-card p-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{item.subject}</span>
                      <span className="text-xs text-muted-foreground">{item.class} • {item.room}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.time}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
          <Card className="border-none shadow-md">
            <CardHeader><CardTitle className="font-heading text-lg font-semibold">Quick Actions</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {quickActions.map((a) => (
                  <Button key={a.label} variant="outline" className="h-auto justify-start gap-3 border-border/60 bg-card py-3 hover:border-accent hover:bg-accent/5 hover:text-accent">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <a.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{a.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Assignment Submissions and Announcements */}
      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}>
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-semibold">Recent Assignment Submissions</CardTitle>
              <p className="text-xs text-muted-foreground">Last 7 days</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={assignmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="submitted" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="total" fill="hsl(var(--muted))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading text-lg font-semibold">Announcements</CardTitle>
              <button className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-colors">
                View all <ArrowUpRight className="h-3 w-3" />
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-1.5 h-2 w-2 rounded-full ${item.priority === 'high' ? 'bg-primary' : 'bg-secondary'} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground mb-1">{item.message}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );

export default TeacherDashboard;