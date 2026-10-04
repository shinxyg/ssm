import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (role: 'user' | 'admin') => void;
  onBackToHome: () => void;
  darkMode?: boolean;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onBackToHome,
  darkMode = true,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // Register Fields
  const [fullName, setFullName] = useState<string>('');
  const [qcId, setQcId] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (isRegisterMode) {
      if (!fullName.trim() || !email.trim() || !password.trim()) {
        setErrorMessage('Please fill in all required fields.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      setSuccessMessage('Registration successful! You can now log in.');
      setTimeout(() => {
        setIsRegisterMode(false);
        setSuccessMessage(null);
      }, 1500);
    } else {
      // Login mode
      if (!email.trim() || !password.trim()) {
        setErrorMessage('Please enter your email and password.');
        return;
      }
      const lowerEmail = email.toLowerCase().trim();
      if (lowerEmail.includes('admin')) {
        onLoginSuccess('admin');
      } else {
        onLoginSuccess('user');
      }
    }
  };

  return (
    <div className={`h-screen max-h-screen overflow-hidden w-full flex flex-col md:flex-row font-['Plus_Jakarta_Sans',sans-serif] ${
      darkMode ? 'bg-[#050a14] text-slate-100' : 'bg-slate-900 text-slate-100'
    }`}>
      {/* Left Column: Branding / Official Seal Area */}
      <div className="md:w-1/2 h-full relative flex flex-col justify-between p-6 sm:p-8 lg:p-10 bg-[#070e1b] border-r border-slate-800/80 overflow-hidden select-none">
        
        {/* Top Header Action: Back to Home */}
        <div className="relative z-10">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Center: Large Official Circular Government Seal Logo with Overlay Text */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto py-4">
          <div className="relative w-80 h-80 sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px] flex items-center justify-center">
            
            {/* Official Government Service Integrity Seal Image */}
            <img
              src="/Government Service Integrity Seal.png"
              alt="Government Service Integrity Seal"
              className="w-full h-full object-contain mix-blend-multiply opacity-30 select-none pointer-events-none filter brightness-90"
            />

            {/* Overlay Title & Description directly over Seal graphic */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10 space-y-3">
              <h2 className="font-extrabold text-white tracking-tight leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.99)]">
                <span className="block whitespace-nowrap text-xl sm:text-2xl md:text-3xl lg:text-[35px]">
                  Social Services
                </span>
                <span className="block whitespace-nowrap text-xl sm:text-2xl md:text-3xl lg:text-[35px] mt-1">
                  Management Portal
                </span>
              </h2>

              <p className="max-w-xs sm:max-w-sm text-xs sm:text-sm text-slate-200 font-normal leading-relaxed pt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.99)]">
                Streamlining community welfare, financial aid, and support programs for residents in need.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer Credit */}
        <div className="relative z-10 text-center text-[11px] text-slate-500 font-medium">
          © Social Services Management System • Community Care Portal
        </div>
      </div>

      {/* Right Column: Login / Register Form Card Container */}
      <div className="md:w-1/2 h-full flex items-center justify-center p-6 sm:p-8 bg-[#050a14] overflow-hidden">
        <div className="w-full max-w-sm bg-[#0d1628]/90 border border-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-sm animate-in fade-in duration-300">
          
          {/* Card Header */}
          <div className="space-y-1 mb-5 text-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isRegisterMode ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              {isRegisterMode
                ? 'Register to apply for social services and track applications'
                : 'Sign in to access your social service dashboard'}
            </p>
          </div>

          {/* Alert Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-500/40 rounded-xl text-red-300 text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}



          {/* Form Controls */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name Field (Register Mode Only) */}
            {isRegisterMode && (
              <div>
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1 block">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jefferson F. Lee"
                  className="w-full px-3.5 py-3 bg-[#101c38] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            )}

            {/* QC ID / PhilSys ID Field (Register Mode Only) */}
            {isRegisterMode && (
              <div>
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1 block">
                  QCID / PHILSYS ID NUMBER
                </label>
                <input
                  type="text"
                  value={qcId}
                  onChange={(e) => setQcId(e.target.value)}
                  placeholder="110000262304143"
                  className="w-full px-3.5 py-3 bg-[#101c38] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            )}

            {/* Email Address Field */}
            <div>
              <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1 block">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                className="w-full px-3.5 py-3 bg-[#101c38] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
                  PASSWORD
                </label>
                {!isRegisterMode && (
                  <button
                    type="button"
                    onClick={() => setErrorMessage('Password reset link sent to your registered email.')}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-3 bg-[#101c38] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Register Mode Only) */}
            {isRegisterMode && (
              <div>
                <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1 block">
                  CONFIRM PASSWORD *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-3 bg-[#101c38] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition-all mt-1 cursor-pointer"
            >
              {isRegisterMode ? 'Register' : 'Login'}
            </button>
          </form>

          {/* Footer Toggle between Login & Register */}
          <div className="mt-5 text-center text-xs text-slate-400 font-medium">
            {isRegisterMode ? (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(false);
                    setErrorMessage(null);
                  }}
                  className="font-bold text-blue-400 hover:text-blue-300 transition-colors underline cursor-pointer"
                >
                  Login here
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(true);
                    setErrorMessage(null);
                  }}
                  className="font-bold text-blue-400 hover:text-blue-300 transition-colors underline cursor-pointer"
                >
                  Register here
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
