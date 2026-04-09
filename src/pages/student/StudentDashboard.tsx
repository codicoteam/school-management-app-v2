import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ClipboardList, Clock, DollarSign, Bell, User } from "lucide-react";

const stats = [
  { label: "My Subjects", value: "8", icon: BookOpen, color: "text-accent" },
  { label: "Avg. Grade", value: "B+", icon: ClipboardList, color: "text-secondary" },
  { label: "Attendance", value: "96%", icon: Clock, color: "text-green-600" },
  { label: "Fee Balance", value: "$120", icon: DollarSign, color: "text-orange-500" },
];

const StudentDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Student Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Welcome back! Here's your academic overview.</p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

export default StudentDashboard;
