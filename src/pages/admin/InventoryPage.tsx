import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Plus, Search, Boxes, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { id: "INV-001", name: "Mathematics Textbook (Form 4)", category: "Books", qty: 120, assigned: 95, status: "In Stock" },
  { id: "INV-002", name: "Science Lab Microscope", category: "Lab", qty: 12, assigned: 8, status: "In Stock" },
  { id: "INV-003", name: "Football", category: "Sports", qty: 8, assigned: 5, status: "Low Stock" },
  { id: "INV-004", name: "Chairs (Plastic)", category: "Furniture", qty: 240, assigned: 220, status: "In Stock" },
  { id: "INV-005", name: "Whiteboard Markers", category: "Stationery", qty: 4, assigned: 0, status: "Low Stock" },
  { id: "INV-006", name: "Computers (Lab 1)", category: "ICT", qty: 25, assigned: 25, status: "Out of Stock" },
];

const InventoryPage = () => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Inventory & Assets</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track school assets and supplies issued to departments.</p>
      </div>
      <Button className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="h-4 w-4" /> Add Item</Button>
    </motion.div>

    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
      {[
        { label: "Total Items", value: "409", icon: Boxes, color: "from-accent to-accent/70" },
        { label: "Categories", value: "8", icon: Package, color: "from-secondary to-secondary/70" },
        { label: "Low Stock", value: "12", icon: AlertTriangle, color: "from-orange-500 to-orange-400" },
        { label: "Available", value: "353", icon: CheckCircle2, color: "from-green-500 to-green-400" },
      ].map((s) => (
        <Card key={s.label} className="relative overflow-hidden border-none shadow-md">
          <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-[0.08]`} />
          <CardContent className="relative flex items-center gap-3 p-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color}`}>
              <s.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold">{s.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card className="border-none shadow-md">
      <CardContent className="p-4 lg:p-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search inventory..." className="pl-9" />
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>
                    <p className="font-medium">{i.name}</p>
                    <p className="font-mono text-xs text-muted-foreground">{i.id}</p>
                  </TableCell>
                  <TableCell>{i.category}</TableCell>
                  <TableCell>{i.qty}</TableCell>
                  <TableCell>{i.assigned}</TableCell>
                  <TableCell className="font-semibold">{i.qty - i.assigned}</TableCell>
                  <TableCell>
                    <Badge className={
                      i.status === "In Stock" ? "bg-green-500/15 text-green-700 hover:bg-green-500/20" :
                      i.status === "Low Stock" ? "bg-orange-500/15 text-orange-700 hover:bg-orange-500/20" :
                      "bg-red-500/15 text-red-700 hover:bg-red-500/20"
                    }>{i.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default InventoryPage;
