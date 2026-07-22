import { useState, useEffect, useCallback, useRef } from "react";
import { getDashboardStats, getDashboardEnrollment, getDashboardFees } from "@/lib/adminApi";
import { toast } from "sonner";

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalRevenue: number;
  enrollmentTrend: any[];
  feeCollectionTrend: any[];
  recentActivity: any[];
}

const REFRESH_INTERVAL_MS = 30000;

export const useAdminDashboardData = () => {
  const [data, setData] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalRevenue: 0,
    enrollmentTrend: [],
    feeCollectionTrend: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  // Only warn once per broken endpoint per session, not on every 30s poll.
  const warnedRef = useRef<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    const [statsResult, enrollmentResult, feesResult] = await Promise.allSettled([
      getDashboardStats(),
      getDashboardEnrollment(),
      getDashboardFees(),
    ]);

    setData(prev => ({
      ...prev,
      ...(statsResult.status === "fulfilled" ? statsResult.value : {}),
      enrollmentTrend: enrollmentResult.status === "fulfilled" ? enrollmentResult.value ?? [] : prev.enrollmentTrend,
      feeCollectionTrend: feesResult.status === "fulfilled" ? feesResult.value ?? [] : prev.feeCollectionTrend,
    }));

    const failures: [string, PromiseSettledResult<unknown>][] = [
      ["stats", statsResult],
      ["enrollment", enrollmentResult],
      ["fees", feesResult],
    ].filter(([, r]) => r.status === "rejected") as any;

    failures.forEach(([label, result]) => {
      console.error(`Error fetching admin dashboard ${label}:`, (result as PromiseRejectedResult).reason);
      if (!warnedRef.current.has(label)) {
        warnedRef.current.add(label);
        toast.error(`Couldn't load dashboard ${label} data`);
      }
    });

    // Only surface a hard error if literally nothing loaded.
    setError(failures.length === 3 ? new Error("Failed to load dashboard data") : null);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
