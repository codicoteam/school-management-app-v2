import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Megaphone, Send, Users, GraduationCap, UserCog, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

interface Announcement {
  id: number;
  title: string;
  body: string;
  audience: string;
  date: string;
  reach: number;
}

const STORAGE_KEY = "school_announcements";

const initialAnnouncements: Announcement[] = [
  { id: 1, title: "Sports Day next Friday", body: "All learners must wear house colours. Parents are welcome from 09:00.", audience: "All", date: "2 hours ago", reach: 1240 },
  { id: 2, title: "Term 2 fees reminder", body: "Outstanding balances are due by 30 April. Please use EcoCash code 12345.", audience: "Parents", date: "1 day ago", reach: 892 },
  { id: 3, title: "Staff briefing — Monday 07:30", body: "All teachers are required to attend in the staff room.", audience: "Teachers", date: "2 days ago", reach: 45 },
  { id: 4, title: "New uniform policy effective May 1", body: "Refer to the school website for full details and supplier list.", audience: "All", date: "3 days ago", reach: 1240 },
];

const loadAnnouncements = (): Announcement[] => {
  try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : initialAnnouncements; } catch { return initialAnnouncements; }
};
const saveAnnouncements = (a: Announcement[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(a));

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(loadAnnouncements);
  const [audience, setAudience] = useState("All");
  const { register, handleSubmit, reset } = useForm<{ title: string; body: string }>();

  useEffect(() => { saveAnnouncements(announcements); }, [announcements]);

  const onSend = (data: { title: string; body: string }) => {
    const newAnnouncement: Announcement = {
      id: Date.now(),
      title: data.title,
      body: data.body,
      audience,
      date: "Just now",
      reach: audience === "All" ? 1240 : audience === "Parents" ? 892 : audience === "Teachers" ? 45 : 358,
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    reset();
  };

  const deleteAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  const getAudienceIcon = (aud: string) => {
    if (aud === "All") return <Users className="h-3 w-3" />;
    if (aud === "Parents") return <Users className="h-3 w-3" />;
    if (aud === "Teachers") return <UserCog className="h-3 w-3" />;
    return <GraduationCap className="h-3 w-3" />;
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground">Communication</h1>
        <p className="mt-1 text-sm text-muted-foreground">Send announcements to parents, students and staff.</p>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-none shadow-md lg:col-span-1">
          <CardHeader className="flex flex-row items-center gap-2">
            <Megaphone className="h-5 w-5 text-accent" />
            <CardTitle className="font-heading text-lg font-semibold">New Announcement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <form onSubmit={handleSubmit(onSend)} className="space-y-3">
              <Input placeholder="Title" {...register("title", { required: true })} />
              <Textarea placeholder="Write your announcement..." rows={5} {...register("body", { required: true })} />
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger><SelectValue placeholder="Audience" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Everyone</SelectItem>
                  <SelectItem value="Parents">Parents only</SelectItem>
                  <SelectItem value="Students">Students only</SelectItem>
                  <SelectItem value="Teachers">Teachers only</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90"><Send className="h-4 w-4" /> Send Announcement</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md lg:col-span-2">
          <CardHeader><CardTitle className="font-heading text-lg font-semibold">Sent Announcements</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="rounded-lg border border-border bg-card p-4 hover:border-accent/40 hover:shadow transition">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground">{a.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={a.audience === "All" ? "bg-accent/15 text-accent" : a.audience === "Parents" ? "bg-secondary/30" : a.audience === "Teachers" ? "bg-purple-500/15 text-purple-700" : "bg-green-500/15 text-green-700"}>
                      {getAudienceIcon(a.audience)}{a.audience}
                    </Badge>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteAnnouncement(a.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{a.date}</span><span>·</span><span>Reached {a.reach.toLocaleString()} recipients</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnnouncementsPage;