import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Search, Plus, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/hooks/useChat";
import { format } from "date-fns";
import { useContacts } from "@/hooks/useContacts";
import MessageTick from "@/components/MessageTick";

const StudentMessagesPage = () => {
  const { user } = useAuth();
  const { messages, loading: messagesLoading, sendMessage, markMessagesRead } = useChat(user?.id);
  const { contacts, getContactsByType, getContactById } = useContacts();
  const teachersList = useMemo(() => getContactsByType("Teacher").concat(getContactsByType("Admin")), [getContactsByType]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);
  const [composeData, setComposeData] = useState({ recipientId: '', message: '' });
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Mark messages read when conversation opened
  useEffect(() => {
    if (selectedContactId) {
      markMessagesRead(selectedContactId);
    }
  }, [selectedContactId, messages, markMessagesRead]);

  // Group messages into conversations
  const conversations = useMemo(() => {
    const groups: Record<string, { contactId: string, contactName: string, lastMessage: any, unreadCount: number }> = {};

    messages.forEach(m => {
      const otherId = m.senderId === user?.id ? m.receiverId : m.senderId;
      const otherName = m.senderId === user?.id ? m.receiverName : m.senderName;
      const contact = contacts.find(c => c.id === otherId);
      
      const defaultName = contact?.name || otherName || "Unknown Contact";

      if (!groups[otherId]) {
        groups[otherId] = {
          contactId: otherId,
          contactName: defaultName,
          lastMessage: m,
          unreadCount: m.isNew && m.receiverId === user?.id ? 1 : 0
        };
      } else {
        if (!groups[otherId].lastMessage.createdAt || (m.createdAt?.seconds || 0) > (groups[otherId].lastMessage.createdAt?.seconds || 0)) {
          groups[otherId].lastMessage = m;
        }
        if (m.isNew && m.receiverId === user?.id) {
          groups[otherId].unreadCount++;
        }
      }
    });

    return Object.values(groups).sort((a, b) => 
      (b.lastMessage.createdAt?.seconds || 0) - (a.lastMessage.createdAt?.seconds || 0)
    );
  }, [messages, user?.id, contacts]);

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

  const selectedContactInfo = getContactById(selectedContactId || '') || { id: selectedContactId, name: conversations.find(c => c.contactId === selectedContactId)?.contactName || "Contact" };

  const handleSend = async () => {
    if (!selectedContactId || !newMessage.trim() || !user) return;
    
    const contact = getContactById(selectedContactId) || { id: selectedContactId!, name: conversations.find(c => c.contactId === selectedContactId)?.contactName || "Contact" };

    try {
      await sendMessage({
        senderId: user.id,
        senderName: user.name,
        receiverId: contact.id,
        receiverName: contact.name,
        subject: "Reply",
        text: newMessage,
      });
      setNewMessage("");
    } catch (error) {
      alert("Failed to send message");
    }
  };

  const handleCompose = async () => {
    if (composeData.recipientId && composeData.message && user) {
       const recipient = teachersList.find(r => r.id === composeData.recipientId);
       if (!recipient) return;
       try {
         await sendMessage({
           senderId: user.id,
           senderName: user.name,
           receiverId: recipient.id,
           receiverName: recipient.name,
           subject: "New Student Message",
           text: composeData.message,
         });
         setIsComposeDialogOpen(false);
         setComposeData({ recipientId: '', message: '' });
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
      {/* Sidebar - WhatsApp Style */}
      <div className="w-[350px] border-r flex flex-col bg-card">
        <div className="p-4 bg-muted/30 border-b flex items-center justify-between">
          <Avatar className="h-10 w-10 ring-2 ring-background">
             <AvatarFallback className="bg-primary/10 text-primary uppercase font-bold">
               {user?.name?.substring(0, 2)}
             </AvatarFallback>
          </Avatar>
          <div className="flex gap-2">
             <Button variant="ghost" size="icon" onClick={() => setIsComposeDialogOpen(true)} className="rounded-full shadow-sm bg-primary/5 text-primary"><Plus className="h-5 w-5" /></Button>
             <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="h-5 w-5 text-muted-foreground" /></Button>
          </div>
        </div>

        <div className="p-2 px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search or start new chat" 
              className="pl-10 h-10 bg-muted/50 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <div
              key={conv.contactId}
              onClick={() => setSelectedContactId(conv.contactId)}
              className={`flex items-center gap-3 p-4 border-b cursor-pointer transition-all hover:bg-muted/40 ${
                selectedContactId === conv.contactId ? 'bg-muted/60' : ''
              }`}
            >
              <Avatar className="h-12 w-12 shrink-0">
                <AvatarFallback className="bg-primary/5 text-primary font-bold">
                  {conv.contactName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <p className="font-semibold text-sm truncate">{conv.contactName}</p>
                  <span className="text-[10px] text-muted-foreground">
                    {formatDate(conv.lastMessage.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground truncate w-full">
                    {conv.lastMessage.text}
                  </p>
                  {conv.unreadCount > 0 && (
                    <Badge className="bg-primary rounded-full h-5 w-5 flex items-center justify-center p-0 text-[10px] border-none ml-1">
                      {conv.unreadCount}
                    </Badge>
                  )}
                  {/* Subject hint if available */}
                  {!conv.unreadCount && (
                    <span className="text-[9px] uppercase font-bold text-muted-foreground/40">
                      {contacts.find(c => c.id === conv.contactId)?.role}
                    </span>
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
            {/* Chat Header */}
            <header className="px-4 py-2 border-b bg-muted/30 backdrop-blur-md flex items-center justify-between z-20">
              <div className="flex items-center gap-3">
                 <Avatar className="h-10 w-10">
                   <AvatarFallback className="bg-primary/10 text-primary font-bold">
                     {selectedContactInfo?.name.substring(0, 2).toUpperCase()}
                   </AvatarFallback>
                 </Avatar>
                 <div>
                    <h3 className="font-bold text-sm leading-none">{selectedContactInfo?.name}</h3>
                    <p className="text-[10px] text-emerald-500 mt-1 font-medium italic">Online</p>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground"><Search className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground"><MoreVertical className="h-5 w-5" /></Button>
              </div>
            </header>

            {/* Chat History */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-2 relative"
              style={{
                backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
                backgroundBlendMode: 'overlay',
                backgroundSize: '400px'
              }}
            >
              <div className="space-y-4">
                <AnimatePresence>
                  {selectedMessages.map((m) => (
                    <motion.div 
                      key={m.id} 
                      initial={{ opacity: 0, y: 5 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${m.senderId === user?.id ? "justify-end" : "justify-start"}`}
                    >
                      <div className={`relative max-w-[85%] min-w-[80px] p-2 px-3 rounded-xl shadow-sm ${
                        m.senderId === user?.id 
                          ? "bg-[#dcf8c6] text-gray-800 dark:bg-[#005c4b] dark:text-[#e9edef] rounded-tr-none wa-bubble-sent" 
                          : "bg-white text-gray-800 dark:bg-[#202c33] dark:text-[#e9edef] rounded-tl-none wa-bubble-received"
                      }`}>
                        <p className="text-[13.5px] leading-relaxed pr-10">{m.text}</p>
<div className={`absolute bottom-1 right-2 flex items-center gap-1 text-[9px] ${
                           m.senderId === user?.id ? "text-gray-500 dark:text-[#8696a0]" : "text-gray-400 dark:text-[#8696a0]"
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
              </div>
              <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <footer className="px-4 py-3 bg-muted/40 flex items-center gap-3">
              <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground"><Plus className="h-5 w-5" /></Button>
              <Input
                placeholder="Type a message"
                className="flex-1 bg-background border-none rounded-xl h-11 focus-visible:ring-0"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => {
                   if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleSend();
                   }
                }}
              />
              <Button 
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="bg-primary hover:bg-primary/90 h-11 w-11 rounded-full p-0 shadow-lg shrink-0"
              >
                <Send className="h-5 w-5 fill-current text-white" />
              </Button>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-muted/10">
            <div className="mb-8 p-8 bg-muted/40 rounded-full">
              <MessageSquare className="h-16 w-16 text-muted-foreground/30" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Secure Messaging</h2>
            <p className="mt-4 text-muted-foreground max-w-sm mx-auto">
              Send and receive messages to your teachers securely. Select a contact on the left to start a conversation.
            </p>
            <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
               <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
               </svg>
               Your personal messages are end-to-end encrypted
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
              <Label>Select Teacher or Admin</Label>
              <Select 
                value={composeData.recipientId} 
                onValueChange={(v) => setComposeData({...composeData, recipientId: v})}
              >
                <SelectTrigger><SelectValue placeholder="Choose contact..." /></SelectTrigger>
                <SelectContent>
                  {teachersList.map(r => (
                    <SelectItem key={r.id} value={r.id}>{r.name} ({r.role || r.type})</SelectItem>
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

export default StudentMessagesPage;