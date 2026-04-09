import { Card, CardContent } from "@/components/ui/card";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

const PlaceholderPage = ({ title, description, icon: Icon }: PlaceholderPageProps) => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Icon className="h-12 w-12 text-muted-foreground/30" />
        <p className="mt-4 text-sm text-muted-foreground">This module is coming soon</p>
      </CardContent>
    </Card>
  </div>
);

export default PlaceholderPage;
