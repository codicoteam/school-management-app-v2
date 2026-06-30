import { motion } from "framer-motion";
import { ShieldAlert, ArrowRight, Copy, Check, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getAdminPortalUrl } from "@/utils/adminDomain";
import heroBg from "@/assets/hero-bg.jpg";
import { toast } from "sonner";

const AdminDomainRedirect = () => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const adminUrl = getAdminPortalUrl();

  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      // Auto-toggle admin mode for local dev to prevent subdomain configuration headaches
      localStorage.setItem("admin_portal_mode", "true");
      window.location.href = "/admin";
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(adminUrl);
      setCopied(true);
      toast.success("Admin URL copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy URL");
    }
  };

  const handleRedirect = () => {
    navigate("/admin");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background text-foreground">
      {/* Background with blur and dark overlay */}
      <div className="absolute inset-0 z-0">
        <img src={heroBg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-md" />
      </div>

      <div className="relative z-10 w-full max-w-lg px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-xl text-center"
        >
          {/* Top glowing ambient gradient */}
          <div className="absolute -top-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-blue-500/20 blur-2xl" />

          {/* Secure/Shield Icon Container */}
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 shadow-inner"
          >
            <ShieldAlert className="h-10 w-10 text-blue-400" />
          </motion.div>

          <h2 className="font-heading text-3xl font-bold tracking-tight text-white mb-3">
            Admin Portal Isolated
          </h2>
          
          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto">
            For security and operational isolation, the <span className="font-semibold text-blue-400 text-white">Administrator Portal</span> has been separated from the public portal and requires a dedicated access URL.
          </p>

          {/* URL Box */}
          <div className="mb-8 rounded-xl border border-white/15 bg-black/40 p-4 transition-all duration-300 hover:border-blue-500/30">
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 text-left">
              Dedicated Admin URL
            </span>
            <div className="flex items-center justify-between gap-3">
              <code className="text-left font-mono text-sm text-blue-300 overflow-x-auto whitespace-nowrap pr-2 block scrollbar-thin select-all">
                {adminUrl}
              </code>
              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCopy}
                  className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
                  title="Copy Link"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => window.open(adminUrl, "_blank")}
                  className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
                  title="Open in New Tab"
                >
                  <Globe className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleRedirect}
              className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-base shadow-lg shadow-blue-500/20 group transition-all"
            >
              Go to Admin Portal
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                // Clear any stored mode if user wants back to main website
                localStorage.removeItem("admin_portal_mode");
                window.location.href = window.location.origin;
              }}
              className="w-full h-12 border-white/10 bg-transparent text-slate-400 hover:text-white hover:bg-white/5 rounded-xl text-base"
            >
              Return to School Website
            </Button>
          </div>

          <div className="mt-8 text-center border-t border-white/5 pt-4">
            <span className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold block">
              Security Notice
            </span>
            <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto">
              Access is monitored. Authorized administrators only. Disposable or unauthorized logins will be system-logged.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDomainRedirect;
