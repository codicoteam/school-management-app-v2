import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Shield, Database, Bell, User, Loader2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { doc, setDoc, getDoc, collection, getDocs, query, orderBy, limit, addDoc, serverTimestamp } from "firebase/firestore";
import { db, firebaseConfig } from "@/lib/firebase";
import { toast } from "sonner";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signOut as secondarySignOut } from "firebase/auth";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  createdAt?: any;
}

interface AuditLog {
  id: string;
  who: string;
  what: string;
  when: string;
  timestamp?: any;
}

const SettingsPage = () => {
  // General Profile State
  const [profile, setProfile] = useState({
    schoolName: "School Management",
    motto: "Knowledge · Discipline · Excellence",
    address: "123 Borrowdale Rd, Harare, Zimbabwe",
    phone: "+263 242 333 100",
    email: "info@School Managementhigh.edu",
    currency: "USD"
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  // Security Toggles
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: true,
    dailyBackups: true,
    emailNotifications: true,
    smsAlerts: false
  });
  const [loadingSecurity, setLoadingSecurity] = useState(true);

  // Users State
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [addingUser, setAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "teacher"
  });

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(true);

  // 1. Load Data on Mount
  useEffect(() => {
    fetchProfile();
    fetchSecurity();
    fetchUsers();
    fetchAuditLogs();
  }, []);

  const fetchProfile = async () => {
    try {
      const docRef = doc(db, "system", "profile");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as any);
      } else {
        // Initialize default profile document if not exists
        await setDoc(docRef, profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchSecurity = async () => {
    try {
      const docRef = doc(db, "system", "security");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSecuritySettings(docSnap.data() as any);
      } else {
        // Initialize default security doc if not exists
        await setDoc(docRef, securitySettings);
      }
    } catch (error) {
      console.error("Error fetching security:", error);
    } finally {
      setLoadingSecurity(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const usersCol = collection(db, "users");
      const q = query(usersCol, orderBy("role"), limit(50));
      const querySnapshot = await getDocs(q);
      const fetchedUsers: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        fetchedUsers.push(doc.data() as UserProfile);
      });

      // If we don't have users in DB yet, show fallback mock data
      if (fetchedUsers.length === 0) {
        setUsers([
          { uid: "mock-1", name: "Mrs. Patience Ncube", email: "principal@School Managementhigh.edu", role: "admin" },
          { uid: "mock-2", name: "Mr. Kudzai Hove", email: "bursar@School Managementhigh.edu", role: "teacher" },
          { uid: "mock-3", name: "Mrs. Tariro Banda", email: "registrar@School Managementhigh.edu", role: "parent" },
          { uid: "mock-4", name: "Mr. Tendai Mhlanga", email: "tmhlanga@School Managementhigh.edu", role: "teacher" },
        ]);
      } else {
        setUsers(fetchedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      // Fallback
      setUsers([
        { uid: "mock-1", name: "Mrs. Patience Ncube", email: "principal@School Managementhigh.edu", role: "admin" },
        { uid: "mock-2", name: "Mr. Kudzai Hove", email: "bursar@School Managementhigh.edu", role: "teacher" },
        { uid: "mock-3", name: "Mrs. Tariro Banda", email: "registrar@School Managementhigh.edu", role: "parent" },
        { uid: "mock-4", name: "Mr. Tendai Mhlanga", email: "tmhlanga@School Managementhigh.edu", role: "teacher" },
      ]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const auditCol = collection(db, "auditLogs");
      const q = query(auditCol, orderBy("timestamp", "desc"), limit(20));
      const querySnapshot = await getDocs(q);
      const logs: AuditLog[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        logs.push({
          id: doc.id,
          who: data.who,
          what: data.what,
          when: data.timestamp ? new Date(data.timestamp.toDate()).toLocaleTimeString() + " - " + new Date(data.timestamp.toDate()).toLocaleDateString() : "Just now"
        });
      });

      if (logs.length === 0) {
        setAuditLogs([
          { id: "1", who: "Mrs. Patience Ncube", what: "Updated fee structure for Form 5-6", when: "10 mins ago" },
          { id: "2", who: "Mr. Kudzai Hove", what: "Recorded payment $760 for BPS-2451", when: "1 hour ago" },
          { id: "3", who: "System", what: "Daily backup completed (2.4 GB)", when: "6 hours ago" },
          { id: "4", who: "Mrs. Tariro Banda", what: "Added new student BPS-2461", when: "Yesterday" },
        ]);
      } else {
        setAuditLogs(logs);
      }
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      setAuditLogs([
        { id: "1", who: "System", what: "Audit logs initialized", when: "Just now" }
      ]);
    } finally {
      setLoadingAudit(false);
    }
  };

  // 2. Event Handlers
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await setDoc(doc(db, "system", "profile"), profile);
      await addAuditLog("Admin", `Updated system school profile settings`);
      toast.success("School profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update school profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleToggleSecurity = async (key: keyof typeof securitySettings, val: boolean) => {
    const updated = { ...securitySettings, [key]: val };
    setSecuritySettings(updated);
    try {
      await setDoc(doc(db, "system", "security"), updated);
      await addAuditLog("Admin", `Toggled security setting (${key}) to ${val}`);
      toast.success("Security setting updated!");
    } catch (error) {
      console.error("Error updating security setting:", error);
      toast.error("Failed to update security setting");
    }
  };

  const addAuditLog = async (who: string, what: string) => {
    try {
      await addDoc(collection(db, "auditLogs"), {
        who,
        what,
        timestamp: serverTimestamp()
      });
      fetchAuditLogs();
    } catch (e) {
      console.error("Failed to write audit log:", e);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.fullName.trim() || !newUser.email.trim() || !newUser.password) {
      toast.error("Please fill all fields.");
      return;
    }
    if (newUser.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setAddingUser(true);
    let secondaryApp;
    try {
      // 1. Initialize a secondary firebase app to register user without signing out the admin
      const tempAppName = `temp-user-${Date.now()}`;
      secondaryApp = initializeApp(firebaseConfig, tempAppName);
      const secondaryAuth = getAuth(secondaryApp);

      // 2. Create the credentials on secondary app instance
      const credential = await createUserWithEmailAndPassword(
        secondaryAuth,
        newUser.email,
        newUser.password
      );

      // 3. Send email verification
      await sendEmailVerification(credential.user);

      // 4. Save the user record in Firestore shared database
      await setDoc(doc(db, "users", credential.user.uid), {
        uid: credential.user.uid,
        name: newUser.fullName.trim(),
        email: newUser.email,
        role: newUser.role,
        createdAt: serverTimestamp(),
      });

      // 5. Clean up secondary auth session
      await secondarySignOut(secondaryAuth);
      
      // 6. Complete and document inside audit log
      await addAuditLog("Admin", `Registered new user account: ${newUser.fullName} (${newUser.role})`);
      
      toast.success(`User Account for ${newUser.fullName} created successfully! Verification email sent.`);
      setIsAddUserOpen(false);
      setNewUser({ fullName: "", email: "", password: "", role: "teacher" });
      fetchUsers();
    } catch (error: any) {
      console.error("Error creating user:", error);
      const errorMap: Record<string, string> = {
        "auth/email-already-in-use": "This email is already registered.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/weak-password": "Password is too weak. Use at least 6 characters.",
      };
      toast.error(errorMap[error?.code] || error?.message || "Failed to create user account.");
    } finally {
      if (secondaryApp) {
        await deleteApp(secondaryApp);
      }
      setAddingUser(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground">System Administration</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage school settings, user accounts, security, and audit logs.</p>
      </motion.div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="general"><SettingsIcon className="h-4 w-4 mr-2" /> General</TabsTrigger>
          <TabsTrigger value="users"><User className="h-4 w-4 mr-2" /> Users</TabsTrigger>
          <TabsTrigger value="security"><Shield className="h-4 w-4 mr-2" /> Security</TabsTrigger>
          <TabsTrigger value="audit"><Database className="h-4 w-4 mr-2" /> Audit Logs</TabsTrigger>
        </TabsList>

        {/* ── GENERAL PROFILE TAB ── */}
        <TabsContent value="general">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-semibold">School Profile</CardTitle>
              <CardDescription>Configure key parameters and identity details for the school portal.</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingProfile ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input 
                      id="schoolName" 
                      value={profile.schoolName} 
                      onChange={(e) => setProfile({ ...profile, schoolName: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="motto">Motto / Slogan</Label>
                    <Input 
                      id="motto" 
                      value={profile.motto} 
                      onChange={(e) => setProfile({ ...profile, motto: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      value={profile.address} 
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact Phone</Label>
                    <Input 
                      id="phone" 
                      value={profile.phone} 
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Public Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profile.email} 
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">System Currency</Label>
                    <Input 
                      id="currency" 
                      value={profile.currency} 
                      onChange={(e) => setProfile({ ...profile, currency: e.target.value })} 
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button 
                      onClick={handleSaveProfile} 
                      disabled={savingProfile}
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      {savingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── USER ACCOUNTS TAB ── */}
        <TabsContent value="users">
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-heading text-lg font-semibold">User Accounts</CardTitle>
                <CardDescription>Manage application user credentials and role structures.</CardDescription>
              </div>
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 flex gap-2">
                    <Plus className="h-4 w-4" /> Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleCreateUser}>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                      <DialogDescription>
                        Create a secure credential for school staff, parents, or students. An email verification will be sent.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={newUser.fullName}
                          onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                          placeholder="e.g. John Doe"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="newUserEmail">Email Address</Label>
                        <Input
                          id="newUserEmail"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          placeholder="e.g. j.doe@School Managementhigh.edu"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="newUserPassword">Temporary Password</Label>
                        <Input
                          id="newUserPassword"
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          placeholder="Min 6 characters"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="newUserRole">Access Group / Role</Label>
                        <select
                          id="newUserRole"
                          value={newUser.role}
                          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="admin">Administrator</option>
                          <option value="teacher">Teacher</option>
                          <option value="parent">Parent</option>
                          <option value="student">Student</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        disabled={addingUser}
                        className="bg-accent text-accent-foreground hover:bg-accent/90 w-full"
                      >
                        {addingUser ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" /> Creating app account...
                          </span>
                        ) : "Register Account"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {loadingUsers ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
              ) : (
                <div className="space-y-2">
                  {users.map((u) => (
                    <div key={u.uid} className="flex items-center gap-3 rounded-lg bg-muted/40 p-3 hover:bg-muted/65 transition-colors">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-xs font-bold text-primary-foreground uppercase">
                        {u.name ? u.name.split(" ").slice(-2).map((n) => n[0]).join("") : "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{u.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                      </div>
                      <Badge className="bg-accent/15 text-accent hover:bg-accent/20 capitalize">{u.role}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── SECURITY TAB ── */}
        <TabsContent value="security">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-semibold">Security & Configurations</CardTitle>
              <CardDescription>Customize authentication constraints, automatic procedures, and push notifications.</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingSecurity ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent"><Shield className="h-4 w-4" /></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Require Multi-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground">Force administrators and teachers to verify their identity with a mobile code.</p>
                    </div>
                    <Switch 
                      checked={securitySettings.twoFactor} 
                      onCheckedChange={(checked) => handleToggleSecurity("twoFactor", checked)} 
                    />
                  </div>

                  <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent"><Database className="h-4 w-4" /></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Automatic Backups</p>
                      <p className="text-xs text-muted-foreground">Run daily backups of Firestore databases automatically at 02:00 UTC.</p>
                    </div>
                    <Switch 
                      checked={securitySettings.dailyBackups} 
                      onCheckedChange={(checked) => handleToggleSecurity("dailyBackups", checked)} 
                    />
                  </div>

                  <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent"><Bell className="h-4 w-4" /></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Administrative Email Alerts</p>
                      <p className="text-xs text-muted-foreground">Notify primary admins by email for unauthorized access attempts or system updates.</p>
                    </div>
                    <Switch 
                      checked={securitySettings.emailNotifications} 
                      onCheckedChange={(checked) => handleToggleSecurity("emailNotifications", checked)} 
                    />
                  </div>

                  <div className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent"><Bell className="h-4 w-4" /></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Emergency SMS Notifications</p>
                      <p className="text-xs text-muted-foreground">Authorize immediate SMS broadcasts to parents for urgent situations or schedule changes.</p>
                    </div>
                    <Switch 
                      checked={securitySettings.smsAlerts} 
                      onCheckedChange={(checked) => handleToggleSecurity("smsAlerts", checked)} 
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── AUDIT LOGS TAB ── */}
        <TabsContent value="audit">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="font-heading text-lg font-semibold">Audit Logs</CardTitle>
              <CardDescription>Track administrative actions, user creation events, and configuration modifications.</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingAudit ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
              ) : (
                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 border-l-2 border-accent/40 pl-3 py-1">
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium text-foreground">{log.who}</span>{" "}
                          <span className="text-muted-foreground">— {log.what}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{log.when}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;