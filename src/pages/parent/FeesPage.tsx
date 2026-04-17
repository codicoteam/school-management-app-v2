import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Download, DollarSign, AlertCircle, CheckCircle2, Smartphone, Building2, Banknote } from "lucide-react";
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

const ParentFeesPage = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="font-heading text-2xl font-bold text-foreground">Fees & Payments</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage Tawanda's school fees and view payment history.</p>
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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400">
              <DollarSign className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs text-muted-foreground"><span>Paid: ${paid}</span><span>Total: ${total}</span></div>
            <Progress value={(paid / total) * 100} className="h-2" />
          </div>
          <Button className="mt-4 w-full bg-orange-500 text-white hover:bg-orange-600"><CreditCard className="h-4 w-4" /> Pay ${balance} Now</Button>
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
          <div className="border-t pt-2 flex justify-between font-bold"><span>Total</span><span>${total}</span></div>
        </CardContent>
      </Card>
    </div>

    <Tabs defaultValue="pay" className="space-y-4">
      <TabsList className="bg-muted">
        <TabsTrigger value="pay">Make Payment</TabsTrigger>
        <TabsTrigger value="history">Payment History</TabsTrigger>
      </TabsList>

      <TabsContent value="pay">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { method: "EcoCash", icon: Smartphone, info: "Dial *151*2*2*12345#", color: "from-accent to-accent/70" },
            { method: "Bank Transfer", icon: Building2, info: "CABS · 1234 5678 9012", color: "from-secondary to-secondary/70" },
            { method: "Cash at Bursar", icon: Banknote, info: "Mon–Fri · 08:00–15:00", color: "from-green-500 to-green-400" },
          ].map((m) => (
            <Card key={m.method} className="border-none shadow-md hover:shadow-lg transition cursor-pointer">
              <CardContent className="p-5">
                <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${m.color}`}>
                  <m.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-heading text-base font-bold">{m.method}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{m.info}</p>
                <Button size="sm" variant="outline" className="mt-3 w-full">Use this method</Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="mt-4 border-none shadow-md">
          <CardHeader><CardTitle className="font-heading text-lg font-semibold">Quick Pay</CardTitle></CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <div><Label>Amount (USD)</Label><Input type="number" defaultValue={balance} /></div>
            <div><Label>Reference</Label><Input defaultValue="BPS-2451" /></div>
            <div className="flex items-end"><Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90"><CreditCard className="h-4 w-4" /> Pay Now</Button></div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history">
        <Card className="border-none shadow-md">
          <CardContent className="p-4 lg:p-6">
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead>Receipt</TableHead><TableHead>Date</TableHead>
                    <TableHead>Description</TableHead><TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead></TableHead>
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
      </TabsContent>
    </Tabs>

    <div className="grid gap-3 sm:grid-cols-2">
      <Card className="border-none shadow-md">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/15 text-orange-700"><AlertCircle className="h-5 w-5" /></div>
          <div><p className="text-sm font-semibold">Reminder</p><p className="text-xs text-muted-foreground">Term 2 balance is due in 12 days.</p></div>
        </CardContent>
      </Card>
      <Card className="border-none shadow-md">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/15 text-green-700"><CheckCircle2 className="h-5 w-5" /></div>
          <div><p className="text-sm font-semibold">Good standing</p><p className="text-xs text-muted-foreground">All previous terms fully paid.</p></div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default ParentFeesPage;
