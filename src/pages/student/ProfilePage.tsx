import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Calendar, GraduationCap, User, Heart, Pencil, Save, Send } from "lucide-react";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const [editOpen, setEditOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "Tawanda Ndlovu",
    dob: "2009-03-12",
    gender: "Male",
    blood: "O+",
    address: "45 Borrowdale Rd, Harare",
    email: "tawanda.ndlovu@burney.zw",
    phone: "+263 77 333 4455",
    guardian: "Mrs. Nomsa Ndlovu",
    guardianPhone: "+263 77 555 8888",
    guardianEmail: "n.ndlovu@gmail.com"
  });

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setEditOpen(false);
    alert("Profile updated successfully!");
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">My Profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your personal and academic details.</p>
        </div>
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogTrigger asChild><Button variant="outline"><Pencil className="h-4 w-4" /> Edit Profile</Button></DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader><DialogTitle>Edit Profile</DialogTitle><DialogDescription>Update your personal details.</DialogDescription></DialogHeader>
            <form onSubmit={saveProfile} className="grid gap-4 py-4">
              <div className="grid gap-2"><Label>Full Name</Label><Input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} /></div>
              <div className="grid gap-2"><Label>Date of Birth</Label><Input type="date" value={profile.dob} onChange={e => setProfile({...profile, dob: e.target.value})} /></div>
              <div className="grid gap-2"><Label>Address</Label><Input value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} /></div>
              <div className="grid gap-2"><Label>Email</Label><Input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} /></div>
              <div className="grid gap-2"><Label>Phone</Label><Input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} /></div>
              <h3 className="font-medium pt-2">Guardian Details</h3>
              <div className="grid gap-2"><Label>Guardian Name</Label><Input value={profile.guardian} onChange={e => setProfile({...profile, guardian: e.target.value})} /></div>
              <div className="grid gap-2"><Label>Guardian Phone</Label><Input value={profile.guardianPhone} onChange={e => setProfile({...profile, guardianPhone: e.target.value})} /></div>
              <DialogFooter><Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button><Button type="submit"><Save className="h-4 w-4 mr-2" /> Save Changes</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden border-none shadow-md">
          <div className="h-32 bg-gradient-to-br from-primary to-primary/80">
            <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-secondary/20 blur-2xl" />
          </div>
          <CardContent className="pt-6 px-6 pb-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="flex items-end gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-accent to-accent/70 text-3xl font-bold text-white shadow-lg">
                  {profile.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="pb-1">
                  <h2 className="font-heading text-2xl font-bold">{profile.name}</h2>
                  <p className="text-sm text-muted-foreground">Form 4A · Burney Place School</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge className="bg-accent/15 text-accent">BPS-2451</Badge>
                    <Badge className="bg-green-500/15 text-green-700">Active</Badge>
                    <Badge className="bg-secondary/30">House: Mbira</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center gap-2"><User className="h-5 w-5 text-accent" /><CardTitle>Personal Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { icon: Calendar, label: "Date of Birth", value: profile.dob },
              { icon: User, label: "Gender", value: profile.gender },
              { icon: Heart, label: "Blood Group", value: profile.blood },
              { icon: MapPin, label: "Address", value: profile.address },
              { icon: Mail, label: "Email", value: profile.email },
              { icon: Phone, label: "Phone", value: profile.phone },
            ].map(d => (
              <div key={d.label} className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent"><d.icon className="h-4 w-4" /></div>
                <div className="flex-1 min-w-0"><p className="text-xs text-muted-foreground">{d.label}</p><p className="text-sm font-medium truncate">{d.value}</p></div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center gap-2"><GraduationCap className="h-5 w-5 text-secondary" /><CardTitle>Academic Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Class", value: "Form 4A" },
              { label: "Stream", value: "Sciences" },
              { label: "Class Teacher", value: "Mr. Tendai Mhlanga" },
              { label: "Admission Date", value: "15 January 2022" },
              { label: "Subjects", value: "8 enrolled" },
              { label: "Current GPA", value: "3.4 / 4.0" },
            ].map(d => (
              <div key={d.label} className="flex items-center justify-between rounded-lg bg-muted/40 p-3"><span className="text-sm text-muted-foreground">{d.label}</span><span className="text-sm font-semibold">{d.value}</span></div>
            ))}
            <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-secondary-foreground">Parent / Guardian</p>
              <p className="mt-1 text-sm font-medium">{profile.guardian}</p>
              <p className="text-xs text-muted-foreground">{profile.guardianPhone} · {profile.guardianEmail}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;