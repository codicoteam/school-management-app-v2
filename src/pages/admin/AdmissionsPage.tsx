import { useState, useEffect } from "react";
import { subscribe, updateItem } from "@/lib/localDb";
import {
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  MoreHorizontal, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  currentLevel: string;
  pastSchool: string;
  desiredLevel: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: any;
}

const AdminAdmissionsPage = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    const unsubscribe = subscribe<Application>("applications", (apps) => {
      const sorted = [...apps].sort(
        (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
      setApplications(sorted);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      updateItem("applications", id, { status });
      toast.success(`Application updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-emerald-500">Approved</Badge>;
      case 'rejected': return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admissions & Applications</h1>
          <p className="text-muted-foreground italic">Manage prospective student applications.</p>
        </div>
      </div>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>A list of students seeking enrollment.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8"><Clock className="animate-spin h-8 w-8 text-primary" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Level Seeking</TableHead>
                  <TableHead>Past School</TableHead>
                  <TableHead>Date Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.fullName}</TableCell>
                    <TableCell className="uppercase">{app.desiredLevel}</TableCell>
                    <TableCell>{app.pastSchool}</TableCell>
                    <TableCell>
                      {app.submittedAt ? format(new Date(app.submittedAt), "MMM d, yyyy") : "N/A"}
                    </TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedApp(app)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(app.id, 'approved')} className="text-emerald-600">
                            <CheckCircle className="mr-2 h-4 w-4" /> Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateStatus(app.id, 'rejected')} className="text-rose-600">
                            <XCircle className="mr-2 h-4 w-4" /> Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {applications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground italic">
                      No applications found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Application Details Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>Full details for {selectedApp?.fullName}</DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-1">
                <Label className="text-xs uppercase text-muted-foreground">Contact Info</Label>
                <div className="text-sm font-medium">{selectedApp.email}</div>
                <div className="text-sm">{selectedApp.phone}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase text-muted-foreground">Current Status</Label>
                <div>{getStatusBadge(selectedApp.status)}</div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase text-muted-foreground">Academics</Label>
                <div className="text-sm">Current: <span className="uppercase font-medium">{selectedApp.currentLevel}</span></div>
                <div className="text-sm">Seeking: <span className="uppercase font-medium text-primary">{selectedApp.desiredLevel}</span></div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase text-muted-foreground">Previous Institution</Label>
                <div className="text-sm font-medium">{selectedApp.pastSchool}</div>
              </div>
              <div className="col-span-2 border-t pt-4 mt-4">
                <Label className="text-xs uppercase text-muted-foreground mb-2 block">Available Documents</Label>
                <div className="flex gap-3">
                   <Button variant="outline" size="sm" className="gap-2">
                     <FileText className="h-4 w-4" /> Transfer Letter
                   </Button>
                   <Button variant="outline" size="sm" className="gap-2">
                     <FileText className="h-4 w-4" /> Academic Report
                   </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAdmissionsPage;
