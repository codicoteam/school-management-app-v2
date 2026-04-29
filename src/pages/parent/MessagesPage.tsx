import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send, Search, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface Message {
  id: number;
  from: string;
  subject: string;
  message: string;
  date: string;
  isNew: boolean;
}

const STORAGE_KEY = "parent_messages";

const initialMessages: Message[] = [
  { id: 1, from: "Mr. Mhlanga (Math)", subject: "Tawanda's Progress", message: "Your child is performing well in class. Keep up the good work!", date: "1 day ago", isNew: true },
  { id: 2, from: "School Office", subject: "Fee Reminder", message: "Kindly clear the outstanding balance by 30 April.", date: "3 days ago", isNew: false },
];

const loadMessages = (): Message[] => { try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : initialMessages; } catch { return initialMessages; } };

const ParentMessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [search, setSearch] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const filtered = messages.filter(m => m.from.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase()));

  const sendMessage = () => {
    if (!newMessage) return;
    const msg: Message = { id: Date.now(), from: "You", subject: "Inquiry", message: newMessage, date: "Just now", isNew: false };
    setMessages([msg, ...messages]);
    setComposeOpen(false);
    setNewMessage("");
    alert("Message sent to school!");
  };

  const deleteMessage = (id: number) => setMessages(messages.filter(m => m.id !== id));

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Messages</h1>
          <p className="mt-1 text-sm text-muted-foreground">Communicate with teachers and school.</p>
        </div>
        <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
          <DialogTrigger asChild><Button className="bg-accent text-accent-foreground hover:bg-accent/90"><Send className="h-4 w-4 mr-2" /> New Message</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Send Message</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2"><Label>Recipient</Label>
                <Select value={recipient} onValueChange={setRecipient}>
                  <SelectTrigger><SelectValue placeholder="Select recipient" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">Class Teacher</SelectItem>
                    <SelectItem value="office">School Office</SelectItem>
                    <SelectItem value="finance">Finance Dept</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2"><Label>Subject</Label><Input placeholder="Message subject" /></div>
              <div className="grid gap-2"><Label>Message</Label><Textarea placeholder="Type your message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} rows={4} /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setComposeOpen(false)}>Cancel</Button><Button onClick={sendMessage}><Send className="h-4 w-4 mr-2" /> Send</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <Card className="border-none shadow-md">
        <CardContent className="p-4">
          <div className="relative max-w-md mb-4"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search messages..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" /></div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filtered.map(m => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className={`border-none shadow-md ${m.isNew ? "border-l-4 border-l-accent" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent"><MessageSquare className="h-5 w-5" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2"><p className="font-semibold">{m.from}</p><Badge variant="outline">{m.subject}</Badge>{m.isNew && <Badge className="bg-accent/15 text-accent">New</Badge>}</div>
                      <p className="mt-1 text-sm text-muted-foreground">{m.message}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{m.date}</p>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => deleteMessage(m.id)} className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ParentMessagesPage;