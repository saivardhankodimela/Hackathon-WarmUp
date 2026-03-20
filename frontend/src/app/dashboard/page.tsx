"use client";

import { useEffect, useState } from "react";

interface Complaint {
  id: string;
  description: string;
  category: string;
  severity: string;
  status: string;
  created_at: string;
  image_url?: string;
  location?: string;
}

export default function Dashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<str | null>(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch("http://localhost:8080/complaints");
        if (!response.ok) {
          throw new Error("Failed to fetch complaints");
        }
        const data = await response.json();
        setComplaints(data);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const totalReports = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === "pending").length;
  const resolvedCount = complaints.filter((c) => c.status === "resolved").length;

  return (
    <>
      {/* Side Navigation */}
      <aside className="fixed left-0 top-0 h-full flex flex-col z-50 h-screen w-64 border-r border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl shadow-cyan-900/20">
        <div className="p-8">
          <h1 className="text-2xl font-bold tracking-tighter text-cyan-400 font-headline">
            Civic AI
          </h1>
          <p className="text-slate-400 text-xs tracking-widest uppercase mt-1 font-semibold">
            Intelligence Portal
          </p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a className="flex items-center gap-3 px-4 py-3 text-cyan-400 bg-cyan-500/10 rounded-lg border-r-2 border-cyan-400 font-manrope text-sm font-semibold tracking-tight transition-all duration-300" href="#">
            <span className="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-300 font-manrope text-sm font-semibold tracking-tight" href="/">
            <span className="material-symbols-outlined">assessment</span>
            <span>Home</span>
          </a>
        </nav>
      </aside>

      {/* Top Header */}
      <header className="sticky top-0 right-0 flex items-center justify-between px-8 z-40 ml-64 w-[calc(100%-16rem)] h-16 bg-slate-900/40 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center flex-1">
          <div className="relative w-full max-w-md group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors">search</span>
            <input className="w-full bg-slate-800/60 border-none rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500/50 transition-all" placeholder="Search civic nodes..." type="text"/>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-bold text-white">Alex Rivera</p>
            <p className="text-[10px] text-cyan-400 font-semibold tracking-tighter">ADMINISTRATOR</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-64 p-8 min-h-screen">
        <section className="mb-12">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <h2 className="text-4xl font-extrabold font-headline tracking-tight text-white mb-2">Civic Intelligence Overview</h2>
              <p className="text-slate-400 mt-1 font-medium">Real-time infrastructure health and complaint metrics</p>
            </div>
            <span className="px-3 py-1 bg-tertiary/10 text-tertiary text-xs font-bold rounded-full border border-tertiary/20 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">verified</span> AI-Verified
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat Cards */}
            <div className="bg-slate-800/40 p-6 rounded-xl border border-white/10 relative overflow-hidden group">
              <p className="text-slate-400 text-sm font-semibold mb-2">Total Reports</p>
              <h3 className="text-3xl font-extrabold text-white">{loading ? "..." : totalReports}</h3>
            </div>
            <div className="bg-slate-800/40 p-6 rounded-xl border border-white/10 relative overflow-hidden group">
              <p className="text-slate-400 text-sm font-semibold mb-2">Pending</p>
              <h3 className="text-3xl font-extrabold text-white">{loading ? "..." : pendingCount}</h3>
            </div>
            <div className="bg-slate-800/40 p-6 rounded-xl border border-white/10 relative overflow-hidden group">
              <p className="text-slate-400 text-sm font-semibold mb-2">Resolved</p>
              <h3 className="text-3xl font-extrabold text-white">{loading ? "..." : resolvedCount}</h3>
            </div>
          </div>
        </section>

        {/* Live Complaint Feed */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Live Complaint Feed</h2>
          </div>

          {loading ? (
            <p className="text-slate-400">Loading complaints...</p>
          ) : error ? (
            <p className="text-error">{error}</p>
          ) : complaints.length === 0 ? (
            <p className="text-slate-400">No complaints reported yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {complaints.map((complaint) => (
                <div key={complaint.id} className="glass-card rounded-xl p-6 hover:shadow-2xl hover:shadow-cyan-500/5 transition-all duration-500 group">
                  <div className="flex items-start gap-6">
                    {complaint.image_url && (
                      <div className="relative w-40 h-28 rounded-lg overflow-hidden shrink-0 border border-white/10">
                        <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={complaint.image_url} alt="Civic Issue" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">{complaint.category || "General"}</span>
                            <span className="text-slate-500 text-xs">•</span>
                            <span className="text-slate-400 text-xs font-medium">{new Date(complaint.created_at).toLocaleString()}</span>
                          </div>
                          <h4 className="text-xl font-bold mb-2 text-white">{complaint.description.substring(0, 50)}...</h4>
                          <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">{complaint.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-3 py-1 text-xs font-black rounded-full border ${complaint.severity === 'high' ? 'bg-error/10 text-error border-error/20' : complaint.severity === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-green-500/10 text-green-500 border-green-500/20'}`}>
                            {complaint.severity ? complaint.severity.toUpperCase() : "NORMAL"}
                          </span>
                          <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold rounded uppercase tracking-tighter">
                            Status: {complaint.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
