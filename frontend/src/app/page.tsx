"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";
import LoginModal from "@/components/LoginModal";

export default function Home() {
  const { user, loginWithGoogle, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setMessage({ type: "error", text: "Please enter a description." });
      return;
    }

    if (!user) {
      setIsModalOpen(true);
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("description", description);
    formData.append("location", "Location pending"); // Placeholder or geolocation
    if (user) {
      formData.append("user_id", user.uid);
    }
    if (file) {
      formData.append("image", file);
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    try {
      // Get Firebase Auth ID Token for backend verification
      const token = user ? await user.getIdToken() : null;
      
      const response = await fetch(`${apiUrl}/complaints/`, {
        method: "POST",
        body: formData,
        headers: token ? { "Authorization": `Bearer ${token}` } : {},
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Report submitted successfully! AI is analyzing..." });
        setDescription("");
        setFile(null);
        setPreviewUrl(null);
      } else {
        const errorData = await response.json();
        setMessage({ type: "error", text: errorData.detail || "Submission failed." });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: "Network error: Unable to reach backend API." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
        <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
          <div className="text-2xl font-black tracking-tighter text-white bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-700">
            CIVIC.AI
          </div>
          <div className="hidden md:flex items-center gap-8 font-manrope font-bold tracking-tight">
            <Link className="text-cyan-400 border-b-2 border-cyan-400 pb-1" href="#"> Platform </Link>
            <Link className="text-slate-300 hover:text-white transition-colors" href="/dashboard"> Transparency </Link>
            <Link className="text-slate-300 hover:text-white transition-colors" href="#"> Impact </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {user.photoURL && (
                  <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-cyan-400" />
                )}
                <span className="text-slate-300 text-sm font-semibold">{user.displayName}</span>
                <button onClick={logout} className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white transition-all">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={() => setIsModalOpen(true)} className="px-5 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-all opacity-80 hover:opacity-100">
                Sign In
              </button>
            )}
            <a
              href="#submission"
              className="px-6 py-2.5 bg-primary text-on-primary font-bold rounded-lg shadow-[0_0_12px_rgba(0,218,243,0.3)] hover:scale-95 active:scale-90 transition-transform cursor-pointer"
            >
              Report Now
            </a>
          </div>
        </div>
      </nav>
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <main id="main-content" className="pt-24">
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex items-center overflow-hidden px-6 lg:px-12">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-secondary-container/10 rounded-full blur-[100px]"></div>
          
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-8">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-xs font-bold tracking-widest uppercase text-primary">Live Intelligence Feed</span>
              </div>
              <h1 className="font-headline font-extrabold text-5xl md:text-7xl tracking-tighter text-white leading-[0.95] mb-8">
                Luminescent Oversight for <span className="text-primary italic">Smarter Cities</span>
              </h1>
              <p className="font-body text-xl text-slate-400 leading-relaxed mb-10 max-w-xl">
                Empower your community with AI-driven civic action. Report potholes, infrastructure failures, or maintenance needs with instant verification and transparent resolution tracking.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#submission" className="soul-gradient text-on-primary px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-transform flex items-center gap-3">
                  <span className="material-symbols-outlined">rocket_launch</span> Initialize Report
                </a>
                <a href="/dashboard" className="px-8 py-4 glass-panel ghost-border rounded-xl font-bold text-lg text-white hover:bg-surface-container-highest transition-all flex items-center gap-3">
                  <span className="material-symbols-outlined">visibility</span> View Dashboard
                </a>
              </div>
            </div>

            <div className="relative group">
              <div className="glass-panel ghost-border rounded-3xl p-8 relative z-20 overflow-hidden shadow-2xl transition-all duration-500 group-hover:translate-y-[-8px]">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <p className="text-slate-400 text-sm font-semibold tracking-wide mb-1">REAL-TIME STATUS</p>
                    <h3 className="text-2xl font-bold text-white">Central District #402</h3>
                  </div>
                  <div className="bg-tertiary/20 text-tertiary px-3 py-1 rounded-full text-xs font-bold border border-tertiary/30">
                    AI VERIFIED
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-4 p-4 rounded-xl bg-surface-container-high/50">
                    <span className="material-symbols-outlined text-primary">warning</span>
                    <div>
                      <p className="text-white font-semibold">Infrastructure Failure</p>
                      <p className="text-slate-400 text-sm">Deep pothole reported on Main Ave.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-12 h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="soul-gradient h-full w-[65%] rounded-full shadow-[0_0_10px_rgba(0,218,243,0.5)]"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Submission Hub */}
        <section id="submission" className="py-24 px-6 lg:px-12 bg-surface-container-low/40Scroll">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline font-bold text-4xl text-white mb-4">The Submission Hub</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Choose your medium of influence. Our neural networks process every input type to ensure your voice is translated into actionable data.</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-16 bg-surface-container-high rounded-2xl p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <span className="material-symbols-outlined text-white/5 text-[120px]">biotech</span>
              </div>
              <div className="relative z-10 max-w-2xl">
                <label htmlFor="complaint-description" className="block text-secondary text-sm font-bold mb-4 tracking-widest uppercase">Quick Narrative Submission</label>
                
                <div className="relative space-y-4">
                  <textarea 
                    id="complaint-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-800/60 border-none rounded-lg p-6 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary transition-all resize-none" 
                    placeholder="E.g., Street lamp out near the central park north entrance..." 
                    rows={4}
                    maxLength={1000}
                    aria-label="Describe the civic issue you want to report"
                    aria-describedby="char-count"
                  ></textarea>
                  <p id="char-count" className="text-xs text-slate-500 text-right">{description.length}/1000</p>

                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-4">
                      <label className="cursor-pointer bg-slate-700/60 hover:bg-slate-700 p-3 rounded-lg flex items-center gap-2 text-white transition-colors">
                        <span className="material-symbols-outlined text-cyan-400" aria-hidden="true">add_a_photo</span>
                        <span className="text-sm">{file ? "Change Image" : "Attach Image"}</span>
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" aria-label="Attach an image of the civic issue" />
                      </label>
                      
                      {file && (
                        <div className="flex items-center gap-2">
                          {previewUrl && (
                            <div className="relative h-12 w-16 rounded border border-cyan-400/30 overflow-hidden shrink-0">
                              <img src={previewUrl} alt={`Preview of ${file.name}`} className="h-full w-full object-cover" />
                            </div>
                          )}
                          <div className="text-xs text-slate-400">
                            <p className="font-semibold text-slate-300 truncate max-w-[150px]">{file.name}</p>
                            <p>{(file.size / 1024).toFixed(1)} KB</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      aria-busy={loading}
                      aria-label="Submit civic issue report"
                      className="bg-primary text-on-primary font-bold px-8 py-3 rounded-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <><span className="animate-spin material-symbols-outlined text-sm" aria-hidden="true">progress_activity</span> Processing...</>
                      ) : "Process Report"}
                    </button>
                  </div>

                  {message && (
                    <div 
                      role="alert" 
                      aria-live="polite"
                      className={`mt-4 p-4 rounded-lg text-sm font-medium flex items-center gap-2 ${message.type === "success" ? "bg-tertiary/10 text-tertiary border border-tertiary/20" : "bg-error/10 text-error border border-error/20"}`}
                    >
                      <span className="material-symbols-outlined text-base" aria-hidden="true">
                        {message.type === "success" ? "check_circle" : "error"}
                      </span>
                      {message.text}
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
