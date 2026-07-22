import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Award, FileCheck2, FileSignature, FileMinus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { generateDocument, getRecentDocuments, type GeneratedDocument } from "@/lib/adminApi";

const templates = [
  { name: "Report Card", icon: FileText, desc: "Termly academic results", color: "from-accent to-accent/70" },
  { name: "Clearance Letter", icon: FileCheck2, desc: "Confirms no outstanding balances", color: "from-green-500 to-green-400" },
  { name: "Transfer Letter", icon: FileMinus, desc: "Issued upon student transfer", color: "from-orange-500 to-orange-400" },
  { name: "Admission Letter", icon: FileSignature, desc: "Welcomes a new learner", color: "from-secondary to-secondary/70" },
  { name: "Award Certificate", icon: Award, desc: "For academic & sports achievements", color: "from-purple-500 to-purple-400" },
];

const CertificatesPage = () => {
  const [recent, setRecent] = useState<GeneratedDocument[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [documentType, setDocumentType] = useState("");
  const [studentQuery, setStudentQuery] = useState("");
  const [generating, setGenerating] = useState(false);

  const fetchRecent = async () => {
    setLoadingRecent(true);
    try {
      const docs = await getRecentDocuments();
      setRecent(docs);
    } catch (error) {
      console.error("Error fetching recent documents:", error);
      toast.error("Failed to load recently generated documents");
    } finally {
      setLoadingRecent(false);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  const handleGenerate = async (type?: string) => {
    const docType = type || documentType;
    if (!docType) {
      toast.error("Please select a document type.");
      return;
    }
    setGenerating(true);
    try {
      await generateDocument({ type: docType, studentName: studentQuery || undefined });
      toast.success(`${docType} generated successfully!`);
      setStudentQuery("");
      fetchRecent();
    } catch (error: any) {
      console.error("Error generating document:", error);
      toast.error(error?.message || "Failed to generate document");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground">Certificates & Documents</h1>
        <p className="mt-1 text-sm text-muted-foreground">Generate report cards, letters and certificates.</p>
      </motion.div>

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
              <Button size="sm" variant="outline" className="mt-3 w-full" disabled={generating} onClick={() => handleGenerate(t.name)}>
                Generate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-md">
        <CardHeader><CardTitle className="font-heading text-lg font-semibold">Quick Generate</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger><SelectValue placeholder="Document type" /></SelectTrigger>
              <SelectContent>
                {templates.map((t) => <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Input placeholder="Student name or ID" value={studentQuery} onChange={(e) => setStudentQuery(e.target.value)} />
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={generating}
              onClick={() => handleGenerate()}
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Generate & Download
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardHeader><CardTitle className="font-heading text-lg font-semibold">Recently Generated</CardTitle></CardHeader>
        <CardContent>
          {loadingRecent ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
          ) : recent.length === 0 ? (
            <p className="text-center py-8 text-sm text-muted-foreground italic">No documents generated yet.</p>
          ) : (
            <div className="space-y-2">
              {recent.map((r) => (
                <div key={r.id} className="flex items-center gap-3 rounded-lg bg-muted/40 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent"><FileText className="h-4 w-4" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{r.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.studentName || r.studentId || "—"} · {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className="bg-green-500/15 text-green-700 hover:bg-green-500/20">{r.status || "Generated"}</Badge>
                  {r.url && (
                    <Button size="icon" variant="ghost" asChild>
                      <a href={r.url} target="_blank" rel="noreferrer"><Download className="h-4 w-4" /></a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificatesPage;
