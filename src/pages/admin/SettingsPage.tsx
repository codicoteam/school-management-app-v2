import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Shield, Database, Bell, User } from "lucide-react";
import { motion } from "framer-motion";

const users = [
  { name: "Mrs. Patience Ncube", email: "principal@burney.zw", role: "Admin" },
  { name: "Mr. Kudzai Hove", email: "bursar@burney.zw", role: "Finance" },
  { name: "Mrs. Tariro Banda", email: "registrar@burney.zw", role: "Registrar" },
  { name: "Mr. Tendai Mhlanga", email: "tmhlanga@burney.zw", role: "Teacher" },
];

const audit = [
  { who: "Mrs. Patience Ncube", what: "Updated fee structure for Form 5-6", when: "10 mins ago" },
  { who: "Mr. Kudzai Hove", what: "Recorded payment $760 for BPS-2451", when: "1 hour ago" },
  { who: "System", what: "Daily backup completed (2.4 GB)", when: "6 hours ago" },
  { who: "Mrs. Tariro Banda", what: "Added new student BPS-2461", when: "Yesterday" },
];

const SettingsPage = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="font-heading text-2xl font-bold text-foreground">System Administration</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage school settings, users, backups and audit logs.</p>
    </motion.div>

    <Tabs defaultValue="general" className="space-y-4">
      <TabsList className="bg-muted">
        <TabsTrigger value="general"><SettingsIcon className="h-4 w-4" /> General</TabsTrigger>
        <TabsTrigger value="users"><User className="h-4 w-4" /> Users</TabsTrigger>
        <TabsTrigger value="security"><Shield className="h-4 w-4" /> Security</TabsTrigger>
        <TabsTrigger value="audit"><Database className="h-4 w-4" /> Audit</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card className="border-none shadow-md">
          <CardHeader><CardTitle className="font-heading text-lg font-semibold">School Profile</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div><Label>School Name</Label><Input defaultValue="Burney Place School" /></div>
            <div><Label>Motto</Label><Input defaultValue="Knowledge · Discipline · Excellence" /></div>
            <div><Label>Address</Label><Input defaultValue="123 Borrowdale Rd, Harare, Zimbabwe" /></div>
            <div><Label>Phone</Label><Input defaultValue="+263 242 333 100" /></div>
            <div><Label>Email</Label><Input defaultValue="info@burney.zw" /></div>
            <div><Label>Currency</Label><Input defaultValue="USD" /></div>
            <div className="md:col-span-2 flex justify-end"><Button className="bg-accent text-accent-foreground hover:bg-accent/90">Save Changes</Button></div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="users">
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-lg font-semibold">User Accounts</CardTitle>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Add User</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {users.map((u) => (
                <div key={u.email} className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-xs font-bold text-primary-foreground">
                    {u.name.split(" ").slice(-2).map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <Badge className="bg-accent/15 text-accent hover:bg-accent/20">{u.role}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="security">
        <Card className="border-none shadow-md">
          <CardHeader><CardTitle className="font-heading text-lg font-semibold">Security & Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: Shield, label: "Two-factor authentication", desc: "Require 2FA for all admin accounts", enabled: true },
              { icon: Database, label: "Automatic daily backups", desc: "Run at 02:00 every day", enabled: true },
              { icon: Bell, label: "Email notifications", desc: "Send important alerts to admin email", enabled: true },
              { icon: Bell, label: "SMS alerts to parents", desc: "Send SMS for urgent announcements", enabled: false },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent"><s.icon className="h-4 w-4" /></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
                <Switch defaultChecked={s.enabled} />
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="audit">
        <Card className="border-none shadow-md">
          <CardHeader><CardTitle className="font-heading text-lg font-semibold">Audit Log</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {audit.map((a, i) => (
                <div key={i} className="flex items-start gap-3 border-l-2 border-accent/30 pl-3">
                  <div className="flex-1">
                    <p className="text-sm"><span className="font-medium">{a.who}</span> <span className="text-muted-foreground">— {a.what}</span></p>
                    <p className="text-xs text-muted-foreground">{a.when}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
);

export default SettingsPage;
