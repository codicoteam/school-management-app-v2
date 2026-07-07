import { useState, useEffect } from "react";
import { api } from "@/lib/api";
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

interface Item {
  id: string;
  name: string;
  category: string;
  qty: number;
  assigned: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

const InventoryPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset, setValue } = useForm<{ name: string; category: string; qty: number }>({ defaultValues: { category: "General", qty: 1 } });

  useEffect(() => {
    const loadInventory = async () => {
      setLoading(true);
      try {
        const rows = await api.getInventory();
        setItems((rows || []).map((row: any) => ({
          id: row.id,
          name: row.name,
          category: row.category || "General",
          qty: Number(row.qty || 0),
          assigned: Number(row.assigned || 0),
          status: row.status === "Out of Stock" ? "Out of Stock" : row.status === "Low Stock" ? "Low Stock" : "In Stock",
        })));
      } catch (error) {
        console.error("Error loading inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, []);

  const onAdd = async (data: { name: string; category: string; qty: number }) => {
    try {
      const created = await api.createInventoryItem({ name: data.name, category: data.category, qty: data.qty, assigned: 0 });
      setItems((prev) => [
        ...prev,
        {
          id: created.id,
          name: created.name,
          category: created.category || "General",
          qty: Number(created.qty || 0),
          assigned: Number(created.assigned || 0),
          status: created.status === "Out of Stock" ? "Out of Stock" : created.status === "Low Stock" ? "Low Stock" : "In Stock",
        },
      ]);
      setAddOpen(false);
      reset({ category: "General", qty: 1, name: "" });
    } catch (error) {
      console.error("Error adding inventory item:", error);
      alert("Failed to add inventory item. See console for details.");
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await api.deleteInventoryItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      alert("Failed to delete inventory item. See console for details.");
    }
  };

  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
  const total = items.reduce((sum, i) => sum + i.qty, 0);
  const lowStock = items.filter((i) => i.status === "Low Stock").length;
  const available = items.reduce((sum, i) => sum + (i.qty - i.assigned), 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Inventory & Assets</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track school assets and supplies.</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90"><Plus className="h-4 w-4" /> Add Item</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Inventory Item</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit(onAdd)} className="grid gap-4 py-4">
              <div className="grid gap-2"><Label>Item Name</Label><Input {...register("name", { required: true })} /></div>
              <div className="grid gap-2"><Label>Category</Label>
                <Select onValueChange={(value) => setValue("category", value)}>
                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Books">Books</SelectItem>
                    <SelectItem value="Lab">Lab</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Stationery">Stationery</SelectItem>
                    <SelectItem value="ICT">ICT</SelectItem>
                  </SelectContent>
                </Select>
                <Input {...register("category", { required: true })} placeholder="Category" />
              </div>
              <div className="grid gap-2"><Label>Quantity</Label><Input type="number" {...register("qty", { valueAsNumber: true, required: true })} /></div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                <Button type="submit">Add</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Items", value: total, icon: Boxes, color: "from-accent to-accent/70" },
          { label: "Categories", value: new Set(items.map((i) => i.category)).size, icon: Package, color: "from-secondary to-secondary/70" },
          { label: "Low Stock", value: lowStock, icon: AlertTriangle, color: "from-orange-500 to-orange-400" },
          { label: "Available", value: available, icon: CheckCircle2, color: "from-green-500 to-green-400" },
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
        <CardContent className="p-4 lg:p-6">
          <div className="relative max-w-md mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search inventory..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((i) => (
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
                      <Badge className={i.status === "In Stock" ? "bg-green-500/15 text-green-700" : i.status === "Low Stock" ? "bg-orange-500/15 text-orange-700" : "bg-red-500/15 text-red-700"}>
                        {i.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => deleteItem(i.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
};

export default InventoryPage;

