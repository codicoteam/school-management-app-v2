import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

const PlaceholderPage = ({ title, description, icon: Icon }: PlaceholderPageProps) => (
  <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="font-heading text-2xl font-bold text-foreground">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </motion.div>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
      <Card className="border-none shadow-md">
        <CardContent className="flex flex-col items-center justify-center py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent/70 shadow-sm">
            <Icon className="h-8 w-8 text-white" />
          </div>
          <p className="mt-4 text-sm font-medium text-muted-foreground">This module is coming soon</p>
          <p className="mt-1 text-xs text-muted-foreground/60">We're working hard to bring this feature to you</p>
        </CardContent>
      </Card>
    </motion.div>
  </div>
);

export default PlaceholderPage;
