import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ClipboardList, Clock, DollarSign, Calendar, Bell } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "My Subjects", value: "8", icon: BookOpen, gradient: "from-accent to-accent/70" },
  { label: "Avg. Grade", value: "B+", icon: ClipboardList, gradient: "from-secondary to-secondary/70" },
  { label: "Attendance", value: "96%", icon: Clock, gradient: "from-green-500 to-green-400" },
  { label: "Fee Balance", value: "$120", icon: DollarSign, gradient: "from-orange-500 to-orange-400" },
];

const upcoming = [
  { subject: "Mathematics", type: "Test", date: "Mon, 14 Apr", color: "bg-accent" },
  { subject: "English", type: "Assignment Due", date: "Wed, 16 Apr", color: "bg-secondary" },
  { subject: "Science", type: "Lab Practical", date: "Fri, 18 Apr", color: "bg-green-500" },
];

const announcements = [
  { title: "Sports Day next Friday", time: "2 hours ago" },
  { title: "Library hours extended for exam prep", time: "1 day ago" },
  { title: "New uniform policy effective May 1", time: "3 days ago" },
];

const StudentDashboard = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="font-heading text-2xl font-bold text-foreground">Student Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Welcome back! Here's your academic overview.</p>
    </motion.div>

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
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>

    <div className="grid gap-4 lg:grid-cols-2">
      {/* Upcoming */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
        <Card className="border-none shadow-md h-full">
          <CardHeader className="flex flex-row items-center gap-2">
            <Calendar className="h-5 w-5 text-accent" />
            <CardTitle className="font-heading text-lg font-semibold">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcoming.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <div className={`h-2 w-2 rounded-full ${item.color} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.subject}</p>
                    <p className="text-xs text-muted-foreground">{item.type}</p>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{item.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Announcements */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
        <Card className="border-none shadow-md h-full">
          <CardHeader className="flex flex-row items-center gap-2">
            <Bell className="h-5 w-5 text-secondary" />
            <CardTitle className="font-heading text-lg font-semibold">Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {announcements.map((item, i) => (
                <div key={i} className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  </div>
);

export default StudentDashboard;
