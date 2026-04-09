import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, DollarSign, Clock, Bell, TrendingUp, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "Total Students", value: "1,240", change: "+12%", icon: GraduationCap, gradient: "from-accent to-accent/70" },
  { label: "Total Teachers", value: "86", change: "+3%", icon: Users, gradient: "from-secondary to-secondary/70" },
  { label: "Active Classes", value: "42", change: "+5%", icon: BookOpen, gradient: "from-primary to-primary/70" },
  { label: "Fees Collected", value: "$45,200", change: "+18%", icon: DollarSign, gradient: "from-green-500 to-green-400" },
  { label: "Attendance Today", value: "94%", change: "-2%", icon: Clock, gradient: "from-orange-500 to-orange-400" },
  { label: "Announcements", value: "12", change: "+4", icon: Bell, gradient: "from-purple-500 to-purple-400" },
];

const recentActivity = [
  { text: "New student John Doe registered", time: "2 mins ago", dot: "bg-accent" },
  { text: "Fee payment received from Class 8A", time: "15 mins ago", dot: "bg-green-500" },
  { text: "Exam schedule published for Term 2", time: "1 hour ago", dot: "bg-secondary" },
  { text: "Teacher Ms. Moyo assigned to Grade 7", time: "3 hours ago", dot: "bg-purple-500" },
  { text: "Attendance report generated", time: "5 hours ago", dot: "bg-orange-500" },
];

const AdminDashboard = () => (
  <div className="space-y-6">
    {/* Header */}
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="font-heading text-2xl font-bold text-foreground">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Welcome back! Here's an overview of your school.</p>
    </motion.div>

    {/* Stats Grid */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
        >
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
              <div className="mt-1 flex items-center gap-1 text-xs font-medium text-green-600">
                <TrendingUp className="h-3 w-3" />
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>

    {/* Recent Activity */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <Card className="border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading text-lg font-semibold">Recent Activity</CardTitle>
          <button className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-colors">
            View all <ArrowUpRight className="h-3 w-3" />
          </button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-1.5 h-2 w-2 rounded-full ${item.dot} shrink-0`} />
                <div className="flex-1 min-w-0">
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
);

export default AdminDashboard;
