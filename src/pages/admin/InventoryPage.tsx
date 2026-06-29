import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Plus, Search, Boxes, AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

const STORAGE_KEY = "school_inventory";

interface Item {
  id: string;
  name: string;
  category: string;
  qty: number;
  assigned: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

const initialItems: Item[] = [
  { id: "INV-001", name: "Mathematics Textbook (Form 4)", category: "Books", qty: 120, assigned: 95, status: "In Stock" },
  { id: "INV-002", name: "Science Lab Microscope", category: "Lab", qty: 12, assigned: 8, status: "In Stock" },
  { id: "INV-003", name: "Football", category: "Sports", qty: 8, assigned: 5, status: "Low Stock" },
  { id: "INV-004", name: "Chairs (Plastic)", category: "Furniture", qty: 240, assigned: 220, status: "In Stock" },
  { id: "INV-005", name: "Whiteboard Markers", category: "Stationery", qty: 4, assigned: 0, status: "Low Stock" },
  { id: "INV-006", name: "Computers (Lab 1)", category: "ICT", qty: 25, assigned: 25, status: "Out of Stock" },
];

const loadItems = (): Item[] => { try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : initialItems; } catch { return initialItems; } };
const saveItems = (items: Item[]) => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

const InventoryPage = () => {
  const [items, setItems] = useState<Item[]>(loadItems);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<{ name: string; category: string; qty: number }>();

  useEffect(() => { saveItems(items); }, [items]);

  const onAdd = (data: { name: string; category: string; qty: number }) => {
    const newItem: Item = { id: `INV-${String(items.length + 1).padStart(3, "0")}`, ...data, assigned: 0, status: data.qty > 10 ? "In Stock" : data.qty > 0 ? "Low Stock" : "Out of Stock" };
    setItems([...items, newItem]);
    setAddOpen(false);
    reset();
  };

  const deleteItem = (id: string) => setItems(items.filter(i => i.id !== id));

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  const total = items.reduce((sum, i) => sum + i.qty, 0);
  const lowStock = items.filter(i => i.status === "Low Stock").length;
  const available = items.reduce((sum, i) => sum + (i.qty - i.assigned), 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Inventory & Assets</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track school assets and supplies.</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild><Button className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="h-4 w-4" /> Add Item</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Inventory Item</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit(onAdd)} className="grid gap-4 py-4">
              <div className="grid gap-2"><Label>Item Name</Label><Input {...register("name")} /></div>
              <div className="grid gap-2"><Label>Category</Label>
                <Select onValueChange={() => {}}><SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger><SelectContent><SelectItem value="Books">Books</SelectItem><SelectItem value="Lab">Lab</SelectItem><SelectItem value="Sports">Sports</SelectItem><SelectItem value="Furniture">Furniture</SelectItem><SelectItem value="Stationery">Stationery</SelectItem><SelectItem value="ICT">ICT</SelectItem></SelectContent></Select>
              </div>
              <div className="grid gap-2"><Label>Quantity</Label><Input type="number" {...register("qty", { valueAsNumber: true })} /></div>
              <DialogFooter><Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button><Button type="submit">Add</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[{ label: "Total Items", value: total, icon: Boxes, color: "from-primary to-primary/70" }, { label: "Categories", value: new Set(items.map(i => i.category)).size, icon: Package, color: "from-secondary to-secondary/70" }, { label: "Low Stock", value: lowStock, icon: AlertTriangle, color: "from-accent to-accent/70" }, { label: "Available", value: available, icon: CheckCircle2, color: "from-secondary to-secondary/70" }].map(s => (
          <Card key={s.label} className="relative overflow-hidden border-none shadow-md">
            <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-[0.08]`} />
            <CardContent className="relative flex items-center gap-3 p-4"><div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.color}`}><s.icon className="h-5 w-5 text-white" /></div><div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-xl font-bold">{s.value}</p></div></CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-md">
        <CardContent className="p-4 lg:p-6">
          <div className="relative max-w-md mb-4"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search inventory..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader><TableRow className="bg-muted/40"><TableHead>Item</TableHead><TableHead>Category</TableHead><TableHead>Total</TableHead><TableHead>Assigned</TableHead><TableHead>Available</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.map(i => (
                  <TableRow key={i.id}>
                    <TableCell><p className="font-medium">{i.name}</p><p className="font-mono text-xs text-muted-foreground">{i.id}</p></TableCell>
                    <TableCell>{i.category}</TableCell><TableCell>{i.qty}</TableCell><TableCell>{i.assigned}</TableCell><TableCell className="font-semibold">{i.qty - i.assigned}</TableCell>
                    <TableCell><Badge className={i.status === "In Stock" ? "bg-primary/15 text-primary" : i.status === "Low Stock" ? "bg-secondary/15 text-secondary" : "bg-accent/15 text-accent"}>{i.status}</Badge></TableCell>
                    <TableCell><Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteItem(i.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryPage;