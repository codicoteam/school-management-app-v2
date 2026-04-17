import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BookOpen, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";

const classes = [
  { name: "Form 1A", teacher: "Mrs. Banda", students: 32, room: "Rm 1" },
  { name: "Form 1B", teacher: "Mr. Sibanda", students: 30, room: "Rm 2" },
  { name: "Form 2A", teacher: "Mrs. Moyo", students: 28, room: "Rm 7" },
  { name: "Form 2B", teacher: "Ms. Phiri", students: 31, room: "Rm 8" },
  { name: "Form 3A", teacher: "Mr. Sibanda", students: 27, room: "Rm 11" },
  { name: "Form 4A", teacher: "Mr. Mhlanga", students: 26, room: "Rm 15" },
];

const subjects = [
  { name: "Mathematics", teachers: 4, classes: 12, color: "bg-accent" },
  { name: "English", teachers: 3, classes: 12, color: "bg-secondary" },
  { name: "Science", teachers: 4, classes: 10, color: "bg-green-500" },
  { name: "Shona", teachers: 2, classes: 8, color: "bg-purple-500" },
  { name: "History", teachers: 2, classes: 6, color: "bg-orange-500" },
  { name: "Geography", teachers: 2, classes: 6, color: "bg-pink-500" },
];

const periods = ["08:00", "08:50", "09:40", "10:45", "11:35", "12:20"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const timetableSubjects = ["Math", "English", "Science", "Shona", "History", "Geography"];

const AcademicsPage = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Academic Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage classes, subjects, timetables and learning resources.</p>
      </div>
      <Button className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="h-4 w-4" /> New Class</Button>
    </motion.div>

    <Tabs defaultValue="classes" className="space-y-4">
      <TabsList className="bg-muted">
        <TabsTrigger value="classes">Classes</TabsTrigger>
        <TabsTrigger value="subjects">Subjects</TabsTrigger>
        <TabsTrigger value="timetable">Timetable</TabsTrigger>
      </TabsList>

      <TabsContent value="classes">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((c) => (
            <Card key={c.name} className="border-none shadow-md hover:shadow-lg transition">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-bold">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">Class teacher: {c.teacher}</p>
                  </div>
                  <Badge className="bg-accent/15 text-accent hover:bg-accent/20">{c.room}</Badge>
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {c.students} students</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="subjects">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => (
            <Card key={s.name} className="border-none shadow-md">
              <CardContent className="p-5">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${s.color}/15`}>
                  <BookOpen className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="font-heading text-base font-bold">{s.name}</h3>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{s.teachers} teachers</span>
                  <span>·</span>
                  <span>{s.classes} classes</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="timetable">
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            <CardTitle className="font-heading text-lg font-semibold">Form 4A — Weekly Timetable</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="px-2 py-2 text-left">Time</th>
                  {days.map((d) => <th key={d} className="px-2 py-2 text-left">{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {periods.map((p, i) => (
                  <tr key={p} className="border-b last:border-0">
                    <td className="py-2 px-2 font-medium text-muted-foreground">{p}</td>
                    {days.map((d) => (
                      <td key={d} className="py-2 px-2">
                        <div className="rounded-md bg-muted/40 px-2 py-1 text-xs font-medium">{timetableSubjects[(i + d.length) % timetableSubjects.length]}</div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
);

export default AcademicsPage;
