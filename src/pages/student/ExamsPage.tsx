import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ClipboardList, Trophy, Download, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const upcomingExams = [
  { name: "Mathematics Midterm", date: "22 Apr 2025", time: "09:00", venue: "Hall A", color: "bg-primary" },
  { name: "English Comprehension", date: "24 Apr 2025", time: "10:30", venue: "Rm 7", color: "bg-secondary" },
  { name: "Science Practical", date: "26 Apr 2025", time: "08:30", venue: "Lab 2", color: "bg-accent" },
];

const results = [
  { subject: "Mathematics", score: 78, grade: "B+", position: 8 },
  { subject: "English", score: 85, grade: "A-", position: 5 },
  { subject: "Science", score: 89, grade: "A", position: 3 },
  { subject: "Shona", score: 92, grade: "A", position: 2 },
  { subject: "History", score: 74, grade: "B", position: 12 },
  { subject: "Geography", score: 81, grade: "A-", position: 7 },
];

const trend = [
  { term: "T1 2024", avg: 72 }, { term: "T2 2024", avg: 76 },
  { term: "T3 2024", avg: 79 }, { term: "T1 2025", avg: 83 },
];

const StudentExamsPage = () => {
  const overallAvg = (results.reduce((s, r) => s + r.score, 0) / results.length).toFixed(1);
  const [selectedTerm, setSelectedTerm] = useState("all");

  const downloadReport = () => {
    const content = `STUDENT EXAM REPORT
================
Term: 1 2025
Overall Average: ${overallAvg}%
Class Position: 5th

Subject Results:
${results.map(r => `${r.subject}: ${r.score}% (Grade: ${r.grade}, Position: ${r.position})`).join("\n")}

Trend:
${trend.map(t => `${t.term}: ${t.avg}%`).join("\n")}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `exam_report_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Exams & Results</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your exam timetable, marks and class position.</p>
        </div>
        <Button variant="outline" onClick={downloadReport}><Download className="h-4 w-4" /> Download Report</Button>
      </motion.div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Overall Avg", value: `${overallAvg}%`, color: "from-primary to-primary/70", icon: ClipboardList },
          { label: "Class Position", value: "5th", color: "from-secondary to-secondary/70", icon: Trophy },
          { label: "Subjects", value: results.length, color: "from-accent to-accent/70", icon: ClipboardList },
          { label: "Upcoming", value: upcomingExams.length, color: "from-primary/80 to-primary/60", icon: Calendar },
        ].map(s => (
          <Card key={s.label} className="relative overflow-hidden border-none shadow-md">
            <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-[0.08]`} />
            <CardContent className="relative flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color}`}><s.icon className="h-5 w-5 text-white" /></div>
              <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-xl font-bold">{s.value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="results" className="space-y-4">
        <TabsList className="bg-muted"><TabsTrigger value="results">My Results</TabsTrigger><TabsTrigger value="timetable">Upcoming</TabsTrigger><TabsTrigger value="trend">Trend</TabsTrigger></TabsList>
        
        <TabsContent value="results">
          <Card className="border-none shadow-md">
            <CardContent className="p-4 lg:p-6">
              <Table>
                <TableHeader><TableRow className="bg-muted/40"><TableHead>Subject</TableHead><TableHead>Score</TableHead><TableHead>Grade</TableHead><TableHead>Position</TableHead></TableRow></TableHeader>
                <TableBody>
                  {results.map(r => (
                    <TableRow key={r.subject}>
                      <TableCell className="font-medium">{r.subject}</TableCell>
                      <TableCell><Progress value={r.score} className="h-2 w-20" /><span className="text-sm">{r.score}%</span></TableCell>
                      <TableCell><Badge className="bg-accent/15 text-accent">{r.grade}</Badge></TableCell>
                      <TableCell>#{r.position}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timetable">
          <Card className="border-none shadow-md">
            <CardContent className="p-4 lg:p-6">
              <div className="space-y-3">
                {upcomingExams.map(e => (
                  <div key={e.name} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg ${e.color} flex items-center justify-center`}><Calendar className="h-5 w-5 text-white" /></div>
                      <div><p className="font-medium">{e.name}</p><p className="text-xs text-muted-foreground">{e.date} · {e.time}</p></div>
                    </div>
                    <Badge variant="outline">{e.venue}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trend">
          <Card className="border-none shadow-md">
            <CardHeader><CardTitle>Performance Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="term" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="avg" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ fill: "hsl(var(--accent))", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentExamsPage;