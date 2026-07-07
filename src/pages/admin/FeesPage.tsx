import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Plus, Download, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type FeeStatus = "Paid" | "Partial" | "Outstanding";

interface FeePayment {
  id: string;
  student: string;
  class: string;
  amount: number;
  method: string;
  date: string;
  status: FeeStatus;
}

interface FeeStructure {
  grade: string;
  tuition: number;
  boarding: number;
  exam: number;
  total: number;
}

const initialStructure: FeeStructure[] = [
  { grade: "Form 1-2", tuition: 350, boarding: 280, exam: 40, total: 670 },
  { grade: "Form 3-4", tuition: 420, boarding: 280, exam: 60, total: 760 },
  { grade: "Form 5-6", tuition: 520, boarding: 320, exam: 80, total: 920 },
];

const FeesPage = () => {
  const [payments, setPayments] = useState<FeePayment[]>([]);
  const [structure] = useState<FeeStructure[]>(initialStructure);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("EcoCash");
  const [selectedStatus, setSelectedStatus] = useState<"Paid" | "Partial" | "Outstanding">("Paid");
  const { register, handleSubmit, reset, setValue } = useForm<{ class: string; amount: number; method: string; status: string }>({ defaultValues: { class: "", amount: 0, method: "EcoCash", status: "Paid" } });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [feesRows, studentRows] = await Promise.all([api.getFees(), api.getStudents()]);
        setStudents((studentRows || []).map((row: any) => ({ id: row.id, name: row.name || row.email || row.id })));
        setPayments((feesRows || []).map((row: any, index: number) => ({
          id: row.id || `PMT-${index + 1}`,
          student: row.student_id || row.item || "Unknown",
          class: row.item || "N/A",
          amount: Number(row.amount || 0),
          method: row.method || "—",
          date: row.paid_date || row.due_date || new Date(row.created_at || Date.now()).toLocaleDateString("en-GB"),
          status: row.status === "Paid" || row.status === "paid" ? "Paid" : row.status === "Partial" || row.status === "partial" ? "Partial" : "Outstanding",
        })));
      } catch (error) {
        console.error("Error loading fee data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const onAddPayment = async (data: { class: string; amount: number; method: string; status: FeeStatus }) => {
    if (!selectedStudentId) {
      alert("Please select a student.");
      return;
    }

    try {
      const status = data.status || selectedStatus;
      const created = await api.createFee({
        student_id: selectedStudentId,
        amount: data.amount,
        item: `${data.class || "Fee"} payment`,
        method: data.method,
        due_date: new Date().toISOString().split("T")[0],
        status,
        paid_date: status === "Paid" || status === "Partial" ? new Date().toISOString().split("T")[0] : null,
      });

      setPayments((prev) => [
        {
          id: created.id,
          student: students.find((s) => s.id === selectedStudentId)?.name || selectedStudentId,
          class: created.item || data.class,
          amount: Number(created.amount || 0),
          method: created.method || data.method,
          date: created.paid_date || created.due_date || new Date().toLocaleDateString("en-GB"),
          status: created.status === "Paid" || created.status === "paid" ? "Paid" : created.status === "Partial" || created.status === "partial" ? "Partial" : "Outstanding",
        },
        ...prev,
      ]);
      setPaymentOpen(false);
      reset({ class: "", amount: 0, method: "EcoCash", status: "Paid" });
      setSelectedStudentId("");
      setSelectedMethod("EcoCash");
      setSelectedStatus("Paid");
    } catch (error) {
      console.error("Error creating fee payment:", error);
      alert("Failed to record payment. See console for details.");
    }
  };

  const generateReport = () => {
    const data = `Receipt,Student,Class,Amount,Method,Date,Status\n${payments.map((p) => `${p.id},${p.student},${p.class},${p.amount},${p.method},${p.date},${p.status}`).join("\n")}`;
    const blob = new Blob([data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fees_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const onUpdateStatus = async (id: string, status: FeeStatus) => {
    try {
      const updated = await api.updateFee(id, {
        status,
        paid_date: status === "Paid" || status === "Partial" ? new Date().toISOString().split("T")[0] : null,
      });
      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === id
            ? {
                ...payment,
                status: updated.status === "Paid" || updated.status === "paid" ? "Paid" : updated.status === "Partial" || updated.status === "partial" ? "Partial" : "Outstanding",
                date: updated.paid_date || updated.due_date || payment.date,
              }
            : payment
        )
      );
    } catch (error) {
      console.error("Error updating fee status:", error);
      alert("Failed to update fee status. See console for details.");
    }
  };

  const collected = payments.reduce((sum, p) => sum + (p.status === "Paid" ? p.amount : p.status === "Partial" ? p.amount : 0), 0);
  const outstanding = structure.reduce((s, f) => s + f.total, 0) - collected;
  const paidCount = payments.filter((p) => p.status === "Paid").length;
  const monthly = [
    { month: "Jan", amount: 22000 },
    { month: "Feb", amount: 25500 },
    { month: "Mar", amount: 28000 },
    { month: "Apr", amount: collected },
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Fees & Billing</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage fee structures, record payments and track collections.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateReport}><Download className="h-4 w-4" /> Report</Button>
          <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="h-4 w-4" /> Record Payment</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Payment</DialogTitle>
                <DialogDescription>Enter payment details.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onAddPayment)} className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Student *</Label>
                  <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                    <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2"><Label>Class</Label><Input {...register("class")} placeholder="Form 4A" /></div>
                <div className="grid gap-2"><Label>Amount (USD) *</Label><Input type="number" {...register("amount", { valueAsNumber: true, required: true })} /></div>
                <div className="grid gap-2"><Label>Payment Method</Label>
                  <Select value={selectedMethod} onValueChange={(value) => { setSelectedMethod(value); setValue("method", value); }}>
                    <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EcoCash">EcoCash</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Visa">Visa</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="hidden" {...register("method")} />
                </div>
                <div className="grid gap-2"><Label>Status</Label>
                  <Select value={selectedStatus} onValueChange={(value) => { setSelectedStatus(value as "Paid" | "Partial" | "Outstanding"); setValue("status", value); }}>
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Partial">Partial</SelectItem>
                      <SelectItem value="Outstanding">Outstanding</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="hidden" {...register("status")} />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setPaymentOpen(false)}>Cancel</Button>
                  <Button type="submit">Record</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Collected (Apr)", value: `$${collected.toLocaleString()}`, icon: DollarSign, color: "from-green-500 to-green-400" },
          { label: "Outstanding", value: `$${outstanding.toLocaleString()}`, icon: AlertCircle, color: "from-orange-500 to-orange-400" },
          { label: "Paid in Full", value: paidCount.toString(), icon: CheckCircle2, color: "from-accent to-accent/70" },
          { label: "Growth", value: "+18%", icon: TrendingUp, color: "from-secondary to-secondary/70" },
        ].map((s) => (
          <Card key={s.label} className="relative overflow-hidden border-none shadow-md">
            <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-[0.08]`} />
            <CardContent className="relative flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color}`}><s.icon className="h-5 w-5 text-white" /></div>
              <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-xl font-bold">{s.value}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-md">
        <CardHeader><CardTitle className="font-heading text-lg font-semibold">Collections Trend</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="feeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Area type="monotone" dataKey="amount" stroke="hsl(var(--accent))" strokeWidth={3} fill="url(#feeGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Tabs defaultValue="payments">
        <TabsList className="bg-muted"><TabsTrigger value="payments">Recent Payments</TabsTrigger><TabsTrigger value="structure">Fee Structure</TabsTrigger></TabsList>
        <TabsContent value="payments">
          <Card className="border-none shadow-md">
            <CardContent className="p-4 lg:p-6">
              <div className="overflow-hidden rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead>Receipt</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono text-xs text-muted-foreground">{p.id}</TableCell>
                        <TableCell className="font-medium">{p.student}</TableCell>
                        <TableCell>{p.class}</TableCell>
                        <TableCell className="font-semibold">${p.amount}</TableCell>
                        <TableCell>{p.method}</TableCell>
                        <TableCell className="text-muted-foreground">{p.date}</TableCell>
                        <TableCell>
                          <Badge className={p.status === "Paid" ? "bg-green-500/15 text-green-700" : p.status === "Partial" ? "bg-orange-500/15 text-orange-700" : "bg-red-500/15 text-red-700"}>
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {p.status !== "Paid" ? (
                            <Button size="sm" variant="outline" onClick={() => onUpdateStatus(p.id, "Paid")}>Mark Paid</Button>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => onUpdateStatus(p.id, "Outstanding")}>Mark Outstanding</Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="structure">
          <Card className="border-none shadow-md">
            <CardContent className="p-4 lg:p-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead>Grade</TableHead>
                    <TableHead>Tuition</TableHead>
                    <TableHead>Boarding</TableHead>
                    <TableHead>Exam</TableHead>
                    <TableHead>Total / Term</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {structure.map((f) => (
                    <TableRow key={f.grade}>
                      <TableCell className="font-medium">{f.grade}</TableCell>
                      <TableCell>${f.tuition}</TableCell>
                      <TableCell>${f.boarding}</TableCell>
                      <TableCell>${f.exam}</TableCell>
                      <TableCell className="font-bold text-accent">${f.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeesPage;