import { useState, useEffect } from "react";
import { 
  collection, 
  onSnapshot, 
  query, 
  limit, 
  orderBy 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalRevenue: number;
  enrollmentTrend: any[];
  feeCollectionTrend: any[];
  recentActivity: any[];
}

export const useAdminDashboardData = () => {
  const [data, setData] = useState<DashboardStats>({
    totalStudents: 1250,
    totalTeachers: 45,
    totalClasses: 30,
    totalRevenue: 32500,
    enrollmentTrend: [
      { month: "Jan", students: 980 },
      { month: "Feb", students: 1020 },
      { month: "Mar", students: 1080 },
      { month: "Apr", students: 1130 },
      { month: "May", students: 1180 },
      { month: "Jun", students: 1210 },
      { month: "Jul", students: 1250 },
    ],
    feeCollectionTrend: [
      { month: "Jan", collected: 22000, expected: 30000 },
      { month: "Feb", collected: 25500, expected: 30000 },
      { month: "Mar", collected: 28000, expected: 31000 },
      { month: "Apr", collected: 26500, expected: 31000 },
      { month: "May", collected: 30200, expected: 32000 },
      { month: "Jun", collected: 31800, expected: 32000 },
      { month: "Jul", collected: 32500, expected: 33000 },
    ],
    recentActivity: [
      { text: "System monitoring active", time: "Just now", dot: "bg-emerald-500" },
    ],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch from multiple collections
    // Here we'll listen to a "dashboard_stats" doc or individual collections
    
    const unsubscribeStudents = onSnapshot(collection(db, "students"), (snapshot) => {
      setData(prev => ({ ...prev, totalStudents: snapshot.size || prev.totalStudents }));
    });

    const unsubscribeTeachers = onSnapshot(collection(db, "teachers"), (snapshot) => {
      setData(prev => ({ ...prev, totalTeachers: snapshot.size || prev.totalTeachers }));
    });

    const unsubscribeActivity = onSnapshot(
      query(collection(db, "activity"), orderBy("createdAt", "desc"), limit(5)),
      (snapshot) => {
        const activities = snapshot.docs.map(doc => ({
           text: doc.data().text,
           time: "Recent",
           dot: doc.data().type === 'alert' ? 'bg-red-500' : 'bg-blue-500'
        }));
        if (activities.length > 0) {
          setData(prev => ({ ...prev, recentActivity: activities }));
        }
      }
    );

    setLoading(false);
    return () => {
      unsubscribeStudents();
      unsubscribeTeachers();
      unsubscribeActivity();
    };
  }, []);

  return { data, loading };
};
