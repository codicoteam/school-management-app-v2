import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, GraduationCap, ShieldCheck, Users, UserCog } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import heroBg from "@/assets/hero-bg.jpg";

const roleConfig: Record<string, { label: string; icon: typeof GraduationCap }> = {
  student: { label: "Student", icon: GraduationCap },
  parent: { label: "Parent", icon: Users },
  teacher: { label: "Teacher", icon: UserCog },
  admin: { label: "Admin", icon: ShieldCheck },
};

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register } = useAuth();
  const role = searchParams.get("role") || "student";
  const config = roleConfig[role] || roleConfig.student;
  const RoleIcon = config.icon;

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // MOCK LOGIN FOR TESTING - Bypassing real logic and checks
      const mockUser = {
        id: `mock-${role}-1`,
        email: formData.email || `test@${role}.com`,
        name: formData.name || `Test ${config.label}`,
        role: role
      };
      
      // Manually set the local storage auth data to bypass the context fetch
      localStorage.setItem('token', 'mock-test-token-12345');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Navigate to role-specific dashboard
      const dashboardMap: Record<string, string> = {
        admin: "/admin",
        student: "/student",
        parent: "/parent",
        teacher: "/teacher",
      };
      
      toast.success(isSignUp ? "Account created successfully (Testing Mode)!" : `Logged in securely (Testing Mode)!`);
      
      // Use window.location to force full context reload to ensure AuthContext picks up localStorage
      window.location.href = dashboardMap[role] || "/student";
      
    } catch (error) {
      toast.error("Testing login bypass failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => navigate("/select-role")}
        className="absolute left-6 top-6 z-20 flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
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
        <div className="rounded-2xl border border-white/10 bg-white/10 p-8 backdrop-blur-lg">
          {/* Role badge */}
          <div className="mb-6 flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
              <RoleIcon className="h-7 w-7 text-secondary-foreground" />
            </div>
            <div className="text-center">
              <h1 className="font-heading text-2xl font-bold text-white">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="mt-1 text-sm text-white/60">
                {isSignUp ? `Sign up as a ${config.label}` : `Login as ${config.label}`}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white/80">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-secondary"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/80">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-secondary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/80">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="border-white/20 bg-white/5 pr-10 text-white placeholder:text-white/40 focus-visible:ring-secondary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white/80">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-secondary"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 h-11 text-base font-semibold"
            >
              {isLoading ? "Please wait..." : (isSignUp ? "Sign Up" : "Login")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/60">
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
