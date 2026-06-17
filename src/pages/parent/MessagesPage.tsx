import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send, Search, Plus, MoreVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useChat, Message } from "@/hooks/useChat";
import { formatDistanceToNow, format } from "date-fns";

import { contacts } from "@/lib/contacts";

const schoolContacts = contacts.filter(c => c.type === "Teacher" || c.type === "Admin");

const ParentMessagesPage = () => {
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useChat(user?.id);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  // Group messages for conversations
  const conversations = useMemo(() => {
    const groups: Record<string, { contactId: string, contactName: string, lastMessage: any, unreadCount: number }> = {};
    
    // Default list of school contacts
    schoolContacts.forEach(c => {
      groups[c.id] = {
        contactId: c.id,
        contactName: c.name,
        lastMessage: { text: "No interaction yet", createdAt: null },
        unreadCount: 0
      };
    });

    messages.forEach(m => {
      const otherId = m.senderId === user?.id ? m.receiverId : m.senderId;
      const otherName = m.senderId === user?.id ? m.receiverName : m.senderName;
      
      if (groups[otherId]) {
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
  }, [messages, user?.id]);

  const filteredConversations = conversations.filter(c => 
    c.contactName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedMessages = useMemo(() => {
    if (!selectedContactId) return [];
    return messages.filter(m => 
      m.senderId === selectedContactId || m.receiverId === selectedContactId
    ).sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
  }, [messages, selectedContactId]);

  const selectedContactInfo = schoolContacts.find(c => c.id === selectedContactId);

  const handleSend = async () => {
    if (!selectedContactId || !newMessage.trim() || !user) return;
    
    const contact = schoolContacts.find(c => c.id === selectedContactId);
    if (!contact) return;

    try {
      await sendMessage({
        senderId: user.id,
        senderName: user.name,
        receiverId: contact.id,
        receiverName: contact.name,
        subject: "General Inquiry",
        text: newMessage,
      });
      setNewMessage("");
    } catch (error) {
      alert("Failed to send message");
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
      <div className="w-[350px] border-r flex flex-col bg-card shrink-0">
        <header className="p-4 bg-muted/30 border-b flex items-center justify-between">
           <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">PG</AvatarFallback>
           </Avatar>
           <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-full"><MessageSquare className="h-5 w-5 text-muted-foreground" /></Button>
              <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="h-5 w-5 text-muted-foreground" /></Button>
           </div>
        </header>

        <div className="p-3 px-4">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                 placeholder="Search staff or archive" 
                 className="pl-9 h-10 bg-muted/50 border-none rounded-xl"
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto">
           {filteredConversations.map(conv => (
             <div 
               key={conv.contactId}
               onClick={() => setSelectedContactId(conv.contactId)}
               className={`flex items-center gap-3 p-4 border-b cursor-pointer transition-colors hover:bg-muted/30 ${
                  selectedContactId === conv.contactId ? 'bg-muted/50' : ''
               }`}
             >
                <Avatar className="h-12 w-12 shrink-0">
                   <AvatarFallback className="bg-accent/10 text-accent font-bold">
                     {conv.contactName.substring(0, 2).toUpperCase()}
                   </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-center mb-0.5">
                      <p className="font-semibold text-sm truncate">{conv.contactName}</p>
                      <span className="text-[10px] text-muted-foreground">{formatDate(conv.lastMessage.createdAt)}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground truncate w-full">{conv.lastMessage.text}</p>
                      {conv.unreadCount > 0 && (
                        <Badge className="bg-emerald-500 rounded-full h-5 w-5 flex items-center justify-center p-0 text-[10px] ml-1">
                          {conv.unreadCount}
                        </Badge>
                      )}
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
             <header className="px-4 py-2 border-b bg-muted/30 backdrop-blur-md flex items-center justify-between z-20">
                <div className="flex items-center gap-3">
                   <Avatar className="h-10 w-10">
                      <AvatarFallback>{selectedContactInfo?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                   </Avatar>
                   <div>
                      <h3 className="font-bold text-sm leading-none">{selectedContactInfo?.name}</h3>
                      <p className="text-[10px] text-emerald-500 mt-1 font-medium ring-1 ring-emerald-500/20 px-1 rounded inline-block">Staff</p>
                   </div>
                </div>
                <div className="flex items-center gap-1">
                   <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground"><MoreVertical className="h-5 w-5" /></Button>
                </div>
             </header>

             <div 
               className="flex-1 overflow-y-auto p-4 space-y-4"
               style={{
                 backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
                 backgroundBlendMode: 'overlay',
                 backgroundSize: '400px'
               }}
             >
                <AnimatePresence>
                  {selectedMessages.map(m => (
                    <motion.div 
                      key={m.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${m.senderId === user?.id ? "justify-end" : "justify-start"}`}
                    >
                       <div className={`relative max-w-[85%] p-2 px-3 rounded-xl shadow-sm ${
                         m.senderId === user?.id 
                           ? "bg-[#dcf8c6] text-gray-800 dark:bg-[#005c4b] dark:text-[#e9edef] rounded-tr-none wa-bubble-sent" 
                           : "bg-white text-gray-800 dark:bg-[#202c33] dark:text-[#e9edef] rounded-tl-none wa-bubble-received"
                       }`}>
                          <p className="text-[13.5px] leading-relaxed pr-10">{m.text}</p>
                          <div className={`absolute bottom-1 right-2 flex items-center gap-1 text-[9px] ${
                             m.senderId === user?.id ? "text-gray-500" : "text-gray-400"
                          }`}>
                             {formatDate(m.createdAt)}
                             {m.senderId === user?.id && (
                               <svg viewBox="0 0 16 11" width="14" height="10" fill="currentColor" className="text-blue-500">
                                  <path d="M11.133 1.341l-6.195 6.471-2.909-2.946-1.029 1.042 3.938 3.985 7.225-7.549-1.03-1.003zm3.837 0l-7.224 7.548-1.029-1.042 7.224-7.548 1.029 1.042z" />
                               </svg>
                             )}
                          </div>
                       </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>

             <footer className="px-4 py-3 bg-muted/40 flex items-center gap-3">
                <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground"><Plus className="h-5 w-5" /></Button>
                <Input 
                   placeholder="Message school..."
                   className="flex-1 bg-background border-none rounded-xl h-11"
                   value={newMessage}
                   onChange={e => setNewMessage(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <Button 
                   onClick={handleSend}
                   disabled={!newMessage.trim()}
                   className="bg-emerald-500 hover:bg-emerald-600 h-11 w-11 rounded-full p-0 shadow-lg shrink-0"
                >
                   <Send className="h-5 w-5 fill-current" />
                </Button>
             </footer>
           </>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
              <div className="mb-6 p-6 bg-emerald-100 rounded-full dark:bg-emerald-900/20">
                 <MessageSquare className="h-12 w-12 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Guardian Helpdesk</h2>
              <p className="mt-2 text-muted-foreground max-w-sm">
                Direct channel to your children's teachers and school administration. Select a contact to talk.
              </p>
           </div>
         )}
      </div>
    </div>
  );
};

export default ParentMessagesPage;