import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Megaphone, AlertCircle, Calendar, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

const ParentAnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Array<any>>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const rows = await api.getAnnouncements();
        setAnnouncements(rows);
      } catch (error) {
        console.error(error);
      }
    };

    loadAnnouncements();
  }, []);

  const filtered = announcements.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) || a.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground">Announcements</h1>
        <p className="mt-1 text-sm text-muted-foreground">School updates, exam timetables and important notices.</p>
      </motion.div>

      <Card className="border-none shadow-md">
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search announcements..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filtered.map((a, i) => {
          const color =
            a.category === "Event" ? "from-accent to-accent/70" :
            a.category === "Finance" ? "from-primary to-primary/70" :
            a.category === "Policy" ? "from-secondary to-secondary/70" :
            "from-primary/80 to-primary/60";
          return (
            <motion.div key={a.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
              <Card className="border-none shadow-md hover:shadow-lg transition">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color}`}>
                      <a.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-semibold">{a.title}</h3>
                        <div className="flex items-center gap-2">
                          {a.isNew && <Badge className="bg-accent text-white">New</Badge>}
                          <Badge variant="outline" className="text-xs">{a.category}</Badge>
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{a.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <Card className="border-none shadow-md">
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              <Bell className="mx-auto mb-2 h-8 w-8 opacity-40" /> No announcements match your search.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ParentAnnouncementsPage;
