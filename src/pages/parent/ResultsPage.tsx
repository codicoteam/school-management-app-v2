import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Trophy, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

const ResultsPage = () => {
  const { user } = useAuth();
  const [child, setChild] = useState<any>(null);
  const [results, setResults] = useState<Array<any>>([]);
  const [trend, setTrend] = useState<Array<any>>([]);

  useEffect(() => {
    const loadResults = async () => {
      if (!user || user.role !== "parent") return;

      try {
        const children = await api.getParentChildren(user.id);
        const selectedChild = children?.[0] ?? null;
        setChild(selectedChild);

        if (selectedChild?.id) {
          const report = await api.getStudentReport(selectedChild.id);
          const trendData = await api.getStudentGradesTrend(selectedChild.id);

          setResults((report?.grades || []).map((grade: any) => ({
            subject: grade.subject || "Unknown",
            score: Number(grade.score || 0),
            grade: grade.grade || "-",
            teacher: grade.teacher || "Teacher",
          })));

          setTrend((trendData || []).map((item: any, index: number) => ({
            term: item.term || item.examName || `Term ${index + 1}`,
            avg: Number(item.average || item.avg || 0),
            position: item.position || index + 1,
          })));
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadResults();
  }, [user]);

  const displayResults = results.length > 0 ? results : [
    { subject: "Mathematics", score: 78, grade: "B+", teacher: "Mr. Mhlanga" },
    { subject: "English", score: 85, grade: "A-", teacher: "Mrs. Moyo" },
    { subject: "Science", score: 89, grade: "A", teacher: "Mr. Dube" },
    { subject: "Shona", score: 92, grade: "A", teacher: "Mrs. Banda" },
  ];

  const displayTrend = trend.length > 0 ? trend : [
    { term: "T1 2024", avg: 72, position: 14 },
    { term: "T2 2024", avg: 76, position: 11 },
    { term: "T3 2024", avg: 79, position: 8 },
    { term: "T1 2025", avg: 83, position: 5 },
  ];

  const overall = displayResults.length > 0 ? (displayResults.reduce((sum, item) => sum + item.score, 0) / displayResults.length).toFixed(1) : "0.0";

  const downloadReport = () => {
    const content = `REPORT CARD\n============\nStudent: ${child?.name ?? "Student"}\nClass: ${child?.class ?? "Unknown"}\nOverall Average: ${overall}%\n\nSubject Results:\n${displayResults.map((r) => `${r.subject}: ${r.score}% (Grade: ${r.grade}) - Teacher: ${r.teacher}`).join("\n")}\n\nPerformance Trend:\n${displayTrend.map((t) => `${t.term}: ${t.avg}% (Position: #${t.position})`).join("\n")}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report_card.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Results & Performance</h1>
          <p className="mt-1 text-sm text-muted-foreground">{child?.name ?? "Student"} · {child?.class ?? "Class"} · Latest report</p>
        </div>
        <Button variant="outline" onClick={downloadReport}><Download className="h-4 w-4 mr-2" /> Download Report Card</Button>
      </motion.div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Overall Avg", value: `${overall}%`, icon: TrendingUp, color: "from-accent to-accent/70" },
          { label: "Class Position", value: "5th", icon: Trophy, color: "from-secondary to-secondary/70" },
          { label: "Best Subject", value: `${displayResults[0]?.subject ?? "N/A"} (${displayResults[0]?.score ?? 0}%)`, icon: Award, color: "from-green-500 to-green-400" },
          { label: "Improvement", value: "+11pts", icon: TrendingUp, color: "from-purple-500 to-purple-400" },
        ].map((item) => (
          <Card key={item.label} className="relative overflow-hidden border-none shadow-md">
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-[0.08]`} />
            <CardContent className="relative flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.color}`}><item.icon className="h-5 w-5 text-white" /></div>
              <div className="min-w-0"><p className="text-xs text-muted-foreground">{item.label}</p><p className="text-lg font-bold truncate">{item.value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="subjects" className="space-y-4">
        <TabsList className="bg-muted"><TabsTrigger value="subjects">By Subject</TabsTrigger><TabsTrigger value="trend">Performance Trend</TabsTrigger></TabsList>

        <TabsContent value="subjects">
          <Card className="border-none shadow-md">
            <CardContent className="space-y-4 p-4 lg:p-6">
              {displayResults.map((result) => (
                <div key={result.subject}>
                  <div className="mb-1.5 flex items-center justify-between gap-3">
                    <div className="min-w-0"><p className="text-sm font-medium">{result.subject}</p><p className="text-xs text-muted-foreground">Teacher: {result.teacher}</p></div>
                    <div className="flex items-center gap-3"><Badge className="bg-accent/15 text-accent">{result.grade}</Badge><span className="w-12 text-right text-sm font-semibold">{result.score}%</span></div>
                  </div>
                  <Progress value={result.score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trend">
          <Card className="border-none shadow-md">
            <CardHeader><CardTitle>Average over time</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={displayTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="term" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="avg" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ fill: "hsl(var(--accent))", r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {displayTrend.map((entry) => (
                  <div key={entry.term} className="rounded-lg bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground">{entry.term}</p>
                    <p className="font-bold">{entry.avg}% <span className="text-xs font-normal">· #{entry.position}</span></p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResultsPage;
