import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Search, Plus, MoreVertical, ShieldCheck, Users, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/hooks/useChat";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useContacts } from "@/hooks/useContacts";
import MessageTick from "@/components/MessageTick";

const TeacherMessagesPage = () => {
  const { user } = useAuth();
  const { messages, loading: messagesLoading, sendMessage, markMessagesRead } = useChat(user?.id);
  const { contacts: allTeacherContacts, getContactsByType, getContactById } = useContacts();
  const studentContacts = useMemo(() => getContactsByType("Student"), [getContactsByType]);
  const parentContacts = useMemo(() => getContactsByType("Parent"), [getContactsByType]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);
  const [composeData, setComposeData] = useState({
    recipientType: 'student',
    recipientId: '',
    subject: '',
    message: '',
  });
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Mark messages read when conversation opened
  useEffect(() => {
    if (selectedContactId) {
      markMessagesRead(selectedContactId);
    }
  }, [selectedContactId, markMessagesRead]);

  const conversations = useMemo(() => {
    const groups: Record<string, { contactId: string, contactName: string, lastMessage: any, unreadCount: number, type: string }> = {};
    
    messages.forEach(m => {
      const otherId = m.senderId === user?.id ? m.receiverId : m.senderId;
      const otherName = m.senderId === user?.id ? m.receiverName : m.senderName;
      const contact = allTeacherContacts.find(c => c.id === otherId);
      const defaultName = contact?.name || otherName || "Unknown Contact";
      
      if (!groups[otherId] || (m.createdAt?.seconds || 0) > (groups[otherId].lastMessage.createdAt?.seconds || 0)) {
        groups[otherId] = {
          contactId: otherId,
          contactName: defaultName,
          lastMessage: m,
          unreadCount: (groups[otherId]?.unreadCount || 0) + (m.isNew && m.receiverId === user?.id ? 1 : 0),
          type: contact?.type || "Contact"
        };
      } else if (m.isNew && m.receiverId === user?.id) {
        groups[otherId].unreadCount++;
      }
    });

    return Object.values(groups).sort((a, b) => 
      (b.lastMessage.createdAt?.seconds || 0) - (a.lastMessage.createdAt?.seconds || 0)
    );
  }, [messages, user?.id, allTeacherContacts]);

  const filteredConversations = conversations.filter(c => 
    c.contactName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedMessages = useMemo(() => {
    if (!selectedContactId) return [];
    return messages.filter(m => 
      m.senderId === selectedContactId || m.receiverId === selectedContactId
    ).sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
  }, [messages, selectedContactId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedMessages]);

  const selectedContactInfo = getContactById(selectedContactId || '') || conversations.find(c => c.contactId === selectedContactId) && { id: selectedContactId!, name: conversations.find(c => c.contactId === selectedContactId)?.contactName || "Contact", type: "Contact" };

  const handleSend = async () => {
    if (!selectedContactId || !newMessage.trim() || !user) return;
    
    let contact = allTeacherContacts.find(c => c.id === selectedContactId);
    if (!contact) {
      const recent = conversations.find(c => c.contactId === selectedContactId);
      if (recent) {
        contact = { id: recent.contactId, name: recent.contactName, type: "Student" } as any;
      }
    }
    if (!contact) return;

    try {
      await sendMessage({
        senderId: user.id,
        senderName: user.name,
        receiverId: contact.id,
        receiverName: contact.name,
        subject: "Teacher Communication",
        text: newMessage,
      });
      setNewMessage("");
    } catch (error) {
      alert("Failed to send message");
    }
  };

  const handleCompose = async () => {
    if (composeData.recipientId && composeData.message && user) {
       const recipient = allTeacherContacts.find(r => r.id === composeData.recipientId);
       if (!recipient) return;
       try {
         await sendMessage({
           senderId: user.id,
           senderName: user.name,
           receiverId: recipient.id,
           receiverName: recipient.name,
           subject: composeData.subject || "Teacher Note",
           text: composeData.message,
         });
         setIsComposeDialogOpen(false);
         setComposeData({ recipientType: 'student', recipientId: '', subject: '', message: '' });
         setSelectedContactId(recipient.id);
       } catch (error) {
         alert("Failed to send");
       }
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    try {
      const date = timestamp.toDate();
      if (format(new Date(), 'yyyyMMdd') === format(date, 'yyyyMMdd')) {
         return format(date, 'HH:mm');
      }
      return format(date, 'MMM d');
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-background border rounded-2xl overflow-hidden shadow-2xl">
      {/* Sidebar */}
      <div className="w-[380px] border-r flex flex-col bg-card shrink-0">
        <header className="p-4 bg-primary text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Avatar className="h-10 w-10 border-2 border-white/20">
                  <AvatarFallback className="bg-white/20 text-white font-bold">T</AvatarFallback>
               </Avatar>
               <div>
                  <h1 className="font-bold text-sm">Classroom Chat</h1>
                  <p className="text-[10px] opacity-80">Teacher Portal</p>
               </div>
            </div>
            <div className="flex gap-1">
               <Button variant="ghost" size="icon" onClick={() => setIsComposeDialogOpen(true)} className="rounded-full hover:bg-white/10 text-white">
                 <Plus className="h-5 w-5" />
               </Button>
               <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-white">
                 <MoreVertical className="h-5 w-5" />
               </Button>
            </div>
        </header>

        <div className="p-4 bg-muted/20">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                 placeholder="Search student or parent..." 
                 className="pl-10 h-11 bg-background shadow-sm border-none rounded-xl"
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
           {filteredConversations.map(conv => (
             <div 
               key={conv.contactId}
               onClick={() => setSelectedContactId(conv.contactId)}
               className={`group flex items-center gap-3 p-4 border-b cursor-pointer transition-all hover:bg-muted/30 ${
                  selectedContactId === conv.contactId ? 'bg-muted/50 border-l-4 border-l-primary' : ''
               }`}
             >
                <div className="relative">
                  <Avatar className="h-12 w-12 shrink-0 shadow-sm transition-transform group-hover:scale-105">
                    <AvatarFallback className={`${
                      conv.type === 'Parent' ? 'bg-primary/10 text-primary' : 
                      conv.type === 'Admin' ? 'bg-secondary/10 text-secondary' :
                      conv.type === 'Teacher' ? 'bg-accent/10 text-accent' :
                      'bg-primary/5 text-primary'
                    } font-bold`}>
                      {conv.contactName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                    conv.type === 'Teacher' ? 'bg-accent' : 
                    conv.type === 'Parent' ? 'bg-primary' : 
                    conv.type === 'Admin' ? 'bg-secondary' :
                    'bg-primary/60'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-center mb-0.5">
                      <p className="font-bold text-sm truncate">{conv.contactName}</p>
                      <span className="text-[10px] text-muted-foreground">{formatDate(conv.lastMessage.createdAt)}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground truncate w-full flex items-center gap-1">
                        <span className="text-[9px] uppercase font-bold opacity-70">[{conv.type}]</span> {conv.lastMessage.text}
                      </p>
                      {conv.unreadCount > 0 && (
                        <Badge className="bg-primary rounded-full h-5 w-5 flex items-center justify-center p-0 text-[10px] ml-1 scale-in-center">
                          {conv.unreadCount}
                        </Badge>
                      )}
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#efeae2] dark:bg-[#0b141a] relative">
         {selectedContactId ? (
           <>
             {/* Header */}
             <header className="px-6 py-3 border-b bg-muted/40 backdrop-blur-md flex items-center justify-between z-30 shadow-sm">
                <div className="flex items-center gap-4">
                   <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                      <AvatarFallback className="bg-primary/5 text-primary font-bold">
                        {selectedContactInfo?.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                   </Avatar>
                   <div>
                      <h3 className="font-extrabold text-lg flex items-center gap-2 text-foreground">
                        {selectedContactInfo?.name}
                        <Badge variant="outline" className="text-[9px] h-4 uppercase">{selectedContactInfo?.type}</Badge>
                      </h3>
                      <p className="text-xs text-primary font-bold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" /> End-to-end encrypted
                      </p>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground"><MoreVertical className="h-5 w-5" /></Button>
                </div>
             </header>

{/* Messages */}
              <div 
                className="flex-1 overflow-y-auto p-6 space-y-4"
                style={{
                  backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
                  backgroundBlendMode: 'overlay',
                  backgroundSize: '400px'
                }}
              >
                <div className="flex justify-center mb-6">
                   <Badge className="bg-muted-foreground/10 text-muted-foreground border-none text-[10px] rounded-sm px-3 uppercase tracking-widest font-bold">
                     Today
                   </Badge>
                </div>
                <AnimatePresence>
                  {selectedMessages.map(m => (
                    <motion.div 
                      key={m.id}
                      initial={{ opacity: 0, x: m.senderId === user?.id ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${m.senderId === user?.id ? "justify-end" : "justify-start"}`}
                    >
                       <div className={`relative max-w-[80%] min-w-[120px] p-3 rounded-2xl shadow-md ${
                         m.senderId === user?.id 
                           ? "bg-[#dcf8c6] text-gray-800 dark:bg-[#005c4b] dark:text-[#e9edef] rounded-tr-none wa-bubble-sent" 
                           : "bg-white text-gray-800 dark:bg-[#202c33] dark:text-[#e9edef] rounded-tl-none wa-bubble-received"
                       }`}>
                          <p className="text-[14px] leading-relaxed pr-10 font-medium whitespace-pre-wrap">{m.text}</p>
                          <div className={`absolute bottom-1 right-2 flex items-center gap-1 text-[10px] ${
                             m.senderId === user?.id ? "text-gray-500/80" : "text-gray-400"
                          }`}>
                             {formatDate(m.createdAt)}
{m.senderId === user?.id && (
                                 <MessageTick status={m.status} isSender={m.senderId === user?.id} className="h-4 w-4" />
                               )}
                          </div>
                       </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={chatEndRef} />
             </div>

             {/* Footer */}
             <footer className="px-6 py-4 bg-muted/30 backdrop-blur-md flex items-center gap-4">
                <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-primary rounded-full hover:bg-muted"><Plus className="h-6 w-6" /></Button>
                <div className="flex-1 relative">
                   <Input 
                      placeholder="Message contact..."
                      className="w-full bg-background border-none rounded-2xl h-12 shadow-inner px-5 pr-12 focus-visible:ring-1 focus-visible:ring-primary/20"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                   />
                </div>
                <Button 
                   onClick={handleSend}
                   disabled={!newMessage.trim()}
                   className="bg-primary hover:bg-primary/90 h-12 w-12 rounded-full p-0 shadow-lg shrink-0 transition-all active:scale-95"
                >
                   <Send className="h-6 w-6 fill-current text-white" />
                </Button>
             </footer>
           </>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
              <div className="relative">
                 <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center text-primary animate-bounce-slow">
                    <MessageCircle className="h-12 w-12" />
                 </div>
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-foreground">Teacher-Parent Bridge</h2>
                <p className="mt-2 text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Start a private conversation with your students or their guardians. All messages are private and secure.
                </p>
              </div>
           </div>
         )}
      </div>

      {/* Compose Message Dialog */}
      <Dialog open={isComposeDialogOpen} onOpenChange={setIsComposeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>New Chat</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Who are you messaging?</Label>
              <Select 
                value={composeData.recipientType} 
                onValueChange={(v) => setComposeData({...composeData, recipientType: v, recipientId: ''})}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Select Recipient</Label>
              <Select 
                value={composeData.recipientId} 
                onValueChange={(v) => setComposeData({...composeData, recipientId: v})}
              >
                <SelectTrigger><SelectValue placeholder="Chose contact..." /></SelectTrigger>
                <SelectContent>
                  {(composeData.recipientType === 'student' ? studentContacts : parentContacts).map(r => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
               <Label>Message</Label>
               <Textarea 
                 className="min-h-[100px]" 
                 placeholder="Type your first message..."
                 value={composeData.message}
                 onChange={e => setComposeData({...composeData, message: e.target.value})}
               />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsComposeDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCompose} className="bg-primary hover:bg-primary/90">Start Chat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherMessagesPage;