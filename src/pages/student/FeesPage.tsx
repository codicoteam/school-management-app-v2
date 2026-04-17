import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Download, AlertCircle, CheckCircle2, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const breakdown = [
  { item: "Tuition", amount: 420 },
  { item: "Boarding", amount: 280 },
  { item: "Exam fee", amount: 60 },
];

const history = [
  { id: "RCT-3421", date: "15 Apr 2025", item: "Term 2 — Partial", amount: 640, method: "EcoCash", status: "Paid" },
  { id: "RCT-3210", date: "12 Jan 2025", item: "Term 1 — Full", amount: 760, method: "Bank Transfer", status: "Paid" },
  { id: "RCT-2998", date: "10 Sep 2024", item: "Term 3 — Full", amount: 720, method: "EcoCash", status: "Paid" },
  { id: "RCT-2811", date: "18 May 2024", item: "Term 2 — Full", amount: 720, method: "Cash", status: "Paid" },
];

const total = breakdown.reduce((s, b) => s + b.amount, 0);
const paid = 640;
const balance = total - paid;

const StudentFeesPage = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Fees Status</h1>
        <p className="mt-1 text-sm text-muted-foreground">Term 2 · 2025</p>
      </div>
      <Button className="bg-accent text-accent-foreground hover:bg-accent/90"><CreditCard className="h-4 w-4" /> Pay Now</Button>
    </motion.div>

    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="relative overflow-hidden border-none shadow-md lg:col-span-2">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-400 opacity-[0.08]" />
        <CardContent className="relative p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Outstanding Balance</p>
              <p className="mt-1 text-4xl font-bold">${balance}<span className="text-sm font-normal text-muted-foreground">.00</span></p>
              <p className="text-xs text-muted-foreground">Due 30 April 2025</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400 shadow-md">
              <DollarSign className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>Paid: ${paid}</span>
              <span>Total: ${total}</span>
            </div>
            <Progress value={(paid / total) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardHeader><CardTitle className="font-heading text-base font-semibold">Term Breakdown</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {breakdown.map((b) => (
            <div key={b.item} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{b.item}</span>
              <span className="font-medium">${b.amount}</span>
            </div>
          ))}
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Total</span><span>${total}</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
      {[
        { icon: AlertCircle, label: "Reminder", text: "Payment due in 12 days", color: "from-orange-500 to-orange-400" },
        { icon: CheckCircle2, label: "Payment methods", text: "EcoCash · Bank · Cash", color: "from-green-500 to-green-400" },
        { icon: CreditCard, label: "EcoCash code", text: "*151*2*2*12345#", color: "from-accent to-accent/70" },
      ].map((s) => (
        <Card key={s.label} className="border-none shadow-md">
          <CardContent className="flex items-center gap-3 p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color}`}>
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-sm font-semibold">{s.text}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card className="border-none shadow-md">
      <CardHeader><CardTitle className="font-heading text-lg font-semibold">Payment History</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Receipt</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((h) => (
                <TableRow key={h.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{h.id}</TableCell>
                  <TableCell>{h.date}</TableCell>
                  <TableCell>{h.item}</TableCell>
                  <TableCell className="font-semibold">${h.amount}</TableCell>
                  <TableCell>{h.method}</TableCell>
                  <TableCell><Badge className="bg-green-500/15 text-green-700 hover:bg-green-500/20">{h.status}</Badge></TableCell>
                  <TableCell><Button size="icon" variant="ghost"><Download className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default StudentFeesPage;
