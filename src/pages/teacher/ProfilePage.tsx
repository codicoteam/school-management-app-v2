import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Calendar, BookOpen, Edit2, Save } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const TeacherProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "Mr. John Omondi",
    email: "john.omondi@school.edu",
    phone: "+254 712 345 678",
    department: "Science",
    joinDate: "January 15, 2020",
    bio: "Passionate educator with 12+ years of experience in teaching Mathematics and Physics.",
    subjects: ["Mathematics", "Physics", "Advanced Physics"],
    qualifications: ["Bachelor of Science in Physics", "Master of Education", "PGDE"],
    assignedClasses: ["Form 3A", "Form 4A", "Form 4B"],
  });

  const [formData, setFormData] = useState(profile);
  const [isEditing, setIsEditing] = useState(false); // Added missing state

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-heading text-2xl font-bold text-foreground">My Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your personal and professional information</p>
      </motion.div>

      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <Card className="border-none shadow-md overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary to-primary/80" />
          <CardContent className="relative -mt-16 pb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <Avatar className="h-32 w-32 border-4 border-card shadow-lg">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=john" alt={profile.name} />
                  <AvatarFallback>JO</AvatarFallback>
                </Avatar>
                <div className="pb-2">
                  <h2 className="font-heading text-2xl font-bold text-foreground">{profile.name}</h2>
                  <p className="text-muted-foreground">{profile.department} Department</p>
                </div>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "default" : "outline"}
                className="gap-2"
              >
                {isEditing ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                {isEditing ? "Save" : "Edit Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@school.edu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+254 712 345 678"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium text-foreground">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium text-foreground">{profile.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Joined</p>
                      <p className="text-sm font-medium text-foreground">{profile.joinDate}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Professional Information */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Professional Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Subjects Taught</p>
                <div className="flex flex-wrap gap-2">
                  {profile.subjects.map((subject) => (
                    <Badge key={subject} variant="secondary">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Assigned Classes</p>
                <div className="flex flex-wrap gap-2">
                  {profile.assignedClasses.map((cls) => (
                    <Badge key={cls} variant="outline">
                      {cls}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Qualifications */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Qualifications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {profile.qualifications.map((qual, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <BookOpen className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground">{qual}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bio Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Professional Biography</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Write a brief professional biography..."
                className="min-h-24"
              />
            ) : (
              <p className="text-sm text-foreground leading-relaxed">{profile.bio}</p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Fixed: Moved the edit buttons inside the same div structure */}
      {isEditing && (
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      )}
    </div> // This closes the main div that started on line 57
  );
};

export default TeacherProfilePage;