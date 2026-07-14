import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { loginWithGoogle, auth } from '../services/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default function SignInPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      if (tab === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        if (name.trim()) {
          await updateProfile(credential.user, { displayName: name.trim() });
        }
      }
      setStep('success');
      await new Promise(r => setTimeout(r, 1000));
      navigate('/app');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await loginWithGoogle();
      setStep('success');
      await new Promise(r => setTimeout(r, 1000));
      navigate('/app');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      
      {/* Background grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Subtle orbs */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(245,184,0,0.08) 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)' }}
      />

      <div className="w-full max-w-md relative z-10">
        
        {/* Logo at top */}
        <div className="mb-8 flex justify-center">
          <Link to="/" className="w-24 block">
            <img src="/logo.png" alt="Dooit" className="w-full h-auto object-contain" />
          </Link>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <AnimatePresence mode="wait">
            {step === 'success' ? (
              /* Success State */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center text-center py-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6"
                >
                  <CheckCircle2 size={32} className="text-green-400" />
                </motion.div>
                <h2 className="text-2xl font-black text-white mb-2">Welcome to Dooit</h2>
                <p className="text-white/40 text-sm">Taking you to your workspace...</p>
                <div className="mt-6 w-8 h-1 bg-[#F5B800] rounded-full animate-pulse" />
              </motion.div>
            ) : (
              /* Form State */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Heading */}
                <div className="text-center mb-7">
                  <h2 className="text-2xl font-black text-white mb-1.5">
                    {tab === 'signin' ? 'Sign in to Dooit' : 'Create your account'}
                  </h2>
                  <p className="text-white/40 text-sm">
                    {tab === 'signin'
                      ? 'Enter your details below to continue.'
                      : 'Start your free workspace today.'}
                  </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-1 p-1 bg-white/5 border border-white/8 rounded-xl mb-6">
                  {[['signin', 'Sign In'], ['signup', 'Sign Up']].map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setTab(key)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        tab === key ? 'bg-[#F5B800] text-black shadow' : 'text-white/40 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Google Button */}
                <button
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-5 bg-white text-[#111] font-bold text-sm rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all shadow mb-5 disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-[#111]/20 border-t-[#111] rounded-full animate-spin" />
                  ) : (
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                  )}
                  Continue with Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-white/8" />
                  <span className="text-white/20 text-xs font-medium uppercase tracking-wider">or</span>
                  <div className="flex-1 h-px bg-white/8" />
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center mb-4">
                    {errorMsg}
                  </div>
                )}

                {/* Form Inputs */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Name field - sign up only */}
                  <AnimatePresence>
                    {tab === 'signup' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="relative">
                          <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                          <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Your full name"
                            required
                            className="w-full pl-10 pr-4 py-3.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#F5B800]/50 focus:bg-white/[0.07] transition-all"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email */}
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      className="w-full pl-10 pr-4 py-3.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#F5B800]/50 focus:bg-white/[0.07] transition-all"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="w-full pl-10 pr-11 py-3.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#F5B800]/50 focus:bg-white/[0.07] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                    >
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  {/* Forgot password */}
                  {tab === 'signin' && (
                    <div className="text-right -mt-2">
                      <a href="#" className="text-xs text-[#F5B800]/60 hover:text-[#F5B800] transition-colors">
                        Forgot password?
                      </a>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#F5B800] text-black font-black text-sm hover:bg-[#F5B800]/90 active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(245,184,0,0.25)] disabled:opacity-60 group mt-1"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        {tab === 'signin' ? 'Sign in' : 'Create Account'}
                        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                {/* Terms policy */}
                <p className="text-white/20 text-xs text-center mt-5 leading-relaxed">
                  By continuing, you agree to our{' '}
                  <a href="#" className="text-white/35 hover:text-white/60 transition-colors underline underline-offset-2">Terms</a>
                  {' '}and{' '}
                  <a href="#" className="text-white/35 hover:text-white/60 transition-colors underline underline-offset-2">Privacy Policy</a>.
                </p>

                {/* Back to Home */}
                <div className="text-center mt-6">
                  <Link to="/" className="text-white/25 text-sm hover:text-white/50 transition-colors flex items-center justify-center gap-1.5">
                    Back to homepage
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
