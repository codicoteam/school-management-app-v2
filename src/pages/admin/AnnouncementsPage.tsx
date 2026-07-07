import { useState, useEffect } from "react";
import { api } from "@/lib/api";
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
  id: string;
  title: string;
  body: string;
  audience: string;
  date: string;
  reach: number;
}

const getAudienceLabel = (type: string) => {
  if (type === 'parents') return 'Parents';
  if (type === 'students') return 'Students';
  if (type === 'teachers') return 'Teachers';
  return 'All';
};

const mapAnnouncement = (row: any): Announcement => ({
  id: row.id,
  title: row.title,
  body: row.body || row.message,
  audience: getAudienceLabel(row.type || 'general'),
  date: row.created_at ? new Date(row.created_at).toLocaleString() : 'Just now',
  reach: row.type === 'teachers' ? 45 : row.type === 'parents' ? 892 : 1240,
});

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [audience, setAudience] = useState('All');
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm<{ title: string; body: string }>();

  useEffect(() => {
    const loadAnnouncements = async () => {
      setLoading(true);
      try {
        const rows = await api.getAnnouncements();
        setAnnouncements((rows || []).map(mapAnnouncement));
      } catch (error) {
        console.error('Error loading announcements:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAnnouncements();
  }, []);

  const onSend = async (data: { title: string; body: string }) => {
    try {
      await api.createAnnouncement({ title: data.title, body: data.body, audience });
      const rows = await api.getAnnouncements();
      setAnnouncements((rows || []).map(mapAnnouncement));
      reset();
      setAudience('All');
    } catch (error) {
      console.error('Error creating announcement:', error);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      await api.deleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
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
              <Input placeholder="Title" {...register('title', { required: true })} />
              <Textarea placeholder="Write your announcement..." rows={5} {...register('body', { required: true })} />
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
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading announcements...</p>
            ) : announcements.length === 0 ? (
              <p className="text-sm text-muted-foreground">No announcements yet.</p>
            ) : announcements.map((a) => (
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