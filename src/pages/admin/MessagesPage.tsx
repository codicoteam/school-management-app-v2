import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, MessageCircle, Send, Search, Plus, MoreVertical, ShieldCheck, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useChat, Message } from "@/hooks/useChat";
import { format } from "date-fns";
import { openWhatsApp } from "@/lib/utils";
import { contacts } from "@/lib/contacts";

const allContacts = contacts;

const AdminMessagesPage = () => {
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useChat(user?.id);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const conversations = useMemo(() => {
    const groups: Record<string, { contactId: string, contactName: string, lastMessage: any, unreadCount: number, type: string }> = {};
    
    // Ensure static contacts are visible
    allContacts.forEach(c => {
      groups[c.id] = {
        contactId: c.id,
        contactName: c.name,
        lastMessage: { text: "No previous logs", createdAt: null },
        unreadCount: 0,
        type: c.type
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

  const selectedContactInfo = allContacts.find(c => c.id === selectedContactId);

  const handleSend = async () => {
    if (!selectedContactId || !newMessage.trim() || !user) return;
    
    const contact = allContacts.find(c => c.id === selectedContactId);
    if (!contact) return;

    try {
      await sendMessage({
        senderId: user.id,
        senderName: user.name,
        receiverId: contact.id,
        receiverName: contact.name,
        subject: "Admin Communication",
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
      <div className="w-[380px] border-r flex flex-col bg-card shrink-0">
        <header className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Avatar className="h-10 w-10 border-2 border-white/20">
                  <AvatarFallback className="bg-white/20 text-white font-bold">AD</AvatarFallback>
               </Avatar>
               <div>
                  <h1 className="font-bold text-sm">Control Center</h1>
                  <p className="text-[10px] opacity-80">School Administration</p>
               </div>
            </div>
            <div className="flex gap-1">
               <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-white"><ShieldCheck className="h-5 w-5" /></Button>
               <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-white"><MoreVertical className="h-5 w-5" /></Button>
            </div>
        </header>

        <div className="p-4 bg-muted/20">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                 placeholder="Search staff, parents, or students..." 
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
                      conv.type === 'Teacher' ? 'bg-blue-100 text-blue-600' : 
                      conv.type === 'Parent' ? 'bg-orange-100 text-orange-600' : 
                      conv.type === 'Admin' ? 'bg-purple-100 text-purple-600' :
                      'bg-green-100 text-green-600'
                    } font-bold`}>
                      {conv.contactName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                    conv.type === 'Teacher' ? 'bg-blue-500' : 
                    conv.type === 'Parent' ? 'bg-orange-500' : 
                    conv.type === 'Admin' ? 'bg-purple-500' :
                    'bg-green-500'
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
                      <h3 className="font-extrabold text-lg flex items-center gap-2">
                        {selectedContactInfo?.name}
                        <Badge variant="outline" className="text-[9px] h-4 uppercase">{selectedContactInfo?.type}</Badge>
                      </h3>
                      <p className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" /> Direct Admin Channel
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
                               <svg viewBox="0 0 16 11" width="16" height="11" fill="currentColor" className="text-blue-500">
                                  <path d="M11.133 1.341l-6.195 6.471-2.909-2.946-1.029 1.042 3.938 3.985 7.225-7.549-1.03-1.003zm3.837 0l-7.224 7.548-1.029-1.042 7.224-7.548 1.029 1.042z" />
                               </svg>
                             )}
                          </div>
                          <span className={`absolute -top-6 left-0 text-[10px] font-bold text-muted-foreground/60 transition-opacity opacity-0 group-hover:opacity-100`}>
                             {m.senderName}
                          </span>
                       </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
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
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                      {/* Add emoji or attach options here */}
                   </div>
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
                 <div className="absolute -top-2 -right-2 h-8 w-8 bg-emerald-500 rounded-full border-4 border-background flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4 text-white" />
                 </div>
              </div>
              <div>
                <h2 className="text-3xl font-extrabold text-foreground">Secure Admin Dispatch</h2>
                <p className="mt-2 text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  Monitor and manage communications between staff and guardians. Select a contact to intervene or initiate a message.
                </p>
              </div>
              <div className="flex gap-4">
                 <Button variant="outline" className="rounded-full gap-2 px-6"><Users className="h-5 w-5" /> All Staff</Button>
                 <Button variant="outline" className="rounded-full gap-2 px-6"><MessageSquare className="h-5 w-5" /> Guardian Center</Button>
              </div>
           </div>
         )}
      </div>
    </div>
  );
};

export default AdminMessagesPage;
