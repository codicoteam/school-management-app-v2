import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Megaphone, Trophy, Calendar, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const announcements = [
  { id: 1, title: "Sports Day next Friday — wear house colours", body: "All learners are required to wear their house colours. Parents and guardians are warmly welcome from 09:00.", category: "Event", icon: Trophy, time: "2 hours ago", isNew: true },
  { id: 2, title: "Library hours extended for exam prep", body: "The library will now be open until 18:00 on weekdays from now until end of term.", category: "Notice", icon: Megaphone, time: "1 day ago", isNew: true },
  { id: 3, title: "Term 2 fees due by 30 April", body: "Please ensure all outstanding balances are cleared by the deadline to avoid late penalties.", category: "Finance", icon: AlertCircle, time: "2 days ago", isNew: false },
  { id: 4, title: "New uniform policy effective May 1", body: "From 1 May, all learners must wear the new approved blazer. Refer to the school website for the supplier list.", category: "Policy", icon: Megaphone, time: "3 days ago", isNew: false },
  { id: 5, title: "Mid-term break: 5–9 May", body: "School will be closed for the mid-term break. Classes resume on Monday 12 May.", category: "Event", icon: Calendar, time: "5 days ago", isNew: false },
];

const StudentAnnouncementsPage = () => {
  const [search, setSearch] = useState("");
  const filtered = announcements.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) || a.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground">Announcements</h1>
        <p className="mt-1 text-sm text-muted-foreground">Stay updated with the latest from school.</p>
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
              <Bell className="mx-auto mb-2 h-8 w-8 opacity-40" />
              No announcements match your search.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentAnnouncementsPage;
