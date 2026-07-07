import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Download, Award, FileCheck2, Receipt, Printer, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

const fallbackDocuments = [
  { name: "Term 1 2025 Report Card", type: "Report Card", date: "15 Apr 2025", size: "320 KB", icon: FileText, color: "from-accent to-accent/70" },
  { name: "Term 1 2025 Fee Receipt", type: "Receipt", date: "12 Jan 2025", size: "120 KB", icon: Receipt, color: "from-green-500 to-green-400" },
  { name: "2024 Year-end Report Card", type: "Report Card", date: "10 Dec 2024", size: "410 KB", icon: FileText, color: "from-accent to-accent/70" },
  { name: "Mathematics Olympiad Award", type: "Certificate", date: "22 Nov 2024", size: "180 KB", icon: Award, color: "from-secondary to-secondary/70" },
  { name: "Term 3 2024 Fee Receipt", type: "Receipt", date: "10 Sep 2024", size: "120 KB", icon: Receipt, color: "from-green-500 to-green-400" },
  { name: "Clearance Letter — Term 2 2024", type: "Letter", date: "30 Aug 2024", size: "95 KB", icon: FileCheck2, color: "from-purple-500 to-purple-400" },
  { name: "Term 2 2024 Report Card", type: "Report Card", date: "15 Aug 2024", size: "390 KB", icon: FileText, color: "from-accent to-accent/70" },
  { name: "Sports Day Participation Certificate", type: "Certificate", date: "20 May 2024", size: "210 KB", icon: Award, color: "from-secondary to-secondary/70" },
];

const DocumentsPage = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [docs, setDocs] = useState<typeof fallbackDocuments>(fallbackDocuments);
  const [child, setChild] = useState<any>(null);

  useEffect(() => {
    const loadDocuments = async () => {
      if (!user || user.role !== "parent") return;
      const children = await api.getParentChildren(user.id);
      const selectedChild = children?.[0] ?? null;
      setChild(selectedChild);
      if (selectedChild?.id) {
        try {
          const rows = await api.getDocuments(selectedChild.id);
          if (Array.isArray(rows) && rows.length > 0) {
            setDocs(rows.map((doc: any) => ({
              name: doc.name,
              type: doc.type,
              date: new Date(doc.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
              size: doc.size || '120 KB',
              icon: doc.type === 'Receipt' ? Receipt : doc.type === 'Certificate' ? Award : FileText,
              color: doc.type === 'Receipt' ? 'from-green-500 to-green-400' : doc.type === 'Certificate' ? 'from-secondary to-secondary/70' : 'from-accent to-accent/70',
            })));
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    loadDocuments();
  }, [user]);

  const filtered = docs.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  const downloadDoc = (d: typeof fallbackDocuments[0]) => {
    const content = `DOCUMENT\n=======\nName: ${d.name}\nType: ${d.type}\nDate: ${d.date}\nSize: ${d.size}\n\nStudent: Tawanda Ndlovu\nForm: 4A\n\nThis is a sample document content.`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${d.name.replace(/[^a-z0-9]/gi, "_")}.txt`;
    a.click();
  };

  const printDoc = (d: typeof fallbackDocuments[0]) => {
    const content = `DOCUMENT\n=======\nName: ${d.name}\nType: ${d.type}\nDate: ${d.date}\nSize: ${d.size}\n\nStudent: Tawanda Ndlovu\nForm: 4A`;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`<pre>${content}</pre>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground">Reports & Documents</h1>
        <p className="mt-1 text-sm text-muted-foreground">Download your child's official school documents.</p>
      </motion.div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Documents", value: docs.length, color: "from-accent to-accent/70", icon: FileText },
          { label: "Report Cards", value: docs.filter(d => d.type === "Report Card").length, color: "from-secondary to-secondary/70", icon: FileText },
          { label: "Certificates", value: docs.filter(d => d.type === "Certificate").length, color: "from-green-500 to-green-400", icon: Award },
          { label: "Receipts", value: docs.filter(d => d.type === "Receipt").length, color: "from-orange-500 to-orange-400", icon: Receipt },
        ].map(s => (
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
        <CardHeader>
          <CardTitle>All Documents</CardTitle>
          <div className="relative mt-2 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search documents..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((d, i) => (
              <motion.div key={d.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }}>
                <Card className="border border-border shadow-none hover:border-accent hover:shadow-md transition">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${d.color}`}><d.icon className="h-5 w-5 text-white" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm leading-snug">{d.name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2"><Badge variant="outline" className="text-xs">{d.type}</Badge><span className="text-xs text-muted-foreground">{d.size}</span></div>
                        <p className="mt-1 text-xs text-muted-foreground">{d.date}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => downloadDoc(d)}><Download className="h-4 w-4 mr-2" /> Download</Button>
                      <Button size="sm" variant="ghost" onClick={() => printDoc(d)}><Printer className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsPage;