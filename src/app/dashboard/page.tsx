"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({ likesCount: 0, commentsCount: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Studio Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Likes</h3>
          <p className="text-3xl">{stats.likesCount}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Comments</h3>
          <p className="text-3xl">{stats.commentsCount}</p>
        </div>
      </div>
    </div>
  );
}