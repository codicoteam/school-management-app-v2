import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Megaphone, Send, Users, GraduationCap, UserCog } from "lucide-react";
import { motion } from "framer-motion";

const sent = [
  { id: 1, title: "Sports Day next Friday", body: "All learners must wear house colours. Parents are welcome from 09:00.", audience: "All", date: "2 hours ago", reach: 1240 },
  { id: 2, title: "Term 2 fees reminder", body: "Outstanding balances are due by 30 April. Please use EcoCash code 12345.", audience: "Parents", date: "1 day ago", reach: 892 },
  { id: 3, title: "Staff briefing — Monday 07:30", body: "All teachers are required to attend in the staff room.", audience: "Teachers", date: "2 days ago", reach: 45 },
  { id: 4, title: "New uniform policy effective May 1", body: "Refer to the school website for full details and supplier list.", audience: "All", date: "3 days ago", reach: 1240 },
];

const AnnouncementsPage = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
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
          <Input placeholder="Title" />
          <Textarea placeholder="Write your announcement..." rows={5} />
          <Select>
            <SelectTrigger><SelectValue placeholder="Audience" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Everyone</SelectItem>
              <SelectItem value="parents">Parents only</SelectItem>
              <SelectItem value="students">Students only</SelectItem>
              <SelectItem value="teachers">Teachers only</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90"><Send className="h-4 w-4" /> Send Announcement</Button>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md lg:col-span-2">
        <CardHeader><CardTitle className="font-heading text-lg font-semibold">Sent Announcements</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {sent.map((a) => (
            <div key={a.id} className="rounded-lg border border-border bg-card p-4 hover:border-accent/40 hover:shadow transition">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
                </div>
                <Badge className={
                  a.audience === "All" ? "bg-accent/15 text-accent hover:bg-accent/20" :
                  a.audience === "Parents" ? "bg-secondary/30 text-secondary-foreground hover:bg-secondary/40" :
                  a.audience === "Teachers" ? "bg-purple-500/15 text-purple-700 hover:bg-purple-500/20" :
                  "bg-green-500/15 text-green-700 hover:bg-green-500/20"
                }>
                  {a.audience === "All" ? <Users className="h-3 w-3" /> : a.audience === "Parents" ? <Users className="h-3 w-3" /> : a.audience === "Teachers" ? <UserCog className="h-3 w-3" /> : <GraduationCap className="h-3 w-3" />}
                  {a.audience}
                </Badge>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span>{a.date}</span>
                <span>·</span>
                <span>Reached {a.reach.toLocaleString()} recipients</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);

export default AnnouncementsPage;
