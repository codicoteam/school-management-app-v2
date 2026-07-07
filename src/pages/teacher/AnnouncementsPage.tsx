import React, { useState, useEffect } from 'react';
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
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Announcement {
  id: string;
  title: string;
  message?: string;
  content?: string;
  type?: 'general' | 'event' | 'deadline' | 'achievement';
  created_at?: string;
  date?: string;
  isRead?: boolean;
}

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isAnnouncementDetailOpen, setIsAnnouncementDetailOpen] = useState(false);
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    type: 'general' as const,
  });

  // Load announcements on component mount
  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await api.getAnnouncements();
        setAnnouncements(data || []);
      } catch (error) {
        console.error("Failed to load announcements:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAnnouncements();
  }, []);

  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await api.createAnnouncement({
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        type: newAnnouncement.type,
      });
      alert("Announcement created successfully");
      setNewAnnouncement({ title: '', content: '', type: 'general' });
      setIsAddAnnouncementOpen(false);
      // Reload announcements
      const data = await api.getAnnouncements();
      setAnnouncements(data || []);
    } catch (error) {
      console.error("Failed to create announcement:", error);
      alert("Failed to create announcement");
    }
  };

  if (loading) {
    return <div className="p-6">Loading announcements...</div>;
  }

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
        {announcements.length === 0 ? (
          <p className="text-gray-500">No announcements yet.</p>
        ) : (
          announcements.map((announcement) => {
            const announcementType = (announcement.type || 'general') as string;
            const announcementDate = announcement.created_at || announcement.date || new Date().toISOString();
            return (
              <div
                key={announcement.id}
                onClick={() => {
                  setSelectedAnnouncement(announcement);
                  setIsAnnouncementDetailOpen(true);
                }}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${getAnnouncementBgColor(
                    announcementType
                  )} text-white`}>
                    {getAnnouncementIcon(announcementType)}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900">{announcement.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {announcementType}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{announcement.message || announcement.content || ''}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(announcementDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Announcement Detail Dialog */}
      {selectedAnnouncement && (
        <Dialog open={isAnnouncementDetailOpen} onOpenChange={setIsAnnouncementDetailOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getAnnouncementIcon((selectedAnnouncement.type || 'general') as string)}
                {selectedAnnouncement.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-xs uppercase font-semibold text-gray-600">
                  Type
                </Label>
                <Badge className={getAnnouncementBgColor((selectedAnnouncement.type || 'general') as string)} text-white>
                  {selectedAnnouncement.type || 'general'}
                </Badge>
              </div>
              <div>
                <Label className="text-xs uppercase font-semibold text-gray-600">
                  Date
                </Label>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(selectedAnnouncement.created_at || new Date().toISOString()).toLocaleDateString('en-US', {
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
                <p className="text-sm text-gray-700">{selectedAnnouncement.message || selectedAnnouncement.content || ''}</p>
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
