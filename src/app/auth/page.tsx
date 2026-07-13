"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Zap, Mail, Lock, User, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

type AuthState = "signin" | "signup" | "forgot" | "verify";

const getErrorMessage = (err: any): string => {
  if (!err) return "An unknown error occurred.";
  if (typeof err === "string") return err;
  if (typeof err === "object") {
    if (err.message) return err.message;
    if (err.error_description) return err.error_description;
    if (err.error) return typeof err.error === "string" ? err.error : JSON.stringify(err.error);
    if (err.toString && err.toString() !== "[object Object]") return err.toString();
    
    const keys = Object.keys(err);
    if (keys.length > 0) {
      return `Error details: ${keys.map(k => `${k}: ${JSON.stringify(err[k])}`).join(", ")}`;
    }
  }
  const str = JSON.stringify(err);
  if (str === "{}" || !str) {
    return "Connection error: Supabase rejected the sign-in request. Please double check that your Brevo SMTP username/password keys in your Supabase dashboard are correct, and verify that 'Allow Signups' is enabled under Authentication -> Providers.";
  }
  return str;
};

export default function AuthPage() {
  const router = useRouter();
  const { login, isAuthenticated, globalLogins, globalBattles } = useApp();
  const [mode, setMode] = useState<AuthState>("signin");
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [code, setCode] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { shouldCreateUser: false } // only login
        });
        if (error) throw error;
        setSuccessMsg(`A verification OTP code has been dispatched to ${email}`);
        setMode("verify");
      } catch (err: any) {
        setErrorMsg(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    } else {
      // Mock Bypass fallback
      login(email);
      router.push("/dashboard");
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !usernameInput) return;
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { shouldCreateUser: true } // sign up or login
        });
        if (error) throw error;
        setSuccessMsg(`A verification OTP code has been dispatched to ${email}`);
        setMode("verify");
      } catch (err: any) {
        setErrorMsg(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    } else {
      // Mock Bypass fallback
      setSuccessMsg(`A verification code was sent to ${email}`);
      setMode("verify");
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !code) return;
    setIsLoading(true);
    setErrorMsg("");
    
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token: code,
          type: "email"
        });
        if (error) throw error;
        login(email);
        router.push("/dashboard");
      } catch (err: any) {
        setErrorMsg(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    } else {
      // Mock Bypass fallback
      login(email || "NewNinja@gmail.com");
      router.push("/dashboard");
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(`Recovery link has been sent to ${email}`);
    setTimeout(() => {
      setSuccessMsg("");
      setMode("signin");
    }, 3000);
  };

  const handleOAuthLogin = (provider: string) => {
    login(`${provider.toLowerCase()}User@productivity.net`);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#050508] relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] rounded-full bg-violet-900/10 blur-[130px] pointer-events-none"></div>

      <div className="w-full max-w-5xl rounded-[30px] overflow-hidden glass-panel border border-slate-800/80 shadow-2xl grid md:grid-cols-12 min-h-[580px] relative z-10">
        
        {/* Left Info Panel */}
        <div className="md:col-span-5 bg-gradient-to-br from-violet-900/40 via-indigo-950/30 to-slate-950/90 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/50">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-10">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Zap className="text-white w-4.5 h-4.5" />
              </div>
              <span className="font-extrabold text-base tracking-wider text-slate-100 uppercase">
                Prod<span className="text-cyan-400">Arena</span>
              </span>
            </Link>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-150 leading-tight mb-4">
              Conquer <span className="neon-text-gradient">Procrastination</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
              Join the elite league. Compete with peers, level up daily tasks, log deep focus time, and grow your Tamagotchi pets.
            </p>
          </div>

          <div className="space-y-4 text-xs font-semibold text-slate-400 pt-6 border-t border-slate-900">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>{globalBattles} Battles Logged Today</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse"></span>
              <span>{globalLogins} Users Coding/Studying Right Now</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="md:col-span-7 bg-[#0b0b12]/80 p-8 flex flex-col justify-center">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-semibold leading-relaxed">
              ⚠️ {errorMsg}
            </div>
          )}
          {isLoading && (
            <div className="mb-6 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-bold animate-pulse text-center">
              Processing request...
            </div>
          )}
          
          {/* Sign In Form */}
          {mode === "signin" && (
            <div>
              <div className="mb-6">
                <h4 className="text-xl sm:text-2xl font-black text-slate-100">Welcome Back, Champion</h4>
                <p className="text-xs text-slate-400 mt-1">Sign in to resume your focus streak.</p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. hero@productivity.com"
                      required
                      className="w-full pl-11 pr-4 py-3 text-sm glass-input"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-xs text-violet-400 hover:text-violet-300 font-semibold transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-11 pr-4 py-3 text-sm glass-input"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl text-sm font-extrabold bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white neon-glow-primary shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  Enter the Arena <ArrowRight size={16} />
                </button>
              </form>

              {/* Social Logins */}
              <div className="mt-8">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-900"></div>
                  <span className="flex-shrink mx-4 text-slate-500 text-[10px] uppercase font-bold tracking-widest">Or Continue With</span>
                  <div className="flex-grow border-t border-slate-900"></div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <button
                    onClick={() => handleOAuthLogin("Google")}
                    className="flex items-center justify-center gap-2.5 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-900 text-xs font-bold text-slate-350 hover:text-white transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    <span>Google</span>
                  </button>
                  <button
                    onClick={() => handleOAuthLogin("GitHub")}
                    className="flex items-center justify-center gap-2.5 py-3 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-900 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                    <span>GitHub</span>
                  </button>
                </div>
              </div>

              <div className="mt-8 text-center text-xs">
                <span className="text-slate-400">New to the platform? </span>
                <button
                  onClick={() => setMode("signup")}
                  className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </div>
            </div>
          )}

          {/* Sign Up Form */}
          {mode === "signup" && (
            <div>
              <div className="mb-6">
                <h4 className="text-xl sm:text-2xl font-black text-slate-100">Create Account</h4>
                <p className="text-xs text-slate-400 mt-1">Start your journey to unbeatable discipline.</p>
              </div>

              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Username</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="e.g. FocusWarrior"
                      required
                      className="w-full pl-11 pr-4 py-3 text-sm glass-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. warrior@productivity.com"
                      required
                      className="w-full pl-11 pr-4 py-3 text-sm glass-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-11 pr-4 py-3 text-sm glass-input"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl text-sm font-extrabold bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white neon-glow-primary shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01]"
                >
                  Create & Verify Account <ArrowRight size={16} />
                </button>
              </form>

              <div className="mt-8 text-center text-xs">
                <span className="text-slate-400">Already have an account? </span>
                <button
                  onClick={() => setMode("signin")}
                  className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline cursor-pointer"
                >
                  Log In
                </button>
              </div>
            </div>
          )}

          {/* Forgot Password Form */}
          {mode === "forgot" && (
            <div>
              <button
                onClick={() => setMode("signin")}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors mb-6 cursor-pointer"
              >
                <ArrowLeft size={14} /> Back to Sign In
              </button>

              <div className="mb-6">
                <h4 className="text-xl sm:text-2xl font-black text-slate-100">Reset Password</h4>
                <p className="text-xs text-slate-400 mt-1">Enter your email to receive a password recovery link.</p>
              </div>

              {successMsg && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold flex items-center gap-2.5">
                  <CheckCircle size={16} /> {successMsg}
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. warrior@productivity.com"
                      required
                      className="w-full pl-11 pr-4 py-3 text-sm glass-input"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl text-sm font-extrabold bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white neon-glow-primary shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center"
                >
                  Send Recovery Link
                </button>
              </form>
            </div>
          )}

          {/* Verification Screen */}
          {mode === "verify" && (
            <div>
              <div className="mb-6">
                <h4 className="text-xl sm:text-2xl font-black text-slate-100">Verify Email</h4>
                <p className="text-xs text-slate-400 mt-1">{successMsg || "We sent a 6-digit code to your email."}</p>
                {!isSupabaseConfigured && (
                  <div className="mt-2.5 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[11px] font-medium leading-relaxed">
                    🛡️ <strong>Preview Mode:</strong> Since this is a local web prototype, no actual email is dispatched. You can type **any 6 digits** (e.g. <code>123456</code>) to proceed instantly!
                  </div>
                )}
              </div>

              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider text-center">Verification Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="1 2 3 4 5 6"
                    required
                    maxLength={6}
                    className="w-full py-4 text-center tracking-[0.5em] text-xl font-bold glass-input uppercase"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl text-sm font-extrabold bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white neon-glow-primary shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center"
                >
                  Verify & Enter Arena
                </button>
              </form>

              <div className="mt-8 text-center text-xs">
                <span className="text-slate-400">Didn't receive the code? </span>
                <button
                  type="button"
                  onClick={() => setSuccessMsg("A new verification code has been dispatched.")}
                  className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline cursor-pointer"
                >
                  Resend Code
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
