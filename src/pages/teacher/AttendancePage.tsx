import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Calendar } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const AttendancePage = () => {
  const [selectedClass, setSelectedClass] = useState("Form 3A");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  const classes = ["Form 3A", "Form 4A", "Form 4B"];
  
  const students = [
    { id: "1", name: "Alice Johnson", rollNo: "001" },
    { id: "2", name: "Bob Smith", rollNo: "002" },
    { id: "3", name: "Charlie Brown", rollNo: "003" },
    { id: "4", name: "Diana Wilson", rollNo: "004" },
    { id: "5", name: "Edward Davis", rollNo: "005" },
    { id: "6", name: "Fiona Green", rollNo: "006" },
    { id: "7", name: "George Harris", rollNo: "007" },
  ];

  const attendanceStats = [
    { date: "Mon", present: 35, absent: 5 },
    { date: "Tue", present: 36, absent: 4 },
    { date: "Wed", present: 34, absent: 6 },
    { date: "Thu", present: 37, absent: 3 },
    { date: "Fri", present: 35, absent: 5 },
  ];

  const toggleAttendance = (studentId: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const absentCount = students.length - presentCount;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground">Attendance Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">Mark and track student attendance</p>
      </motion.div>

      {/* Date and Class Selection */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <Card className="border-none shadow-md">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map(cls => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Attendance Marking */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="lg:col-span-2">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Mark Attendance - {selectedClass}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {students.map((student, i) => (
                  <div key={student.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:bg-muted/50 transition">
                    <Checkbox
                      id={student.id}
                      checked={attendance[student.id] || false}
                      onCheckedChange={() => toggleAttendance(student.id)}
                      className="h-5 w-5"
                    />
                    <label htmlFor={student.id} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{student.name}</span>
                        <span className="text-xs text-muted-foreground">({student.rollNo})</span>
                      </div>
                    </label>
                    {attendance[student.id] ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AttendancePage;
