import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users, GraduationCap, BookOpen, DollarSign, TrendingUp, ArrowUpRight,
  UserPlus, UserCog, FileText, Megaphone,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { useNavigate } from "react-router-dom";

import { useAdminDashboardData } from "@/hooks/useAdminDashboardData";

const quickActions = [
  { label: "Add Student", icon: UserPlus, href: "/admin/students" },
  { label: "Add Teacher", icon: UserCog, href: "/admin/teachers" },
  { label: "Create Exam", icon: FileText, href: "/admin/exams" },
  { label: "Send Announcement", icon: Megaphone, href: "/admin/announcements" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: fbData, loading, error } = useAdminDashboardData();

  const stats = [
    { label: "Total Students", value: fbData.totalStudents.toLocaleString(), change: "+12%", icon: GraduationCap, gradient: "from-primary to-primary/70" },
    { label: "Total Teachers", value: fbData.totalTeachers.toLocaleString(), change: "+3%", icon: Users, gradient: "from-secondary to-secondary/70" },
    { label: "Total Classes", value: fbData.totalClasses.toLocaleString(), change: "+5%", icon: BookOpen, gradient: "from-accent to-accent/70" },
    { label: "Total Revenue", value: `$${fbData.totalRevenue.toLocaleString()}`, change: "+18%", icon: DollarSign, gradient: "from-primary/90 to-primary/60" },
  ];

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold text-destructive mb-4">Failed to Load Dashboard Data</h2>
          <p className="mb-4">Please check your connection and try again.</p>
          <Button onClick={() => window.location.reload()} className="btn-primary">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome back! Here's what's happening at School Management today.</p>
        {loading && <p className="text-[10px] text-accent animate-pulse mt-2">Loading dashboard data...</p>}
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

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
        <Card className="border-none shadow-md">
          <CardHeader><CardTitle className="font-heading text-lg font-semibold">Quick Actions</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((a) => (
                <Button key={a.label} variant="outline" onClick={() => navigate(a.href)} className="h-auto justify-start gap-3 border-border/60 bg-card py-3 hover:border-accent hover:bg-accent/5 hover:text-accent">
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

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-semibold">Student Enrollment</CardTitle>
              <p className="text-xs text-muted-foreground">Last 7 months</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={fbData.enrollmentTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Bar dataKey="students" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}>
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-semibold">Fee Collection (USD)</CardTitle>
              <p className="text-xs text-muted-foreground">Collected vs expected</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={fbData.feeCollectionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="expected" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                  <Line type="monotone" dataKey="collected" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ fill: "hsl(var(--accent))", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-lg font-semibold">Recent Activity</CardTitle>
            <button className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80 transition-colors">
              View all <ArrowUpRight className="h-3 w-3" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fbData.recentActivity.map((item, i) => (
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
};

export default AdminDashboard;
