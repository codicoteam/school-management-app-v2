/**
 * Utility to identify whether the current visitor is on the dedicated admin portal URL.
 * In production: e.g. admin.yourdomain.com
 * In development: e.g. admin.localhost:8080 or when ?adminMode=true is appended
 */
export const isAdminDomain = (): boolean => {
  const hostname = window.location.hostname.toLowerCase();
  const pathname = window.location.pathname.toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);

  // 1. Check query parameter (takes absolute precedence)
  if (searchParams.get("adminMode") === "true") {
    localStorage.setItem("admin_portal_mode", "true");
    return true;
  }
  
  if (searchParams.get("adminMode") === "false") {
    localStorage.removeItem("admin_portal_mode");
    return false;
  }

  // 2. If a specific non-admin role is requested in query params, disable admin mode
  const roleParam = searchParams.get("role");
  if (roleParam && roleParam !== "admin") {
    localStorage.removeItem("admin_portal_mode");
    return false;
  }

  const isActualAdminSubdomain = hostname.startsWith("admin.") || hostname === "admin";

  // 3. Clear admin mode if on main portal routes (student, parent, teacher, or root/welcome page)
  // and we are NOT on the actual admin subdomain.
  if (
    !isActualAdminSubdomain &&
    (pathname === "/" ||
     pathname === "/index.html" ||
     pathname.startsWith("/student") || 
     pathname.startsWith("/parent") || 
     pathname.startsWith("/teacher"))
  ) {
    localStorage.removeItem("admin_portal_mode");
    return false;
  }
  
  // 4. Check stored admin flag
  if (localStorage.getItem("admin_portal_mode") === "true") {
    return true;
  }

  // 5. Subdomain checking
  return isActualAdminSubdomain;
};

/**
 * Returns the configured Admin Portal URL.
 * Automatically resolves localhost with admin subdomain or matching ports.
 */
export const getAdminPortalUrl = (): string => {
  const port = window.location.port;
  const protocol = window.location.protocol;
  
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    // For local dev, return URL with admin subdomain or query parameter fallback
    return `${protocol}//admin.localhost${port ? `:${port}` : ""}`;
  }
  
  // For production, prepend admin subdomain, ensuring we don't double prepend
  const hostname = window.location.hostname;
  if (hostname.startsWith("admin.")) {
    return window.location.href;
  }
  
  return `${protocol}//admin.${hostname}${port ? `:${port}` : ""}`;
};
