import { motion } from "framer-motion";
import { GraduationCap, ShieldCheck, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const roles = [
  {
    id: "student",
    label: "Student",
    description: "Access your lessons, assignments and track your progress",
    icon: GraduationCap,
    path: "/login?role=student",
  },
  {
    id: "parent",
    label: "Parent",
    description: "Monitor your child's learning journey and performance",
    icon: Users,
    path: "/login?role=parent",
  },
  {
    id: "admin",
    label: "Admin",
    description: "Manage courses, students and platform settings",
    icon: ShieldCheck,
    path: "/login?role=admin",
  },
];

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Students learning"
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-primary/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-10 px-6 py-16">
        {/* Logo / Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold tracking-tight text-primary-foreground md:text-6xl">
            Toto Academy
          </h1>
          <p className="mt-3 text-lg text-primary-foreground/70">
            Learn from the best — anytime, anywhere.
          </p>
        </motion.div>

        {/* Role Selection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="w-full"
        >
          <p className="mb-6 text-center font-heading text-sm font-medium uppercase tracking-widest text-secondary">
            Select your role to continue
          </p>

          <div className="grid gap-5 sm:grid-cols-3">
            {roles.map((role, i) => (
              <motion.button
                key={role.id}
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.12 }}
                onClick={() => navigate(role.path)}
                className="group flex flex-col items-center gap-4 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/10 px-6 py-8 backdrop-blur-md transition-colors hover:bg-secondary hover:border-secondary"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary-foreground/15 transition-colors group-hover:bg-primary/90">
                  <role.icon className="h-8 w-8 text-primary-foreground transition-colors group-hover:text-secondary" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-primary-foreground transition-colors group-hover:text-primary">
                    {role.label}
                  </h3>
                  <p className="mt-1 text-sm text-primary-foreground/60 transition-colors group-hover:text-primary/70">
                    {role.description}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-primary-foreground/40"
        >
          © {new Date().getFullYear()} Toto Academy. All rights reserved.
        </motion.p>
      </div>
    </div>
  );
};

export default Welcome;
