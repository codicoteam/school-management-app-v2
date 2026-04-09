import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, BookOpen, DollarSign, Clock, Bell } from "lucide-react";

const stats = [
  { label: "Total Students", value: "1,240", icon: GraduationCap, color: "text-accent" },
  { label: "Total Teachers", value: "86", icon: Users, color: "text-secondary" },
  { label: "Active Classes", value: "42", icon: BookOpen, color: "text-primary" },
  { label: "Fees Collected", value: "$45,200", icon: DollarSign, color: "text-green-600" },
  { label: "Attendance Today", value: "94%", icon: Clock, color: "text-orange-500" },
  { label: "Announcements", value: "12", icon: Bell, color: "text-purple-500" },
];

const AdminDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Welcome back! Here's an overview of your school.</p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default AdminDashboard;
