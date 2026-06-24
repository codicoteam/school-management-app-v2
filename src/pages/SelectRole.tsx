import { motion } from "framer-motion";
import { GraduationCap, Users, UserCog, ArrowLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const roles = [
  {
    id: "student",
    label: "Student",
    description: "Access your lessons, assignments and track your progress",
    icon: GraduationCap,
  },
  {
    id: "parent",
    label: "Parent",
    description: "Monitor your child's learning journey and performance",
    icon: Users,
  },
  {
    id: "teacher",
    label: "Teacher",
    description: "Manage classes, assignments and student performance",
    icon: UserCog,
  },
  {
    id: "admin",
    label: "Admin",
    description: "Manage school operations, users, and settings",
    icon: ShieldCheck,
  },
];

const SelectRole = () => {
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
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => navigate("/")}
        className="absolute left-6 top-6 z-20 flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </motion.button>

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-10 px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h1 className="font-heading text-4xl font-bold tracking-tight text-white md:text-5xl">
            Who are you?
          </h1>
          <p className="mt-3 text-lg text-white/80">
            Select your role to continue
          </p>
        </motion.div>

        <div className="grid w-full gap-5 sm:grid-cols-3">
          {roles.map((role, i) => (
            <motion.button
              key={role.id}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
              onClick={() => navigate(`/login?role=${role.id}`)}
              className="group flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/10 px-6 py-8 backdrop-blur-md transition-colors hover:bg-secondary hover:border-secondary"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/15 transition-colors group-hover:bg-primary/90">
                <role.icon className="h-8 w-8 text-white transition-colors group-hover:text-secondary" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-primary">
                  {role.label}
                </h3>
                <p className="mt-1 text-sm text-white/60 transition-colors group-hover:text-primary/70">
                  {role.description}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
