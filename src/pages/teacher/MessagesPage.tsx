import React, { useState } from 'react';
import {
  Send,
  MessageCircle,
  Search,
  Plus,
  MoreVertical,
  Clock,
  User,
  Users,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  type: 'individual' | 'parent' | 'class';
  subject: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  recipientType: string;
}

interface Conversation {
  id: string;
  name: string;
  type: 'student' | 'parent' | 'class';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatar: string;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Arjun Sharma',
    type: 'student',
    lastMessage: 'Thank you for the assignment submission deadline extension.',
    lastMessageTime: '2 hours ago',
    unreadCount: 0,
    avatar: 'AS',
  },
  {
    id: '2',
    name: 'Priya Verma (Parent)',
    type: 'parent',
    lastMessage: 'Great to hear about her excellent performance in the exam!',
    lastMessageTime: '4 hours ago',
    unreadCount: 1,
    avatar: 'PV',
  },
  {
    id: '3',
    name: 'Class 10A',
    type: 'class',
    lastMessage: 'Tomorrow is the last day to submit your projects.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    avatar: 'C10A',
  },
  {
    id: '4',
    name: 'Rahul Kumar',
    type: 'student',
    lastMessage: 'Can you review my assignment?',
    lastMessageTime: '1 day ago',
    unreadCount: 2,
    avatar: 'RK',
  },
  {
    id: '5',
    name: 'Neha Singh (Parent)',
    type: 'parent',
    lastMessage: 'When is the next parent-teacher meeting?',
    lastMessageTime: '2 days ago',
    unreadCount: 0,
    avatar: 'NS',
  },
];

const mockMessages: Message[] = [
  {
    id: 'm1',
    senderId: 's1',
    senderName: 'Arjun Sharma',
    senderAvatar: 'AS',
    type: 'individual',
    subject: 'Assignment Help',
    content:
      "Hi Sir/Madam, Could you please explain chapter 3? I'm having trouble understanding the concepts.",
    timestamp: '2024-04-20 10:30',
    isRead: true,
    recipientType: 'You',
  },
  {
    id: 'm2',
    senderId: 'teacher',
    senderName: 'You',
    senderAvatar: 'T',
    type: 'individual',
    subject: 'Re: Assignment Help',
    content:
      'Sure Arjun, I can help. Let me schedule a doubt clearing session after school tomorrow.',
    timestamp: '2024-04-20 14:00',
    isRead: true,
    recipientType: 'Arjun Sharma',
  },
];

interface MessageHistoryItem {
  id: string;
  recipient: string;
  type: string;
  subject: string;
  message: string;
  timestamp: string;
  status: string;
}

const mockMessageHistory: MessageHistoryItem[] = [
  {
    id: 'h1',
    recipient: 'Arjun Sharma',
    type: 'student',
    subject: 'Assignment Reminder',
    message: 'Please submit your assignment by tomorrow.',
    timestamp: '2024-04-19 10:00',
    status: 'sent',
  },
];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(mockConversations[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('conversations');
  const [composeData, setComposeData] = useState({
    recipientType: 'student',
    recipient: '',
    subject: '',
    message: '',
  });

  const filteredConversations = mockConversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setNewMessage('');
    }
  };

  const handleComposeMessage = () => {
    if (
      composeData.recipient &&
      composeData.subject &&
      composeData.message
    ) {
      setIsComposeDialogOpen(false);
      setComposeData({
        recipientType: 'student',
        recipient: '',
        subject: '',
        message: '',
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-600">
            Communicate with students and parents
          </p>
        </div>
        <Button
          size="sm"
          className="gap-2"
          onClick={() => setIsComposeDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Message
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="sent-messages">Sent Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="mt-6">
          {/* Main Layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b pb-4">
              <CardTitle className="text-lg">Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-9"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarFallback className="text-xs">
                          {conv.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-sm text-gray-900 truncate">
                            {conv.name}
                          </p>
                          {conv.unreadCount > 0 && (
                            <Badge
                              variant="default"
                              className="text-xs flex-shrink-0"
                            >
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 truncate">
                          {conv.lastMessage}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {conv.lastMessageTime}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Message Thread */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="text-xs">
                        {selectedConversation.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedConversation.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {selectedConversation.type === 'student'
                          ? 'Student'
                          : selectedConversation.type === 'parent'
                            ? 'Parent'
                            : 'Class'}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {mockMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === 'teacher' ? 'justify-end' : 'justify-start'
                      }`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${msg.senderId === 'teacher'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-900'
                        }`}
                    >
                      <p className="text-sm font-medium mb-1">{msg.subject}</p>
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-2 ${msg.senderId === 'teacher'
                            ? 'text-blue-100'
                            : 'text-gray-600'
                          }`}
                      >
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Message Input */}
              <div className="border-t p-4 space-y-3">
                <Textarea
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="h-20 resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="h-[600px] flex items-center justify-center">
              <CardContent className="text-center">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Select a conversation to start</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Message All Students
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Message All Parents
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Class Announcement
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Absence Alert
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
        </TabsContent>

        <TabsContent value="sent-messages" className="mt-6">
          <Card className="h-[600px] flex items-center justify-center">
            <CardContent className="text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No sent messages yet</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Compose Message Dialog */}
      <Dialog open={isComposeDialogOpen} onOpenChange={setIsComposeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="recipientType">Recipient Type</Label>
              <select
                id="recipientType"
                value={composeData.recipientType}
                onChange={(e) =>
                  setComposeData({
                    ...composeData,
                    recipientType: e.target.value,
                  })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="class">Class</option>
              </select>
            </div>
            <div>
              <Label htmlFor="recipient">Recipient</Label>
              <Select
                value={composeData.recipient}
                onValueChange={(value) => setComposeData({ ...composeData, recipient: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="arjun">Arjun Sharma</SelectItem>
                  <SelectItem value="priya">Priya Verma</SelectItem>
                  <SelectItem value="rahul">Rahul Kumar</SelectItem>
                  <SelectItem value="neha">Neha Singh</SelectItem>
                  <SelectItem value="class10a">Class 10A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={composeData.subject}
                onChange={(e) =>
                  setComposeData({ ...composeData, subject: e.target.value })
                }
                placeholder="Message subject"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={composeData.message}
                onChange={(e) =>
                  setComposeData({ ...composeData, message: e.target.value })
                }
                placeholder="Type your message"
                className="h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsComposeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleComposeMessage}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}