import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Calendar,
  Clock,
  MapPin,
  TrendingUp,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'event' | 'deadline' | 'achievement';
  date: string; // ISO date string
  isRead: boolean;
}

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Welcome Back to School!',
    content: 'We hope everyone had a wonderful break and is ready for an exciting new term.',
    type: 'general',
    date: '2024-04-01',
    isRead: true,
  },
  {
    id: '2',
    title: 'Midterm Exams Schedule',
    content: 'Midterm examinations will commence on Monday, April 15th. Please refer to the examination timetable posted on the notice board.',
    type: 'event',
    date: '2024-04-10',
    isRead: false,
  },
  {
    id: '3',
    title: 'Science Fair Registration',
    content: 'Students interested in participating in the annual science fair should register with their science teachers by April 20th.',
    type: 'deadline',
    date: '2024-04-05',
    isRead: false,
  },
  {
    id: '4',
    title: 'Congratulations to Our Chess Team!',
    content: 'Our school chess team has won the regional championship! Well done to all participants.',
    type: 'achievement',
    date: '2024-04-08',
    isRead: true,
  },
];

export default function AnnouncementsPage() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isAnnouncementDetailOpen, setIsAnnouncementDetailOpen] = useState(false);
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'general' as const,
    date: '',
  });

  const handleAddAnnouncement = () => {
    if (newAnnouncement.title && newAnnouncement.content && newAnnouncement.date) {
      setIsAddAnnouncementOpen(false);
      // In a real app, you would save to database and refresh list
      setNewAnnouncement({
        title: '',
        content: '',
        type: 'general' as const,
        date: '',
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-sm text-gray-600">
            Stay updated with important school news and events
          </p>
        </div>
        <Button
          size="sm"
          className="gap-2"
          onClick={() => setIsAddAnnouncementOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Announcement
        </Button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {mockAnnouncements.map((announcement) => (
          <div
            key={announcement.id}
            onClick={() => {
              setSelectedAnnouncement(announcement);
              setIsAnnouncementDetailOpen(true);
            }}
            className={`p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${
              !announcement.isRead ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${getAnnouncementBgColor(
                announcement.type
              )} text-white`}>
                {getAnnouncementIcon(announcement.type)}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {announcement.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{announcement.content}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(announcement.date).toLocaleDateString()}</span>
                  <Clock className="h-3 w-3" />
                  <span>{new Date(announcement.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Announcement Detail Dialog */}
      {selectedAnnouncement && (
        <Dialog open={isAnnouncementDetailOpen} onOpenChange={setIsAnnouncementDetailOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getAnnouncementIcon(selectedAnnouncement.type)}
                {selectedAnnouncement.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-xs uppercase font-semibold text-gray-600">
                  Type
                </Label>
                <Badge className={getAnnouncementBgColor(selectedAnnouncement.type)} text-white>
                  {selectedAnnouncement.type}
                </Badge>
              </div>
              <div>
                <Label className="text-xs uppercase font-semibold text-gray-600">
                  Date
                </Label>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(selectedAnnouncement.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <Label className="text-xs uppercase font-semibold text-gray-600">
                  Title
                </Label>
                <h2 className="font-bold text-gray-900">{selectedAnnouncement.title}</h2>
              </div>
              <div>
                <Label className="text-xs uppercase font-semibold text-gray-600">
                  Content
                </Label>
                <p className="text-sm text-gray-700">{selectedAnnouncement.content}</p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsAnnouncementDetailOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Announcement Dialog */}
      <Dialog open={isAddAnnouncementOpen} onOpenChange={setIsAddAnnouncementOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Announcement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="announcementTitle">Title</Label>
              <Input
                id="announcementTitle"
                value={newAnnouncement.title}
                onChange={(e) =>
                  setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
                }
                placeholder="Enter announcement title"
              />
            </div>
            <div>
              <Label htmlFor="announcementType">Type</Label>
              <Select value={newAnnouncement.type} onValueChange={(value) =>
                setNewAnnouncement({ ...newAnnouncement, type: value as const })
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="announcementDate">Date</Label>
              <Input
                id="announcementDate"
                type="date"
                value={newAnnouncement.date}
                onChange={(e) =>
                  setNewAnnouncement({ ...newAnnouncement, date: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="announcementContent">Content</Label>
              <Textarea
                id="announcementContent"
                value={newAnnouncement.content}
                onChange={(e) =>
                  setNewAnnouncement({ ...newAnnouncement, content: e.target.value })
                }
                placeholder="Enter announcement content"
                className="h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddAnnouncementOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddAnnouncement}>Post Announcement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Helper functions
function getAnnouncementIcon(type: string) {
  switch (type) {
    case 'general':
      return <MessageSquare className="h-5 w-5" />;
    case 'event':
      return <Calendar className="h-5 w-5" />;
    case 'deadline':
      return <Clock className="h-5 w-5" />;
    case 'achievement':
      return <Award className="h-5 w-5" />;
    default:
      return <MessageSquare className="h-5 w-5" />;
  }
}

function getAnnouncementBgColor(type: string) {
  switch (type) {
    case 'general':
      return 'bg-blue-500';
    case 'event':
      return 'bg-green-500';
    case 'deadline':
      return 'bg-orange-500';
    case 'achievement':
      return 'bg-purple-500';
    default:
      return 'bg-gray-500';
  }
}