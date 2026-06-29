/**
 * Utility to identify whether the current visitor is on the dedicated admin portal URL.
 * In production: e.g. admin.yourdomain.com
 * In development: e.g. admin.localhost:8080 or when ?adminMode=true is appended
 */
export const isAdminDomain = (): boolean => {
  const hostname = window.location.hostname.toLowerCase();
  
  // 1. Check query parameter (ideal for simple local testing without subdomain setup)
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.get("adminMode") === "true") {
    return true;
  }

  // 2. Check stored admin flag (to persist admin mode if set via query param)
  if (searchParams.get("adminMode") === "false") {
    localStorage.removeItem("admin_portal_mode");
  } else if (searchParams.get("adminMode") === "true") {
    localStorage.setItem("admin_portal_mode", "true");
  }
  
  if (localStorage.getItem("admin_portal_mode") === "true") {
    return true;
  }

  // 3. Subdomain checking
  return hostname.startsWith("admin.") || hostname === "admin";
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
