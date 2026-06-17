import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, BookOpen, Calendar, FileText, Image, Video, Music } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

const subjects = [
  { name: "Mathematics", teacher: "Mr. Mhlanga", code: "MATH401", color: "bg-accent" },
  { name: "English", teacher: "Mrs. Moyo", code: "ENG401", color: "bg-secondary" },
  { name: "Combined Science", teacher: "Mr. Dube", code: "SCI401", color: "bg-green-500" },
  { name: "Shona", teacher: "Mrs. Banda", code: "SHO401", color: "bg-purple-500" },
  { name: "History", teacher: "Mr. Sibanda", code: "HIS401", color: "bg-orange-500" },
  { name: "Geography", teacher: "Ms. Phiri", code: "GEO401", color: "bg-pink-500" },
  { name: "Religious Studies", teacher: "Mrs. Ncube", code: "REL401", color: "bg-indigo-500" },
  { name: "Physical Education", teacher: "Mr. Hove", code: "PE401", color: "bg-cyan-500" },
];

const periods = [
  { time: "08:00 — 08:45" }, { time: "08:50 — 09:35" }, { time: "09:40 — 10:25" },
  { time: "10:45 — 11:30" }, { time: "11:35 — 12:20" }, { time: "13:00 — 13:45" },
];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const grid = [
  ["Math", "English", "Science", "Shona", "History"],
  ["English", "Math", "Geography", "Science", "Shona"],
  ["Science", "Shona", "Math", "English", "RE"],
  ["History", "Geography", "English", "Math", "PE"],
   ["Geography", "PE", "Shona", "RE", "Science"],
   ["RE", "Science", "History", "Geography", "Math"],
   ["RE", "Science", "History", "Geography", "Math"],
];

const AcademicsPage = () => {
  const [learningMaterials, setLearningMaterials] = useState<Array<{
    name: string;
    subject: string;
    size: string;
    type: 'pdf' | 'image' | 'video' | 'document' | 'audio';
  }>>([]);
  const [loading, setLoading] = useState(false);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Music className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const downloadMaterial = (m: typeof learningMaterials[0]) => {
    const content = `LEARNING MATERIAL\n==================\nSubject: ${m.subject}\nFile: ${m.name}\nSize: ${m.size}\n\nNote: This is a sample content for ${m.name}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${m.name.replace(/[^a-z0-9]/gi, "_")}.txt`;
    a.click();
  };

  const downloadTimetable = () => {
    let content = "WEEKLY TIMETABLE\n================\n\n";
    grid.forEach((row, i) => {
      content += `${periods[i].time}: ${row.join(" | ")}\n`;
    });
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my_timetable.txt";
    a.click();
  };

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const resources = await api.getResources();
      // Transform resources to match the materials format
      const materialsData = resources.map((r: { name: string; subject: string; size: string; type: 'pdf' | 'image' | 'video' | 'document' | 'audio' }) => ({
        name: r.name,
        subject: r.subject,
        size: r.size,
        type: r.type
      }));
      setLearningMaterials(materialsData);
    } catch (error) {
      console.error('Failed to load materials:', error);
      // Keep empty array as fallback
      setLearningMaterials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground">Timetable & Subjects</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your subjects, weekly schedule and learning materials.</p>
      </motion.div>

      <Tabs defaultValue="timetable" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="timetable"><Calendar className="h-4 w-4 mr-2" /> Timetable</TabsTrigger>
          <TabsTrigger value="subjects"><BookOpen className="h-4 w-4 mr-2" /> Subjects</TabsTrigger>
          <TabsTrigger value="materials"><FileText className="h-4 w-4 mr-2" /> Materials</TabsTrigger>
        </TabsList>

        <TabsContent value="timetable">
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Weekly Timetable</CardTitle>
              <Button size="sm" variant="outline" onClick={downloadTimetable}><Download className="h-4 w-4 mr-2" /> Export</Button>
            </CardHeader>
            <CardContent className="overflow-x-auto p-4 lg:p-6">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b text-xs text-muted-foreground">
                    <th className="px-2 py-2 text-left">Time</th>
                    {days.map(d => <th key={d} className="px-2 py-2 text-left">{d}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {periods.map((p, i) => (
                    <tr key={p.time} className="border-b last:border-0">
                      <td className="py-2 px-2 font-medium text-muted-foreground">{p.time}</td>
                      {grid[i].map((subj, j) => (
                        <td key={j} className="py-2 px-2">
                          <div className="rounded-md bg-accent/10 px-2 py-1.5 text-xs font-medium text-accent">{subj}</div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map(s => (
              <Card key={s.code} className="border-none shadow-md hover:shadow-lg transition">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color} text-white`}><BookOpen className="h-5 w-5" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.teacher}</p>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">{s.code}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

         <TabsContent value="materials">
           <Card className="border-none shadow-md">
             <CardContent className="p-4 lg:p-6 space-y-2">
               {loading ? (
                 <div className="text-center py-8">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                   <p className="text-muted-foreground">Loading materials...</p>
                 </div>
                ) : (
                  <>
                    {learningMaterials.length > 0 ? (
                      learningMaterials.map((m, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                            {getFileIcon(m.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{m.name}</p>
                            <p className="text-xs text-muted-foreground">{m.subject} · {m.size}</p>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => downloadMaterial(m)}>
                            <Download className="h-4 w-4 mr-2" /> Download
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No learning materials available</p>
                        {learningMaterials.length === 0 && !loading && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Teachers haven't uploaded any resources yet.
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
             </CardContent>
           </Card>
          </TabsContent>
       </Tabs>
     </div>
    );
};

export default AcademicsPage;
