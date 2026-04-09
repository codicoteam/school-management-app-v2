import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ClipboardList, Clock, DollarSign, TrendingUp, Bell } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "Child's Class", value: "Grade 8A", icon: GraduationCap, gradient: "from-accent to-accent/70" },
  { label: "Last Grade", value: "A-", icon: ClipboardList, gradient: "from-secondary to-secondary/70" },
  { label: "Attendance", value: "98%", icon: Clock, gradient: "from-green-500 to-green-400" },
  { label: "Outstanding Fees", value: "$250", icon: DollarSign, gradient: "from-orange-500 to-orange-400" },
];

const performanceTrend = [
  { term: "Term 1", grade: "B+", position: "12th" },
  { term: "Term 2", grade: "A-", position: "8th" },
  { term: "Term 3", grade: "A", position: "5th" },
];

const recentAlerts = [
  { text: "Report card for Term 2 is now available", time: "1 hour ago", dot: "bg-accent" },
  { text: "Fee payment of $150 received", time: "2 days ago", dot: "bg-green-500" },
  { text: "Parent-teacher meeting on April 20", time: "3 days ago", dot: "bg-secondary" },
];

const ParentDashboard = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="font-heading text-2xl font-bold text-foreground">Parent Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Monitor your child's learning journey.</p>
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
      {/* Performance Trend */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
        <Card className="border-none shadow-md h-full">
          <CardHeader className="flex flex-row items-center gap-2">
            <TrendingUp className="h-5 w-5 text-accent" />
            <CardTitle className="font-heading text-lg font-semibold">Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performanceTrend.map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <span className="text-sm font-medium text-foreground">{item.term}</span>
                  <div className="flex items-center gap-4">
                    <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">{item.grade}</span>
                    <span className="text-xs text-muted-foreground">Position: {item.position}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Alerts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
        <Card className="border-none shadow-md h-full">
          <CardHeader className="flex flex-row items-center gap-2">
            <Bell className="h-5 w-5 text-secondary" />
            <CardTitle className="font-heading text-lg font-semibold">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-1.5 h-2 w-2 rounded-full ${item.dot} shrink-0`} />
                  <div>
                    <p className="text-sm text-foreground">{item.text}</p>
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

export default ParentDashboard;
