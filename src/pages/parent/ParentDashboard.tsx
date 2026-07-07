import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  GraduationCap, ClipboardList, Clock, DollarSign, Bell,
  CreditCard, FileText, MessageSquare, ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

const recentResults = [
  { subject: "Mathematics", score: 78 },
  { subject: "English", score: 85 },
  { subject: "Science", score: 89 },
  { subject: "Shona", score: 92 },
];

const announcements = [
  { title: "Parent-teacher meeting on 20 April at 14:00", time: "1 hour ago" },
  { title: "Term 2 fees due by 30 April", time: "2 days ago" },
  { title: "Sports Day on Friday — parents welcome", time: "3 days ago" },
];

const quickActions = [
  { label: "Pay Fees", icon: CreditCard, color: "bg-accent text-accent-foreground", href: "/parent/fees" },
  { label: "View Results", icon: FileText, color: "bg-primary text-primary-foreground", href: "/parent/results" },
  { label: "Message Teacher", icon: MessageSquare, color: "bg-secondary text-secondary-foreground", href: "/parent/messages" },
];

const ParentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [child, setChild] = useState<any>(null);
  const [attendanceSummary, setAttendanceSummary] = useState<{ present: number; absent: number; late: number; rate: number } | null>(null);
  const [recentResults, setRecentResults] = useState<Array<{ subject: string; score: number }>>([]);
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [payOpen, setPayOpen] = useState(false);
  const [amount, setAmount] = useState(120);

  const handlePay = () => {
    setPayOpen(false);
    alert(`Payment of $${amount} successful!`);
  };

  useEffect(() => {
    const loadChildData = async () => {
      if (!user || user.role !== 'parent') return;
      try {
        const children = await api.getParentChildren(user.id);
        const firstChild = children?.[0] ?? null;
        setChild(firstChild);

        if (firstChild?.id) {
          const report = await api.getStudentReport(firstChild.id);
          setAverageScore(report.averageScore ?? null);
          setRecentResults((report.grades || []).slice(0, 4).map((grade: any) => ({ subject: grade.subject, score: grade.score || 0 })));

          const attendance = await api.getStudentAttendanceSummary(firstChild.id);
          setAttendanceSummary(attendance);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadChildData();
  }, [user]);

  const summaryResults = recentResults.length > 0 ? recentResults : [
    { subject: 'Mathematics', score: 78 },
    { subject: 'English', score: 85 },
    { subject: 'Science', score: 89 },
    { subject: 'Shona', score: 92 },
  ];

  const attendanceData = attendanceSummary ?? { present: 46, absent: 3, late: 1, rate: 92 };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden border-none shadow-md">
          <div className="relative bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-secondary/20 blur-2xl" />
            <div className="relative">
              <h1 className="font-heading text-2xl font-bold">Good afternoon, {user?.name ?? 'Parent'} 👋</h1>
              <p className="mt-1 text-sm text-primary-foreground/80">
                Here's an update on {child?.name ?? 'your child'}{child?.name ? "'s" : "'s"} progress today.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="lg:col-span-2">
          <Card className="border-none shadow-md h-full">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent/70 text-xl font-bold text-white shadow-sm">
                TN
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your child</p>
                <h3 className="font-heading text-lg font-bold text-foreground">{child?.name ?? 'Tawanda Ndlovu'}</h3>
                <p className="text-sm text-muted-foreground">{child?.class ?? 'Form 4A'} · Student ID: {child?.id ?? 'BPS-2451'}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge className="bg-accent/15 text-accent"><GraduationCap className="h-3 w-3" /> Top 10%</Badge>
                  <Badge className="bg-green-500/15 text-green-700"><Clock className="h-3 w-3" /> {attendanceData.rate}% attendance</Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80" onClick={() => navigate("/parent/child")}>
                View profile <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
          <Card className="relative overflow-hidden border-none shadow-md h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-400 opacity-[0.08]" />
            <CardContent className="relative p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Outstanding Fees</p>
                <DollarSign className="h-5 w-5 text-orange-500" />
              </div>
              <p className="mt-2 text-3xl font-bold text-foreground">${child ? (averageScore ? averageScore.toFixed(0) : 120) : 120}<span className="text-sm font-normal text-muted-foreground">.00</span></p>
              <p className="text-xs text-muted-foreground">{child ? 'Outstanding fees and performance summary' : 'Due 30 April 2025'}</p>
              <Dialog open={payOpen} onOpenChange={setPayOpen}>
                <DialogTrigger asChild>
                  <Button className="mt-3 w-full bg-orange-500 text-white hover:bg-orange-600">
                    <CreditCard className="h-4 w-4" /> Pay Now
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Make Payment</DialogTitle><DialogDescription>Payment for Tawanda - Term 2 2025</DialogDescription></DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2"><Label>Amount (USD)</Label><Input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} /></div>
                    <div className="grid gap-2"><Label>Method</Label>
                      <Select><SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger><SelectContent><SelectItem value="ecocash">EcoCash</SelectItem><SelectItem value="bank">Bank Transfer</SelectItem><SelectItem value="cash">Cash</SelectItem></SelectContent></Select>
                    </div>
                  </div>
                  <DialogFooter><Button variant="outline" onClick={() => setPayOpen(false)}>Cancel</Button><Button onClick={handlePay}>Pay ${amount}</Button></DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <div className="grid gap-3 grid-cols-3">
          {quickActions.map((a) => (
            <button key={a.label} onClick={() => navigate(a.href)} className={`flex flex-col items-center justify-center gap-2 rounded-2xl p-4 shadow-md transition hover:scale-[1.02] ${a.color}`}>
              <a.icon className="h-5 w-5" />
              <span className="text-xs font-semibold">{a.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
          <Card className="border-none shadow-md h-full">
            <CardHeader className="flex flex-row items-center gap-2">
              <ClipboardList className="h-5 w-5 text-accent" />
              <CardTitle className="font-heading text-lg font-semibold">Recent Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {summaryResults.map((r, i) => (
                <div key={i}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{r.subject}</span>
                    <span className="text-sm font-semibold text-foreground">{r.score}%</span>
                  </div>
                  <Progress value={r.score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.35 }}>
          <Card className="border-none shadow-md h-full">
            <CardHeader className="flex flex-row items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              <CardTitle className="font-heading text-lg font-semibold">Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-foreground">92%</p>
                  <p className="text-xs text-muted-foreground">This term</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-muted-foreground">Present: <span className="font-semibold text-foreground">46</span></p>
                  <p className="text-muted-foreground">Absent: <span className="font-semibold text-foreground">3</span></p>
                  <p className="text-muted-foreground">Late: <span className="font-semibold text-foreground">1</span></p>
                </div>
              </div>
              <Progress value={92} className="mt-4 h-2" />
              <p className="mt-2 text-xs text-muted-foreground">Excellent — keep it up!</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center gap-2">
            <Bell className="h-5 w-5 text-secondary" />
            <CardTitle className="font-heading text-lg font-semibold">Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.map((a, i) => (
              <div key={i} className="rounded-lg bg-muted/40 p-3">
                <p className="text-sm font-medium text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{a.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ParentDashboard;