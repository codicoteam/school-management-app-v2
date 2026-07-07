import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  BookOpen,
  Trophy,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Event {
  id: string;
  title: string;
  event_date: string;
  event_time?: string;
  event_type?: 'exam' | 'meeting' | 'activity' | 'workshop' | 'holiday';
  class?: string;
  location?: string;
  description?: string;
  created_at?: string;
}

export default function CalendarPage() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date(2024, 3, 1)); // April 2024
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventDetailOpen, setIsEventDetailOpen] = useState(false);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<{
    title: string;
    event_date: string;
    event_time: string;
    event_type: 'exam' | 'meeting' | 'activity' | 'workshop' | 'holiday';
    class: string;
    location: string;
    description: string;
  }>({
    title: '',
    event_date: '',
    event_time: '',
    event_type: 'exam',
    class: '',
    location: '',
    description: '',
  });

  // Load events on component mount
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const data = await api.getCalendarEvents();
        setEvents(data || []);
      } catch (error) {
        console.error("Failed to load calendar events:", error);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const getEventsForDate = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString()
      .split('T')[0];
    return events.filter((event) => event.event_date === dateStr);
  };

  const getEventIcon = (type?: string) => {
    switch (type) {
      case 'exam':
        return <BookOpen className="h-4 w-4" />;
      case 'meeting':
        return <Users className="h-4 w-4" />;
      case 'activity':
        return <Trophy className="h-4 w-4" />;
      case 'workshop':
        return <BookOpen className="h-4 w-4" />;
      case 'holiday':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <CalendarDays className="h-4 w-4" />;
    }
  };

  const getEventColor = (type?: string) => {
    switch (type) {
      case 'exam':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'meeting':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'activity':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'workshop':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'holiday':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.event_date || !newEvent.location) {
      alert("Please fill in required fields");
      return;
    }

    try {
      await api.createCalendarEvent({
        title: newEvent.title,
        description: newEvent.description || null,
        event_date: newEvent.event_date,
        event_time: newEvent.event_time || null,
        event_type: newEvent.event_type,
        class: newEvent.class || null,
        location: newEvent.location,
      });
      alert("Event created successfully");
      setNewEvent({
        title: '',
        event_date: '',
        event_time: '',
        event_type: 'exam',
        class: '',
        location: '',
        description: '',
      });
      setIsAddEventOpen(false);
      // Reload events
      const data = await api.getCalendarEvents();
      setEvents(data || []);
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event");
    }
  };

  const upcomingEvents = events
    .filter((event) => new Date(event.event_date) >= new Date())
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
    .slice(0, 5);

  if (loading) {
    return <div className="p-6">Loading calendar...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Academic Calendar</h1>
          <p className="text-sm text-gray-600">
            View exams, events, and important dates
          </p>
        </div>
        <Button
          size="sm"
          className="gap-2"
          onClick={() => setIsAddEventOpen(true)}
        >
          <CalendarDays className="h-4 w-4" />
          Add Event
        </Button>
      </div>

      {/* Calendar and Events Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={previousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-lg">{monthName}</CardTitle>
                <Button variant="ghost" size="sm" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Weekdays Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-xs font-semibold text-gray-600 py-2"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="aspect-square p-1"
                    />
                  ))}
                  {days.map((day) => {
                    const dayEvents = getEventsForDate(day);
                    return (
                      <div
                        key={day}
                        className="aspect-square p-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <div className="text-xs font-semibold text-gray-900 mb-1">
                          {day}
                        </div>
                        <div className="space-y-0.5">
                          {dayEvents.slice(0, 2).map((event) => (
                            <button
                              key={event.id}
                              onClick={() => {
                                setSelectedEvent(event);
                                setIsEventDetailOpen(true);
                              }}
                              className={`w-full text-xs px-1 py-0.5 rounded truncate ${getEventColor(
                                event.event_type
                              )} border cursor-pointer hover:shadow-md transition-shadow`}
                            >
                               {event.title}
                             </button>
                           ))}
                           {dayEvents.length > 2 && (
                            <p className="text-xs text-gray-600 px-1">
                              +{dayEvents.length - 2} more
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-gray-500">No upcoming events.</p>
              ) : (
                upcomingEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => {
                      setSelectedEvent(event);
                      setIsEventDetailOpen(true);
                    }}
                    className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-blue-600 flex-shrink-0 mt-1">
                        {getEventIcon(event.event_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {event.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(event.event_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{event.event_type || 'event'}</Badge>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Detail Dialog */}
      {selectedEvent && (
        <Dialog open={isEventDetailOpen} onOpenChange={setIsEventDetailOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getEventIcon(selectedEvent.event_type)}
                {selectedEvent.title}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-xs uppercase font-semibold text-gray-600">
                  Date
                </Label>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(selectedEvent.event_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {selectedEvent.event_time && (
                <div>
                  <Label className="text-xs uppercase font-semibold text-gray-600 flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    Time
                  </Label>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedEvent.event_time}
                  </p>
                </div>
              )}
              {selectedEvent.location && (
                <div>
                  <Label className="text-xs uppercase font-semibold text-gray-600 flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    Location
                  </Label>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedEvent.location}
                  </p>
                </div>
              )}
              {selectedEvent.class && (
                <div>
                  <Label className="text-xs uppercase font-semibold text-gray-600 flex items-center gap-2">
                    <Users className="h-3 w-3" />
                    Class
                  </Label>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedEvent.class}
                  </p>
                </div>
              )}
              {selectedEvent.description && (
                <div>
                  <Label className="text-xs uppercase font-semibold text-gray-600">
                    Description
                  </Label>
                  <p className="text-sm text-gray-700">
                    {selectedEvent.description}
                  </p>
                </div>
              )}
              {selectedEvent.event_type && (
                <Badge className={getEventColor(selectedEvent.event_type)}>
                  {selectedEvent.event_type}
                </Badge>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setIsEventDetailOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Event Dialog */}
      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="eventTitle">Event Title *</Label>
              <Input
                id="eventTitle"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                placeholder="Enter event title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventDate">Date *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={newEvent.event_date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, event_date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="eventTime">Time</Label>
                <Input
                  id="eventTime"
                  value={newEvent.event_time}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, event_time: e.target.value })
                  }
                  placeholder="HH:MM - HH:MM"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="eventType">Type</Label>
              <Select
                value={newEvent.event_type}
                onValueChange={(value) =>
                  setNewEvent({ ...newEvent, event_type: value as 'exam' | 'meeting' | 'activity' | 'workshop' | 'holiday' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exam">Exam</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="eventClass">Class</Label>
              <Input
                id="eventClass"
                value={newEvent.class}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, class: e.target.value })
                }
                placeholder="e.g., Class 10A"
              />
            </div>
            <div>
              <Label htmlFor="eventLocation">Location *</Label>
              <Input
                id="eventLocation"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
                placeholder="Enter location"
              />
            </div>
            <div>
              <Label htmlFor="eventDescription">Description</Label>
              <Textarea
                id="eventDescription"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                placeholder="Add event description"
                className="h-20"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddEventOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddEvent}>Add Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
