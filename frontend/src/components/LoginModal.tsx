"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);

    try {
      if (isSignUp) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      console.error("Google login error:", err);
      if (err.code === "auth/popup-blocked") {
        setError("Popup was blocked by your browser. Please allow popups for localhost in your browser settings.");
      } else if (err.code === "auth/unauthorized-domain") {
        setError("This domain is not authorized in Firebase. Please add 'localhost' to Firebase Console → Authentication → Settings → Authorized domains.");
      } else {
        setError(err.message || "Google sign-in failed. Check the console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-8 glass-card rounded-2xl border border-white/10 shadow-2xl flex flex-col mx-4">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2 className="text-2xl font-black font-headline text-white mb-2 text-center">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>
        <p className="text-slate-400 text-sm text-center mb-6">
          {isSignUp ? "Sign up to start reporting civic issues" : "Log in to view civic intelligence stats"}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 text-error text-xs rounded-lg font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-xs font-bold mb-1 tracking-wider uppercase">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800/80 border border-white/5 rounded-lg p-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all text-sm" 
              placeholder="E.g., nodes@civic_center.com" 
            />
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-bold mb-1 tracking-wider uppercase">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800/80 border border-white/5 rounded-lg p-3 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all text-sm" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full soul-gradient text-on-primary font-bold p-3 rounded-lg hover:scale-[0.98] active:scale-95 transition-transform flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <div className="absolute border-b border-white/5 w-full"></div>
          <span className="bg-[#0a1124] relative px-3 text-slate-500 text-xs tracking-wider font-bold">OR</span>
        </div>

        {/* Google Trigger */}
        <button 
          onClick={handleGoogleClick}
          className="w-full bg-slate-800/60 border border-white/10 hover:bg-slate-800 p-3 rounded-lg flex items-center justify-center gap-3 text-slate-100 font-semibold text-sm hover:scale-[0.98] transition-transform cursor-pointer"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5"/>
          Continue with Google
        </button>

        <p className="text-slate-400 text-xs text-center mt-6">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-cyan-400 font-bold hover:underline"
          >
            {isSignUp ? "Sign In" : "Create Account"}
          </button>
        </p>
      </div>
    </div>
  );
}
