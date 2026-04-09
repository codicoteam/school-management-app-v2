import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, GraduationCap, ShieldCheck, Users } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import heroBg from "@/assets/hero-bg.jpg";

const roleConfig: Record<string, { label: string; icon: typeof GraduationCap }> = {
  student: { label: "Student", icon: GraduationCap },
  parent: { label: "Parent", icon: Users },
  admin: { label: "Admin", icon: ShieldCheck },
};

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "student";
  const config = roleConfig[role] || roleConfig.student;
  const RoleIcon = config.icon;

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to role-specific dashboard
    const dashboardMap: Record<string, string> = {
      admin: "/admin",
      student: "/student",
      parent: "/parent",
    };
    navigate(dashboardMap[role] || "/student");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/85" />
      </div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => navigate("/select-role")}
        className="absolute left-6 top-6 z-20 flex items-center gap-2 text-sm font-medium text-primary-foreground/70 hover:text-primary-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </motion.button>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-6"
      >
        <div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/10 p-8 backdrop-blur-lg">
          {/* Role badge */}
          <div className="mb-6 flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
              <RoleIcon className="h-7 w-7 text-secondary-foreground" />
            </div>
            <div className="text-center">
              <h1 className="font-heading text-2xl font-bold text-primary-foreground">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="mt-1 text-sm text-primary-foreground/60">
                {isSignUp ? `Sign up as a ${config.label}` : `Login as ${config.label}`}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-primary-foreground/80">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  className="border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-secondary"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary-foreground/80">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-secondary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-primary-foreground/80">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="border-primary-foreground/20 bg-primary-foreground/5 pr-10 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-secondary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/50 hover:text-primary-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-primary-foreground/80">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="border-primary-foreground/20 bg-primary-foreground/5 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-secondary"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 h-11 text-base font-semibold"
            >
              {isSignUp ? "Sign Up" : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-primary-foreground/60">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="font-semibold text-secondary hover:text-secondary/80 transition-colors"
              >
                {isSignUp ? "Login" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
