import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, GraduationCap, ShieldCheck, Users, UserCog, Loader2, MailCheck } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import heroBg from "@/assets/hero-bg.jpg";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { UserRole } from "@/contexts/AuthContext";

const roleConfig: Record<string, { label: string; icon: typeof GraduationCap }> = {
  student: { label: "Student", icon: GraduationCap },
  parent: { label: "Parent", icon: Users },
  teacher: { label: "Teacher", icon: UserCog },
  admin: { label: "Admin", icon: ShieldCheck },
};

const dashboardMap: Record<string, string> = {
  admin: "/admin",
  student: "/student",
  parent: "/parent",
  teacher: "/teacher",
};

const Login = () => {
  const navigate = useNavigate();
const [searchParams] = useSearchParams();
const rawRole = searchParams.get("role") || "student";

// Allow role from query params, fallback to student if invalid
const allowedRoles = ['student', 'parent', 'teacher', 'admin'];
const role = allowedRoles.includes(rawRole) ? rawRole : 'student';
  const config = roleConfig[role] || roleConfig.student;
  const RoleIcon = config.icon;

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
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
      if (isSignUp) {
        // ── Sign Up ──
        if (!formData.name.trim()) {
          toast.error("Please enter your full name.");
          setIsLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          toast.error("Password must be at least 6 characters.");
          setIsLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match.");
          setIsLoading(false);
          return;
        }


        // Prevent use of disposable/fake email addresses
        const emailDomain = formData.email.split('@')[1]?.toLowerCase();
        const fakeDomains = [
          'tempmail.com', '10minutemail.com', 'mailinator.com', 'yopmail.com', 
          'guerrillamail.com', 'temp-mail.org', 'fakeinbox.com', 'trashmail.com',
          'disposablemail.com', 'sharklasers.com', 'nada.ltd', 'getnada.com',
          'maildrop.cc', 'gmx.com'
        ];
        
        if (emailDomain && fakeDomains.includes(emailDomain)) {
          toast.error("Disposable or fake email addresses are not allowed.");
          setIsLoading(false);
          return;
        }

        // Create Firebase Auth user
        const credential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        // Send email verification
        await sendEmailVerification(credential.user);

        // Save user profile to Firestore
        await setDoc(doc(db, "users", credential.user.uid), {
          uid: credential.user.uid,
          name: formData.name.trim(),
          email: formData.email,
          role: role as UserRole,
          createdAt: serverTimestamp(),
        });

        toast.success("Account created successfully! Please check your email to verify your account.");

        // Sign out to prevent unverified app usage
        await signOut(auth);
        
        // Show verification success screen
        setVerificationSent(true);
        // Clear password fields
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      } else {
        // ── Login ──
        const credential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        if (!credential.user.emailVerified) {
          try {
            // Automatically resend a fresh verification email in case they missed the first one
            await sendEmailVerification(credential.user);
            toast.success("A new verification email has been sent! Please check your Spam/Junk folder.");
          } catch (e) {
            toast.error("Please verify your email address. It may be in your Spam or Junk folder.");
          }
          await signOut(auth);
          setIsLoading(false);
          return;
        }

        // Read the user's role from Firestore
        const userDoc = await getDoc(doc(db, "users", credential.user.uid));

        if (!userDoc.exists()) {
          toast.error("Account profile not found. Please contact an administrator.");
          setIsLoading(false);
          return;
        }

        const userData = userDoc.data();
        const userRole = userData.role as string;

        // Validate that the user has a valid role
        if (!userRole || !roleConfig[userRole]) {
          toast.error("Account has invalid role configuration. Please contact an administrator.");
          // Sign out the user since we authenticated but role is invalid
          await signOut(auth);
          // Redirect to role selection page
          navigate("/select-role", { replace: true });
          setIsLoading(false);
          return;
        }

        // Validate that the user's role matches the expected role from URL
        // This prevents users from logging in with credentials meant for a different role
        if (userRole !== role) {
          toast.error(`Invalid login. This account is registered as a ${roleConfig[userRole]?.label}. Please use the ${roleConfig[userRole]?.label} login page.`);
          // Sign out the user since we authenticated but role doesn't match
          await signOut(auth);
          // Redirect to the correct login page for their role
          navigate(`/login?role=${userRole}`, { replace: true });
          setIsLoading(false);
          return;
        }

        toast.success("Logged in securely!");

        // Redirect based on Firestore role (not query param)
        navigate(dashboardMap[userRole] || "/student", { replace: true });
      }
    } catch (error: any) {
      // Map Firebase error codes to friendly messages
      const errorMap: Record<string, string> = {
        "auth/email-already-in-use": "This email is already registered. Try logging in.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/operation-not-allowed": "Email/Password sign-in is not enabled.",
        "auth/weak-password": "Password is too weak. Use at least 6 characters.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/invalid-credential": "Invalid email or password. Please try again.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
      };
      const message = errorMap[error?.code] || error?.message || "Authentication failed. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-primary/60 backdrop-blur-[2px]" />
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
          {verificationSent ? (
            <div className="flex flex-col items-center justify-center text-center py-6">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20">
                <MailCheck className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
              <p className="text-white/70 mb-8 max-w-sm">
                We've sent a verification link to <strong>{formData.email}</strong>. 
                Please verify your email address to continue.
              </p>
              <Button 
                onClick={() => {
                  setVerificationSent(false);
                  setIsSignUp(false);
                }}
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 h-11 text-base font-semibold"
              >
                Back to Login
              </Button>
            </div>
          ) : (
            <>
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
                      required
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
                    required
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
                      required
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
                      required
                      className="border-white/20 bg-white/5 text-white placeholder:text-white/40 focus-visible:ring-secondary"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 h-11 text-base font-semibold"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Please wait...
                    </span>
                  ) : (
                    isSignUp ? "Sign Up" : "Login"
                  )}
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
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
