import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Award, FileCheck2, FileSignature, FileMinus, Receipt } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

const templates = [
  { name: "Report Card", icon: FileText, desc: "Termly academic results", color: "from-accent to-accent/70" },
  { name: "Clearance Letter", icon: FileCheck2, desc: "Confirms no outstanding balances", color: "from-green-500 to-green-400" },
  { name: "Transfer Letter", icon: FileMinus, desc: "Issued upon student transfer", color: "from-orange-500 to-orange-400" },
  { name: "Admission Letter", icon: FileSignature, desc: "Welcomes a new learner", color: "from-secondary to-secondary/70" },
  { name: "Award Certificate", icon: Award, desc: "For academic & sports achievements", color: "from-purple-500 to-purple-400" },
];

const fallbackDocuments = [
  { name: "Report Card", type: "Report Card", date: "15 Apr 2025", size: "320 KB", icon: FileText, color: "from-accent to-accent/70" },
  { name: "Clearance Letter", type: "Letter", date: "14 Apr 2025", size: "120 KB", icon: FileCheck2, color: "from-green-500 to-green-400" },
  { name: "Award Certificate", type: "Certificate", date: "12 Apr 2025", size: "180 KB", icon: Award, color: "from-purple-500 to-purple-400" },
  { name: "Transfer Letter", type: "Letter", date: "10 Apr 2025", size: "145 KB", icon: FileMinus, color: "from-orange-500 to-orange-400" },
];

const mapDocument = (doc: any) => ({
  id: doc.id || `${doc.student_id}-${doc.type}-${doc.created_at}`,
  name: doc.name || `${doc.type || "Document"}`,
  type: doc.type || "Document",
  date: doc.created_at ? new Date(doc.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "Today",
  size: doc.size || "120 KB",
  icon: doc.type === "Receipt" ? Receipt : doc.type === "Certificate" ? Award : FileText,
  color: doc.type === "Receipt" ? "from-green-500 to-green-400" : doc.type === "Certificate" ? "from-purple-500 to-purple-400" : "from-accent to-accent/70",
});

const CertificatesPage = () => {
  const [students, setStudents] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const rows = await api.getStudents();
        const studentRows = rows || [];
        setStudents(studentRows.map((row: any) => ({ id: row.id, name: row.name || `Student ${row.id}` })));
        if (studentRows.length) {
          setSelectedStudentId(studentRows[0].id);
        }
      } catch (error) {
        console.error("Error loading students:", error);
      }
    };
    loadStudents();
  }, []);

  useEffect(() => {
    if (!selectedStudentId) return;

    const loadDocuments = async () => {
      setLoadingDocs(true);
      try {
        const rows = await api.getDocuments(selectedStudentId);
        setDocuments(rows || []);
      } catch (error) {
        console.error("Error loading documents:", error);
        setDocuments([]);
      } finally {
        setLoadingDocs(false);
      }
    };

    loadDocuments();
  }, [selectedStudentId]);

  const documentsToShow = documents.length ? documents.map(mapDocument) : fallbackDocuments;
  const selectedStudentName = students.find((student) => student.id === selectedStudentId)?.name;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground">Certificates & Documents</h1>
        <p className="mt-1 text-sm text-muted-foreground">Generate report cards, letters and certificates.</p>
      </motion.div>

      <Card className="border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle className="font-heading text-lg font-semibold">Student Document Center</CardTitle>
            <p className="text-sm text-muted-foreground">Load documents from the backend for a selected student.</p>
          </div>
          <div className="min-w-[220px]">
            <Label>Student</Label>
            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
              <SelectTrigger><SelectValue placeholder="Choose a student" /></SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-muted p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground">Loaded documents</p>
            <p className="mt-2 text-3xl font-semibold">{loadingDocs ? "…" : documentsToShow.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">{selectedStudentName ? `For ${selectedStudentName}` : "Select a student to view documents."}</p>
          </div>
          <div className="rounded-2xl border border-muted p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground">API status</p>
            <p className="mt-2 text-base font-medium">{documents.length > 0 ? "Backend documents loaded" : "Fallback document previews"}</p>
          </div>
          <div className="rounded-2xl border border-muted p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground">Generate sample files</p>
            <p className="mt-2 text-base font-medium">Use the quick generate controls below.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <Card key={t.name} className="relative overflow-hidden border-none shadow-md hover:shadow-lg transition cursor-pointer">
            <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-[0.08]`} />
            <CardContent className="relative p-5">
              <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${t.color} shadow-sm`}>
                <t.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-heading text-base font-bold">{t.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
              <Button size="sm" variant="outline" className="mt-3 w-full">Generate</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-md">
        <CardHeader><CardTitle className="font-heading text-lg font-semibold">Quick Generate</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Select>
              <SelectTrigger><SelectValue placeholder="Document type" /></SelectTrigger>
              <SelectContent>
                {templates.map((t) => <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="Student name or ID" />
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90"><Download className="h-4 w-4" /> Generate & Download</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardHeader><CardTitle className="font-heading text-lg font-semibold">Recently Generated</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {documentsToShow.map((r, i) => (
              <div key={r.id || i} className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${r.color} text-white`}>
                  <r.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.type} · {r.date}</p>
                </div>
                <Badge className="bg-green-500/15 text-green-700 hover:bg-green-500/20">{r.size}</Badge>
                <Button size="icon" variant="ghost"><Download className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificatesPage;
