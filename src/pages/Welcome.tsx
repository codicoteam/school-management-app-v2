import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Moon, Sun, Download, FileText, Video, BookOpen, ChevronRight, Users, ShieldCheck, GraduationCap, Calendar, MessageSquare, Award, Clock, Star, Globe, TrendingUp, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const Welcome = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!isDark);
  };

  const resources = [
    { title: "Student Handbook 2026", type: "PDF", size: "2.4 MB", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Parent Portal Guide", type: "Video", size: "15 mins", icon: Video, color: "text-rose-500", bg: "bg-rose-500/10" },
    { title: "Academic Calendar", type: "PDF", size: "1.1 MB", icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "E-Library Access Instructions", type: "Doc", size: "800 KB", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 md:px-12 bg-background border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            <span className="text-lg font-bold text-secondary-foreground">S</span>
          </div>
          <span className="font-heading text-xl font-bold text-foreground">
            School Management
          </span>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#home" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Home</a>
          <a href="#about" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">About us</a>
          <a href="#subjects" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Subjects</a>
          <a href="#contact" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">Contact</a>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-foreground/20 bg-transparent text-foreground hover:bg-foreground/10 hover:text-foreground hidden md:inline-flex"
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
        <div id="home" className="relative flex flex-1 items-center justify-center min-h-[80vh] scroll-mt-20">
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src={heroBg}
              alt="Students learning"
              className="h-full w-full object-cover"
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-8 px-6 py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="font-heading text-5xl font-bold tracking-tight text-white md:text-7xl">
                Welcome to
                <br />
                <span className="text-primary">School Management</span>
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-lg text-white/90">
                Learn from the best — anytime, anywhere. Access quality education at
                <br className="md:hidden"/>
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
                className="group h-14 gap-3 rounded-xl bg-secondary px-10 text-lg font-semibold text-secondary-foreground hover:bg-secondary/90 hover:text-primary transition-all"
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
              <div className="h-2.5 w-8 rounded-full bg-secondary/30" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/30" />
              <div className="h-2.5 w-2.5 rounded-full bg-white/30" />
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <section className="relative z-10 -mt-10 px-4 md:px-8 mx-auto w-full max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 bg-card/80 backdrop-blur-xl border border-border/50 rounded-3xl p-6 md:p-8 shadow-2xl">
            {[
              { label: "Active Students", value: "10K+", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
              { label: "Expert Teachers", value: "500+", icon: Award, color: "text-amber-500", bg: "bg-amber-500/10" },
              { label: "Global Programs", value: "50+", icon: Globe, color: "text-emerald-500", bg: "bg-emerald-500/10" },
              { label: "Parent Satisfaction", value: "98%", icon: TrendingUp, color: "text-rose-500", bg: "bg-rose-500/10" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center space-y-3">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} mb-2`}>
                  <stat.icon className="h-8 w-8" />
                </div>
                <h3 className="font-heading text-3xl md:text-4xl font-bold text-foreground">{stat.value}</h3>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About Mission Section */}
        <section id="about" className="relative z-10 py-20 md:py-28 bg-background overflow-hidden border-b border-border/30 scroll-mt-20">
          <div className="container px-4 md:px-8 mx-auto">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
                  <Star className="mr-2 h-4 w-4" /> Discover Our Vision
                </div>
                <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                  Empowering the <span className="text-primary">Next Generation</span> of Leaders
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We believe that education is the key to unlocking human potential. Our state-of-the-art portal bridges the gap between traditional learning and modern technology, creating a seamless ecosystem for students, parents, and educators.
                </p>
                
                <ul className="space-y-4">
                  {[
                    "Interactive digital classrooms that foster collaboration",
                    "Real-time progress tracking for unparalleled transparency",
                    "A secure, inclusive environment prioritizing student wellbeing"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="mt-1 flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                      <span className="text-foreground/90 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>

                <Button size="lg" className="h-12 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all w-full md:w-auto">
                  Learn More About Us
                </Button>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-2xl opacity-50"></div>
                <div className="relative grid grid-cols-2 gap-4">
                  <div className="space-y-4 pt-12">
                     <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=600&auto=format&fit=crop" alt="Students studying" className="rounded-2xl rounded-tr-[4rem] shadow-xl object-cover h-64 w-full" />
                     <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop" alt="Teacher interacting" className="rounded-2xl shadow-xl object-cover h-48 w-full" />
                  </div>
                  <div className="space-y-4">
                     <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop" alt="Campus" className="rounded-2xl shadow-xl object-cover h-48 w-full" />
                     <img src="https://images.unsplash.com/photo-1511629091441-ee46146481b6?q=80&w=600&auto=format&fit=crop" alt="Student success" className="rounded-2xl rounded-bl-[4rem] shadow-xl object-cover h-64 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Section Added Below */}
        <section className="relative z-10 py-16 bg-background">
          <div className="container px-4 md:px-8 mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
              <div className="max-w-2xl">
                <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-3 text-foreground">
                  Helpful Resources 
                </h2>
                <p className="text-lg text-muted-foreground">
                  Access guides, important files, and portal documentation without needing to log in. Prepared for students and parents.
                </p>
              </div>
              <Button variant="outline" className="shrink-0 gap-2 font-medium text-primary/hover:text-primary">
                View All Resources <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resources.map((resource, i) => (
                <div key={i} className="group relative bg-card hover:bg-muted/40 transition-colors border border-border rounded-xl p-6 overflow-hidden flex flex-col h-[200px]">
                  <div className={`p-3 w-12 h-12 rounded-lg mb-auto flex items-center justify-center ${resource.bg} ${resource.color}`}>
                    <resource.icon className="h-6 w-6" />
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold px-2 py-1 bg-muted rounded-md text-muted-foreground">{resource.type}</span>
                      <span className="text-xs text-muted-foreground">{resource.size}</span>
                    </div>
                    <h3 className="font-bold text-base text-foreground line-clamp-2 mt-1 group-hover:text-primary transition-colors">
                      {resource.title}
                    </h3>
                  </div>

                  <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0 text-primary">
                    <Download className="h-5 w-5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="subjects" className="relative z-10 py-20 bg-background overflow-hidden scroll-mt-20">
          <div className="container px-4 md:px-8 mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-3 text-foreground">
                Why Choose School Management Portal
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience the future of education management with our comprehensive portal designed for students, parents, and educators.
              </p>
            </div>
            
            {/* Decorative background shapes */}
            <div className="absolute inset-0 -z-10 pointer-events-none">
              <div className="absolute top-[-10%] left-[-10%] h-40 w-40 bg-blue-500/5 rounded-full blur-3xl animate-float-slow" />
              <div className="absolute bottom-[-10%] right-[-10%] h-36 w-36 bg-rose-500/5 rounded-full blur-3xl animate-float" />
              <div className="absolute top-[30%] left-[5%] h-20 w-20 bg-amber-500/5 rounded-full blur-xl animate-float-slow" />
            </div>
            
            {/* Primary Features - First Row */}
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* Feature 1 - Student Portal */}
              <div className="relative group">
                <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:bg-card/90 transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02] shadow-lg hover:shadow-xl">
                  {/* Unique background shape */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
                  
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl mb-6 bg-blue-500/10 group-hover:bg-blue-500/15 transition-all duration-500">
                    <Users className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-all duration-500" />
                  </div>
                  
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                    Student Portal
                  </h3>
                  
                  <p className="text-sm text-muted-foreground/80 max-w-md leading-relaxed">
                    Secure access to grades, assignments, schedules, and academic resources personalized for each student.
                  </p>
                  
                  {/* Animated underline on hover */}
                  <div className="relative mt-6 h-0.5 w-24 bg-blue-500 group-hover:w-full transition-all duration-500 origin-left" />
                </div>
              </div>
              
              {/* Feature 2 - Parent Engagement */}
              <div className="relative group">
                <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:bg-card/90 transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02] shadow-lg hover:shadow-xl">
                  {/* Unique background shape */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-rose-500/5 to-transparent pointer-events-none" />
                  
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl mb-6 bg-rose-500/10 group-hover:bg-rose-500/15 transition-all duration-500">
                    <ShieldCheck className="h-8 w-8 text-rose-600 group-hover:text-rose-700 transition-all duration-500" />
                  </div>
                  
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                    Parent Engagement
                  </h3>
                  
                  <p className="text-sm text-muted-foreground/80 max-w-md leading-relaxed">
                    Stay informed with real-time updates on attendance, performance, and school communications.
                  </p>
                  
                  {/* Animated underline on hover */}
                  <div className="relative mt-6 h-0.5 w-24 bg-rose-500 group-hover:w-full transition-all duration-500 origin-left" />
                </div>
              </div>
              
              {/* Feature 3 - Academic Excellence */}
              <div className="relative group">
                <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:bg-card/90 transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02] shadow-lg hover:shadow-xl">
                  {/* Unique background shape */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
                  
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl mb-6 bg-amber-500/10 group-hover:bg-amber-500/15 transition-all duration-500">
                    <GraduationCap className="h-8 w-8 text-amber-600 group-hover:text-amber-700 transition-all duration-500" />
                  </div>
                  
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                    Academic Excellence
                  </h3>
                  
                  <p className="text-sm text-muted-foreground/80 max-w-md leading-relaxed">
                    Tools for teachers to manage classes, track progress, and enhance learning outcomes.
                  </p>
                  
                  {/* Animated underline on hover */}
                  <div className="relative mt-6 h-0.5 w-24 bg-amber-500 group-hover:w-full transition-all duration-500 origin-left" />
                </div>
              </div>
            </div>
            
            {/* Secondary Features - Second Row */}
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Feature 4 - Schedule Management */}
              <div className="relative group">
                <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:bg-card/90 transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02] shadow-lg hover:shadow-xl">
                  {/* Unique background shape */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                  
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl mb-4 bg-emerald-500/10 group-hover:bg-emerald-500/15 transition-all duration-500">
                    <Calendar className="h-7 w-7 text-emerald-600 group-hover:text-emerald-700 transition-all duration-500" />
                  </div>
                  
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    Schedule Management
                  </h3>
                  
                  <p className="text-sm text-muted-foreground/80 max-w-md leading-relaxed">
                    Integrated calendar for classes, exams, events, and important deadlines.
                  </p>
                  
                  {/* Animated underline on hover */}
                  <div className="relative mt-5 h-0.5 w-20 bg-emerald-500 group-hover:w-full transition-all duration-500 origin-left" />
                </div>
              </div>
              
              {/* Feature 5 - Communication Hub */}
              <div className="relative group">
                <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:bg-card/90 transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02] shadow-lg hover:shadow-xl">
                  {/* Unique background shape */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
                  
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl mb-4 bg-purple-500/10 group-hover:bg-purple-500/15 transition-all duration-500">
                    <MessageSquare className="h-7 w-7 text-purple-600 group-hover:text-purple-700 transition-all duration-500" />
                  </div>
                  
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    Communication Hub
                  </h3>
                  
                  <p className="text-sm text-muted-foreground/80 max-w-md leading-relaxed">
                    Direct messaging between teachers, students, and parents for seamless collaboration.
                  </p>
                  
                  {/* Animated underline on hover */}
                  <div className="relative mt-5 h-0.5 w-20 bg-purple-500 group-hover:w-full transition-all duration-500 origin-left" />
                </div>
              </div>
              
              {/* Feature 6 - Resource Library */}
              <div className="relative group">
                <div className="relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-8 hover:bg-card/90 transition-all duration-500 transform hover:-translate-y-1 hover:scale-[1.02] shadow-lg hover:shadow-xl">
                  {/* Unique background shape */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-500/5 to-transparent pointer-events-none" />
                  
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl mb-4 bg-sky-500/10 group-hover:bg-sky-500/15 transition-all duration-500">
                    <BookOpen className="h-7 w-7 text-sky-600 group-hover:text-sky-700 transition-all duration-500" />
                  </div>
                  
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    Resource Library
                  </h3>
                  
                  <p className="text-sm text-muted-foreground/80 max-w-md leading-relaxed">
                    Access to educational materials, e-books, and learning resources anytime, anywhere.
                  </p>
                  
                  {/* Animated underline on hover */}
                  <div className="relative mt-5 h-0.5 w-20 bg-sky-500 group-hover:w-full transition-all duration-500 origin-left" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="relative z-10 py-20 bg-muted/30 border-t border-border/50 scroll-mt-20">
          <div className="container px-4 md:px-8 mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-foreground">Get In Touch</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Have questions or need assistance? Reach out to our dedicated support team to learn more about our portal.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <MessageSquare className="h-5 w-5" />
                Contact Support
              </Button>
              <Button size="lg" variant="outline" className="gap-2 border-primary/20 text-foreground hover:bg-primary/5">
                info@schoolmanagement.edu
              </Button>
            </div>
          </div>
        </section>

       {/* Footer */}
      <div className="relative z-10 bg-primary py-4 text-center">
        <p className="text-xs text-primary-foreground/40">
          © {new Date().getFullYear()} School Management. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
