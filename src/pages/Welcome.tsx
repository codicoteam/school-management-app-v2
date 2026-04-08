import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <span className="text-lg font-bold text-secondary-foreground">T</span>
          </div>
          <span className="font-heading text-xl font-bold text-primary-foreground">
            Toto Academy
          </span>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#" className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">Home</a>
          <a href="#" className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">About us</a>
          <a href="#" className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">Subjects</a>
          <a href="#" className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            onClick={() => navigate("/select-role")}
          >
            Sign Up
          </Button>
          <Button
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            onClick={() => navigate("/select-role")}
          >
            Login
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative flex flex-1 items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Students learning"
            className="h-full w-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-primary/75" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center gap-8 px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="font-heading text-5xl font-bold tracking-tight text-primary-foreground md:text-7xl">
              Welcome to
              <br />
              <span className="text-secondary">Burney Place</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-lg text-primary-foreground/70">
              Learn from the best — anytime, anywhere. Access quality education at
              your fingertips.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              size="lg"
              className="group h-14 gap-3 rounded-xl bg-secondary px-10 text-lg font-semibold text-secondary-foreground shadow-lg hover:bg-secondary/90 hover:shadow-xl transition-all"
              onClick={() => navigate("/select-role")}
            >
              Get Started
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>

          {/* Carousel dots decoration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-2"
          >
            <div className="h-2.5 w-8 rounded-full bg-secondary" />
            <div className="h-2.5 w-2.5 rounded-full bg-primary-foreground/30" />
            <div className="h-2.5 w-2.5 rounded-full bg-primary-foreground/30" />
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 bg-primary py-4 text-center">
        <p className="text-xs text-primary-foreground/40">
          © {new Date().getFullYear()} Burney Place. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
