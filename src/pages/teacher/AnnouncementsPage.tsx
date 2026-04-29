import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bell, Search, AlertCircle, Info, Megaphone, Calendar as CalendarIcon, Clock } from "lucide-react";
import { motion } from "framer-motion";

const mockAnnouncements = [
  {
    id: 1,
    title: "End of Term Examinations Schedule",
    message: "The final examination schedule has been published. All teachers are requested to review their invigilation duties by Friday.",
    date: "2024-05-10",
    time: "09:00 AM",
    type: "academic",
    priority: "high",
    author: "Principal's Office"
  },
  {
    id: 2,
    title: "Staff Development Workshop",
    message: "A mandatory workshop on modern teaching methodologies will take place next Wednesday in the main auditorium.",
    date: "2024-05-08",
    time: "02:00 PM",
    type: "administrative",
    priority: "medium",
    author: "HR Department"
  },
  {
    id: 3,
    title: "Update on Science Lab Equipment",
    message: "New microscopes and chemistry sets have arrived. Science teachers can coordinate with the lab tech to assign them.",
    date: "2024-05-05",
    time: "11:30 AM",
    type: "general",
    priority: "low",
    author: "Science Department Head"
  },
  {
    id: 4,
    title: "Parent-Teacher Meeting Preparation",
    message: "Please ensure all student progress reports are uploaded to the portal at least 48 hours before the PTM.",
    date: "2024-05-02",
    time: "08:15 AM",
    type: "academic",
    priority: "high",
    author: "Admin Coordinator"
  }
];

const priorityConfig: Record<string, { color: string, icon: React.ElementType }> = {
  high: { color: "text-red-500 bg-red-50 border-red-200", icon: AlertCircle },
  medium: { color: "text-yellow-600 bg-yellow-50 border-yellow-200", icon: Bell },
  low: { color: "text-blue-500 bg-blue-50 border-blue-200", icon: Info },
};

const AnnouncementsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredAnnouncements = mockAnnouncements.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || a.type === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-foreground flex items-center gap-2">
            <Megaphone className="h-8 w-8 text-primary" />
            School Announcements
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Stay updated with the latest news, schedules, and alerts.
          </p>
        </div>
        
        <div className="flex items-center w-full md:w-auto relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search announcements..." 
            className="pl-9 w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="administrative">Administrative</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="grid gap-4">
            {filteredAnnouncements.length > 0 ? (
              filteredAnnouncements.map((announcement, i) => {
                const PIcon = priorityConfig[announcement.priority].icon;
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    key={announcement.id}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={`font-semibold capitalize ${priorityConfig[announcement.priority].color}`}>
                              <PIcon className="w-3.5 h-3.5 mr-1" />
                              {announcement.priority} Priority
                            </Badge>
                            <Badge variant="secondary" className="capitalize">
                              {announcement.type}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl pt-1">
                            {announcement.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                          {announcement.message}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border/50">
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon className="w-4 h-4" />
                            {announcement.date}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {announcement.time}
                          </div>
                          <div className="flex items-center gap-1.5 ml-auto font-medium text-foreground">
                            Posted by: {announcement.author}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })
            ) : (
              <div className="py-12 text-center text-muted-foreground w-full bg-card rounded-lg border border-dashed border-border/60">
                <Bell className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p>No announcements found matching your criteria.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnnouncementsPage;