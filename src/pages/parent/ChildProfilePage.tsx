import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mail, Phone, MessageSquare, GraduationCap, Calendar, BookOpen, Heart, MapPin, Edit } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useState } from "react";

const subjects = [
  { name: "Mathematics", teacher: "Mr. Mhlanga", grade: "B+", progress: 78 },
  { name: "English", teacher: "Mrs. Moyo", grade: "A-", progress: 85 },
  { name: "Science", teacher: "Mr. Dube", grade: "A", progress: 89 },
  { name: "Shona", teacher: "Mrs. Banda", grade: "A", progress: 92 },
];

const ChildProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [child, setChild] = useState<any>(null);
  const [msgOpen, setMsgOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadChild = async () => {
      if (!user || user.role !== 'parent') return;
      try {
        const children = await api.getParentChildren(user.id);
        setChild(children?.[0] ?? null);
      } catch (error) {
        console.error(error);
      }
    };

    loadChild();
  }, [user]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMsgOpen(false);
    setMessage("");
    alert("Message sent to Mr. Mhlanga (Class Teacher)!");
  };

  const profile = child ?? {
    name: 'Tawanda Ndlovu',
    class: 'Form 4A',
    id: 'BPS-2451',
    gender: 'M',
    date_of_birth: '12 March 2009',
    blood_group: 'O+',
    address: '45 Borrowdale Rd, Harare',
    email: 'tawanda.ndlovu@schoolmanagement.edu',
    teacher: 'Mr. Mhlanga · +263 77 234 5678',
    admissionDate: '15 January 2022',
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground">Child Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tawanda's academic and personal information.</p>
      </motion.div>

      <Card className="overflow-hidden border-none shadow-md">
        <div className="h-32 bg-gradient-to-br from-primary to-primary/80">
          <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-secondary/20 blur-2xl" />
        </div>
        <CardContent className="pt-6 px-6 pb-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-card bg-gradient-to-br from-accent to-accent/70 text-3xl font-bold text-white shadow-lg">
                TN
              </div>
              <div className="pb-1">
                <h2 className="font-heading text-2xl font-bold">{profile.name}</h2>
                <p className="text-sm text-muted-foreground">{profile.class} · School Management</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge className="bg-accent/15 text-accent">{profile.id}</Badge>
                  <Badge className="bg-green-500/15 text-green-700">92% Attendance</Badge>
                  <Badge className="bg-secondary/30 text-secondary-foreground">House: Mbira</Badge>
                </div>
              </div>
            </div>
            <Dialog open={msgOpen} onOpenChange={setMsgOpen}>
              <DialogTrigger asChild>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <MessageSquare className="h-4 w-4" /> Message Class Teacher
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Message Class Teacher</DialogTitle><DialogDescription>Send a message to Mr. Mhlanga (Class Teacher)</DialogDescription></DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Subject</Label>
                    <Input placeholder="Message subject" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Message</Label>
                    <Textarea placeholder="Type your message..." value={message} onChange={e => setMessage(e.target.value)} rows={4} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setMsgOpen(false)}>Cancel</Button>
                  <Button onClick={sendMessage}><MessageSquare className="h-4 w-4 mr-2" /> Send Message</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center gap-2">
            <GraduationCap className="h-5 w-5 text-accent" />
            <CardTitle className="font-heading text-lg font-semibold">Academic Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjects.map(s => (
              <div key={s.name}>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.teacher}</p>
                  </div>
                  <Badge className="bg-accent/15 text-accent">{s.grade}</Badge>
                </div>
                <Progress value={s.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center gap-2">
            <BookOpen className="h-5 w-5 text-secondary" />
            <CardTitle className="font-heading text-lg font-semibold">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { icon: Calendar, label: "Date of Birth", value: profile.date_of_birth },
              { icon: Heart, label: "Blood Group", value: profile.blood_group },
              { icon: MapPin, label: "Home Address", value: profile.address },
              { icon: Mail, label: "School Email", value: profile.email },
              { icon: Phone, label: "Class Teacher", value: profile.teacher },
              { icon: Calendar, label: "Admission Date", value: profile.admissionDate },
            ].map(d => (
              <div key={d.label} className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/20 text-secondary-foreground"><d.icon className="h-4 w-4" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground">{d.label}</p>
                  <p className="text-sm font-medium truncate">{d.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChildProfilePage;