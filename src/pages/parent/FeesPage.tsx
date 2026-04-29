import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Download, DollarSign, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const breakdown = [
  { item: "Tuition", amount: 420 },
  { item: "Boarding", amount: 280 },
  { item: "Exam fee", amount: 60 },
];
const total = 760, paid = 640, balance = total - paid;

const history = [
  { id: "RCT-3421", date: "15 Apr 2025", item: "Term 2 — Partial", amount: 640, method: "EcoCash", status: "Paid" },
  { id: "RCT-3210", date: "12 Jan 2025", item: "Term 1 — Full", amount: 760, method: "Bank Transfer", status: "Paid" },
  { id: "RCT-2998", date: "10 Sep 2024", item: "Term 3 — Full", amount: 720, method: "EcoCash", status: "Paid" },
];

const ParentFeesPage = () => {
  const [payOpen, setPayOpen] = useState(false);
  const [amount, setAmount] = useState(balance);
  const [method, setMethod] = useState("EcoCash");

  const handlePayment = () => {
    history.unshift({
      id: `RCT-${String(history.length + 3422)}`,
      date: new Date().toLocaleDateString("en-GB"),
      item: "Term 2 — Partial",
      amount,
      method,
      status: "Paid"
    });
    setPayOpen(false);
    alert(`Payment of $${amount} successful!`);
  };

  const downloadReceipt = (h: typeof history[0]) => {
    const content = `RECEIPT\n======\nID: ${h.id}\nDate: ${h.date}\nAmount: $${h.amount}\nMethod: ${h.method}\nStatus: ${h.status}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt_${h.id}.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Fees & Payments</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage Tawanda's school fees and view payment history.</p>
        </div>
      </motion.div>

      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogTrigger asChild><Button className="w-full bg-orange-500 text-white hover:bg-orange-600"><CreditCard className="h-4 w-4" /> Pay ${balance} Now</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Make Payment</DialogTitle><DialogDescription>Payment for Tawanda - Term 2 2025</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Amount (USD)</Label><Input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} /></div>
            <div className="grid gap-2">
              <Label>Method</Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="EcoCash">EcoCash</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">EcoCash: *151*2*2*12345#</p>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setPayOpen(false)}>Cancel</Button><Button onClick={handlePayment}>Pay ${amount}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

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
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400"><DollarSign className="h-7 w-7 text-white" /></div>
            </div>
            <div className="mt-4"><div className="mb-1 flex justify-between text-xs text-muted-foreground"><span>Paid: ${paid}</span><span>Total: ${total}</span></div><Progress value={(paid / total) * 100} className="h-2" /></div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader><CardTitle>Payment Methods</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-green-500" /><span className="text-sm">EcoCash</span></div>
            <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-green-500" /><span className="text-sm">Bank Transfer</span></div>
            <div className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-green-500" /><span className="text-sm">Cash</span></div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader><CardTitle>Fee Breakdown</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {breakdown.map(b => <div key={b.item} className="flex justify-between"><span>{b.item}</span><span>${b.amount}</span></div>)}
          <div className="border-t flex justify-between font-bold"><span>Total</span><span>${total}</span></div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow className="bg-muted/40"><TableHead>Receipt</TableHead><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Amount</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {history.map(h => (
                <TableRow key={h.id}>
                  <TableCell className="font-mono text-xs">{h.id}</TableCell><TableCell>{h.date}</TableCell><TableCell>{h.item}</TableCell><TableCell className="font-semibold">${h.amount}</TableCell><TableCell>{h.method}</TableCell>
                  <TableCell><Badge className="bg-green-500/15 text-green-700">{h.status}</Badge></TableCell>
                  <TableCell><Button size="icon" variant="ghost" onClick={() => downloadReceipt(h)}><Download className="h-4 w-4" /></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParentFeesPage;