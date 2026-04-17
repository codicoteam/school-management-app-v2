import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Calendar, GraduationCap, User, Heart, Pencil } from "lucide-react";
import { motion } from "framer-motion";

const ProfilePage = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="font-heading text-2xl font-bold text-foreground">My Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">Your personal and academic details.</p>
    </motion.div>

    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
      <Card className="overflow-hidden border-none shadow-md">
        <div className="relative h-32 bg-gradient-to-br from-primary to-primary/80">
          <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-secondary/20 blur-2xl" />
        </div>
        <CardContent className="-mt-12 px-6 pb-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-card bg-gradient-to-br from-accent to-accent/70 text-3xl font-bold text-white shadow-lg">
                TN
              </div>
              <div className="pb-1">
                <h2 className="font-heading text-2xl font-bold">Tawanda Ndlovu</h2>
                <p className="text-sm text-muted-foreground">Form 4A · Burney Place School</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge className="bg-accent/15 text-accent hover:bg-accent/20">BPS-2451</Badge>
                  <Badge className="bg-green-500/15 text-green-700 hover:bg-green-500/20">Active</Badge>
                  <Badge className="bg-secondary/30 text-secondary-foreground hover:bg-secondary/40">House: Mbira</Badge>
                </div>
              </div>
            </div>
            <Button variant="outline"><Pencil className="h-4 w-4" /> Edit Profile</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-none shadow-md">
        <CardHeader className="flex flex-row items-center gap-2">
          <User className="h-5 w-5 text-accent" />
          <CardTitle className="font-heading text-lg font-semibold">Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { icon: Calendar, label: "Date of Birth", value: "12 March 2009" },
            { icon: User, label: "Gender", value: "Male" },
            { icon: Heart, label: "Blood Group", value: "O+" },
            { icon: MapPin, label: "Address", value: "45 Borrowdale Rd, Harare" },
            { icon: Mail, label: "Email", value: "tawanda.ndlovu@burney.zw" },
            { icon: Phone, label: "Phone", value: "+263 77 333 4455" },
          ].map((d) => (
            <div key={d.label} className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent"><d.icon className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{d.label}</p>
                <p className="text-sm font-medium truncate">{d.value}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardHeader className="flex flex-row items-center gap-2">
          <GraduationCap className="h-5 w-5 text-secondary" />
          <CardTitle className="font-heading text-lg font-semibold">Academic Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: "Class", value: "Form 4A" },
            { label: "Stream", value: "Sciences" },
            { label: "Class Teacher", value: "Mr. Tendai Mhlanga" },
            { label: "Admission Date", value: "15 January 2022" },
            { label: "Subjects", value: "8 enrolled" },
            { label: "Current GPA", value: "3.4 / 4.0" },
          ].map((d) => (
            <div key={d.label} className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
              <span className="text-sm text-muted-foreground">{d.label}</span>
              <span className="text-sm font-semibold">{d.value}</span>
            </div>
          ))}
          <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary-foreground">Parent / Guardian</p>
            <p className="mt-1 text-sm font-medium">Mrs. Nomsa Ndlovu</p>
            <p className="text-xs text-muted-foreground">+263 77 555 8888 · n.ndlovu@gmail.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default ProfilePage;
