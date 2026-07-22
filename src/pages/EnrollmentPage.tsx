import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Upload, CheckCircle2, FileText, School, GraduationCap, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { addItem } from "@/lib/localDb";

const EnrollmentPage = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [desiredLevel, setDesiredLevel] = useState("");
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    pastSchool: "",
    currentLevel: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      addItem("applications", {
        ...formData,
        desiredLevel,
        status: "pending",
        submittedAt: new Date().toISOString(),
      });

      setLoading(false);
      setIsSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      setLoading(false);
      toast.error("Failed to submit application. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="flex justify-center">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <CheckCircle2 className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Application Received!</h1>
          <p className="text-muted-foreground italic">
            Thank you for applying to our school. Our admissions team will review your details and contact you via email within 3-5 business days.
          </p>
          <Button onClick={() => navigate("/")} className="w-full h-12 text-lg">
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")} 
          className="group hover:bg-transparent -ml-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Welcome Page
        </Button>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Student Enrollment</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            Start your journey with us. Please fill in the details below to apply for admission.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Personal & Academic Details
              </CardTitle>
              <CardDescription>Enter your background information and goals.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="Enter student's full name" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="Guardian or student email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="Contact number" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pastSchool">
                   <div className="flex items-center gap-2 italic">
                     <School className="h-4 w-4" /> Past School
                   </div>
                </Label>
                <Input id="pastSchool" placeholder="Name of previous institution" required value={formData.pastSchool} onChange={e => setFormData({...formData, pastSchool: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentLevel">Current Level</Label>
                <Select required value={formData.currentLevel} onValueChange={val => setFormData({...formData, currentLevel: val})}>
                  <SelectTrigger id="currentLevel">
                    <SelectValue placeholder="Select current level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grade7">Grade 7</SelectItem>
                    <SelectItem value="form1">Form 1</SelectItem>
                    <SelectItem value="form2">Form 2</SelectItem>
                    <SelectItem value="form3">Form 3</SelectItem>
                    <SelectItem value="form4">Form 4 (O-Level)</SelectItem>
                    <SelectItem value="form5">Form 5 (A-Level)</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="desiredLevel">
                   <div className="flex items-center gap-2">
                     <GraduationCap className="h-4 w-4" /> Level to Enroll To
                   </div>
                </Label>
                <Select onValueChange={setDesiredLevel} required>
                  <SelectTrigger id="desiredLevel">
                    <SelectValue placeholder="Select level seeking" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="form1">Form 1</SelectItem>
                    <SelectItem value="form2">Form 2</SelectItem>
                    <SelectItem value="form3">Form 3</SelectItem>
                    <SelectItem value="form4">Form 4</SelectItem>
                    <SelectItem value="form5">Form 5 (L6)</SelectItem>
                    <SelectItem value="form6">Form 6 (U6)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pretty">
                <Upload className="h-5 w-5 text-primary" />
                Required Documents
              </CardTitle>
              <CardDescription>Upload clear scanned copies or photos of your documents.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Transfer Letter</Label>
                  <div className="flex items-center justify-center w-full">
                    <div className="relative w-full h-24 border-2 border-dashed border-border rounded-xl hover:border-primary/50 transition-colors flex flex-col items-center justify-center bg-background/50 cursor-pointer">
                      <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer" required />
                      <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Upload Transfer Letter</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Latest Academic Report</Label>
                  <div className="flex items-center justify-center w-full">
                    <div className="relative w-full h-24 border-2 border-dashed border-border rounded-xl hover:border-primary/50 transition-colors flex flex-col items-center justify-center bg-background/50 cursor-pointer">
                      <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer" required />
                      <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">Upload Report Card</span>
                    </div>
                  </div>
                </div>
              </div>

              {(desiredLevel === "form1") && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                  <Label className="text-primary italic">Grade 7 Results</Label>
                  <div className="flex items-center justify-center w-full">
                    <div className="relative w-full h-24 border-2 border-dashed border-primary/30 border-border rounded-xl hover:border-primary/50 transition-colors flex flex-col items-center justify-center bg-primary/5 cursor-pointer">
                      <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer" required />
                      <Download className="h-6 w-6 text-primary/60 mb-1" />
                      <span className="text-xs text-primary/70">Upload Grade 7 Results</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {(desiredLevel === "form5" || desiredLevel === "form6") && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                  <Label className="text-primary italic">O-Level Results</Label>
                  <div className="flex items-center justify-center w-full">
                    <div className="relative w-full h-24 border-2 border-dashed border-primary/30 border-border rounded-xl hover:border-primary/50 transition-colors flex flex-col items-center justify-center bg-primary/5 cursor-pointer">
                      <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer" required />
                      <Download className="h-6 w-6 text-primary/60 mb-1" />
                      <span className="text-xs text-primary/70">Upload O-Level Results Slip</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.01]"
            disabled={loading}
          >
            {loading ? "Processing..." : "Submit Enrollment Application"}
            <Send className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentPage;
