import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ClipboardList, Clock, DollarSign } from "lucide-react";

const stats = [
  { label: "Child's Class", value: "Grade 8A", icon: GraduationCap, color: "text-accent" },
  { label: "Last Grade", value: "A-", icon: ClipboardList, color: "text-secondary" },
  { label: "Attendance", value: "98%", icon: Clock, color: "text-green-600" },
  { label: "Outstanding Fees", value: "$250", icon: DollarSign, color: "text-orange-500" },
];

const ParentDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Parent Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Monitor your child's learning journey.</p>
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

export default ParentDashboard;
