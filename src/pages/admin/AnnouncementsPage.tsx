import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Megaphone, Send, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getAnnouncements, createAnnouncement, deleteAnnouncement, type AnnouncementRecord } from "@/lib/announcementsApi";

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, reset } = useForm<{ title: string; message: string }>();

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const records = await getAnnouncements();
      setAnnouncements(records);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const onSend = async (data: { title: string; message: string }) => {
    setSending(true);
    try {
      const created = await createAnnouncement(data);
      setAnnouncements(prev => [created, ...prev]);
      toast.success("Announcement sent!");
      reset();
    } catch (error: any) {
      console.error("Error sending announcement:", error);
      toast.error(error?.message || "Failed to send announcement");
    } finally {
      setSending(false);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteAnnouncement(id);
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      toast.success("Announcement deleted");
    } catch (error: any) {
      console.error("Error deleting announcement:", error);
      toast.error(error?.message || "Failed to delete announcement");
    }
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
              <Textarea placeholder="Write your announcement..." rows={5} {...register("message", { required: true })} />
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={sending}>
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send Announcement
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md lg:col-span-2">
          <CardHeader><CardTitle className="font-heading text-lg font-semibold">Sent Announcements</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
            ) : announcements.length === 0 ? (
              <p className="py-10 text-center text-sm italic text-muted-foreground">No announcements yet.</p>
            ) : (
              announcements.map((a) => (
                <div key={a.id} className="rounded-lg border border-border bg-card p-4 hover:border-accent/40 hover:shadow transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground">{a.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{a.message}</p>
                    </div>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => onDelete(a.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  {a.created_at && (
                    <div className="mt-3 text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
