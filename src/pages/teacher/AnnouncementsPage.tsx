import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AnnouncementsPage = () => (
  <div className="space-y-6">
    <h1 className="font-heading text-2xl font-bold text-foreground">Announcements</h1>
    <Card>
      <CardHeader>
        <CardTitle>School Announcements</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Announcements functionality coming soon...</p>
      </CardContent>
    </Card>
  </div>
);

export default AnnouncementsPage;