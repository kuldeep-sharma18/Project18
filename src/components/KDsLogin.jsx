import { useState } from "react";
import { GraduationCap, Sparkles, Mail, Phone, Eye, EyeOff } from "lucide-react";

export default function KDsLogin({ onLoginSuccess }) {
  const [mode, setMode] = useState("mobile"); // "mobile" | "email" | "signup"
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [simulatedOtp, setSimulatedOtp] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Persist registered users in localStorage
  const getRegisteredUsers = () => {
    try {
      return JSON.parse(localStorage.getItem("kds_registered_users") || "[]");
    } catch {
      return [];
    }
  };

  const saveRegisteredUser = (user) => {
    const users = getRegisteredUsers();
    const exists = users.find((u) => u.email === user.email);
    if (!exists) {
      users.push(user);
      localStorage.setItem("kds_registered_users", JSON.stringify(users));
    }
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    setVerificationError("");
    if (!mobileNumber || mobileNumber.length < 10 || isNaN(mobileNumber)) {
      setVerificationError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      setSimulatedOtp(otp);
      setOtpSent(true);
      setIsSubmitting(false);
      alert(`[KDs OTP Gateway Simulator]\nYour verification code: ${otp}\n\n(Bypass code: 1234)`);
    }, 700);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setVerificationError("");
    if (otpCode === simulatedOtp || otpCode === "1234") {
      const payload = {
        identifier: mobileNumber,
        loginType: "Mobile OTP",
        loginTime: new Date().toLocaleTimeString(),
        name: "Student",
      };
      saveRegisteredUser({ mobile: mobileNumber, loginType: "mobile" });
      onLoginSuccess(payload);
    } else {
      setVerificationError("Incorrect OTP. Please try again or use bypass code '1234'.");
    }
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    setVerificationError("");
    if (!emailAddress || !password) {
      setVerificationError("Please fill in all fields.");
      return;
    }
    const users = getRegisteredUsers();
    const user = users.find((u) => u.email === emailAddress && u.password === password);
    if (user) {
      onLoginSuccess({
        identifier: emailAddress,
        loginType: "Email",
        loginTime: new Date().toLocaleTimeString(),
        name: user.name || "Student",
      });
    } else {
      setVerificationError("Invalid credentials. Please sign up first or check your password.");
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setVerificationError("");
    if (!fullName || !emailAddress || !password) {
      setVerificationError("All fields are required.");
      return;
    }
    if (password.length < 6) {
      setVerificationError("Password must be at least 6 characters.");
      return;
    }
    const users = getRegisteredUsers();
    const exists = users.find((u) => u.email === emailAddress);
    if (exists) {
      setVerificationError("An account with this email already exists. Please login.");
      return;
    }
    const newUser = { email: emailAddress, password, name: fullName };
    saveRegisteredUser(newUser);
    onLoginSuccess({
      identifier: emailAddress,
      loginType: "Email Signup",
      loginTime: new Date().toLocaleTimeString(),
      name: fullName,
    });
  };

  const handleGoogleLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const payload = {
        identifier: "student@gmail.com",
        loginType: "Google",
        loginTime: new Date().toLocaleTimeString(),
        name: "Google User",
      };
      setIsSubmitting(false);
      onLoginSuccess(payload);
    }, 600);
  };

  const features = [
    { icon: "🎯", title: "Free Mocks and Daily Tests", desc: "Prepare with expert-level simulated series" },
    { icon: "📚", title: "Free Study Materials PDF", desc: "100+ formulas, shortcuts & key handouts" },
    { icon: "🔔", title: "Get Latest MBA Exam & College Updates", desc: "Instant cutoff & notification alerts" },
    { icon: "👤", title: "1-On-1 Mentorship Guidance", desc: "Custom plans from IIM alumni coaches" },
    { icon: "⭐", title: "10+ Years of Experience", desc: "Proven pedagogy for thousands of toppers" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">

      {/* Top promo strip */}
      <div className="bg-sky-900 text-white text-center py-2 px-4 text-xs font-semibold flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Flat 70% Off on All Premium CAT/XAT/MBA Coaching Packages — Offer Ends Tonight!</span>
        <span className="bg-amber-400 text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded ml-2">CAT 2026</span>
      </div>

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-gray-900 tracking-tight">kd</span>
            <span className="text-2xl font-black text-blue-600">s</span>
            <GraduationCap className="w-5 h-5 text-blue-500" />
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-600">
            {["Mocks", "Sectionals", "Past Papers", "Learn", "Practice", "Courses"].map((item) => (
              <span key={item} className="hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-1">
                {item} <span className="text-gray-400 text-xs">▾</span>
              </span>
            ))}
            <button className="bg-amber-400 hover:bg-amber-500 text-gray-900 px-4 py-2 rounded text-xs font-black uppercase tracking-wide transition-colors">
              🎁 Upto 70% Off
            </button>
          </div>
        </div>
      </nav>

      {/* Main hero split layout */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden w-full max-w-4xl grid grid-cols-1 md:grid-cols-2">

          {/* LEFT — Blue info panel */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />

            {/* Brand */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl font-black">kds</span>
                <GraduationCap className="w-6 h-6 text-blue-200" />
              </div>
              <p className="text-blue-100 font-bold text-sm leading-snug">
                India's Top MBA Entrance Exam Coaching
              </p>
            </div>

            {/* Feature list cards */}
            <div className="relative z-10 space-y-2.5">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/10 flex items-center gap-3 transition-colors"
                >
                  <span className="text-xl shrink-0">{f.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-white leading-snug">{f.title}</p>
                    <p className="text-[10px] text-blue-200 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mentor profile strip */}
            <div className="relative z-10 flex items-center gap-3 border-t border-white/15 pt-4 mt-auto">
              <div className="w-10 h-10 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center text-white font-black text-sm shrink-0">
                KD
              </div>
              <div>
                <p className="text-xs font-black text-white">Sayantan Dey, CAT 100%iler</p>
                <p className="text-[10px] text-blue-200">KDs Chief Academic Director</p>
              </div>
            </div>
          </div>

          {/* RIGHT — Login form */}
          <div className="p-8 flex flex-col gap-5 bg-white">
            {/* Heading */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <h2 className="text-2xl font-black text-gray-900">Hello!</h2>
                <span className="text-2xl">👋</span>
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 leading-tight">
                Ready to Unlock Your Success?
              </h3>
              <p className="text-xs text-gray-500 mt-1">Login to your KDs account.</p>
            </div>

            {/* Illustration placeholder */}
            <div className="bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center py-4">
              <span className="text-4xl">🎓</span>
            </div>

            {/* Error banner */}
            {verificationError && (
              <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-3 text-xs font-semibold">
                {verificationError}
              </div>
            )}

            {/* MOBILE OTP FORM */}
            {mode === "mobile" && !otpSent && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="flex rounded-xl border border-gray-300 focus-within:border-blue-500 overflow-hidden shadow-sm">
                  <div className="bg-gray-50 border-r border-gray-200 px-3 flex items-center">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-500 ml-1">+91</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                    placeholder="Mobile Number"
                    className="flex-1 text-sm p-3 focus:outline-none text-gray-800 font-medium"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold px-5 shrink-0 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? "..." : "Send OTP"}
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                  By Continuing, you agree to KDs'{" "}
                  <span className="text-blue-600 cursor-pointer hover:underline">Terms</span> &{" "}
                  <span className="text-blue-600 cursor-pointer hover:underline">Privacy Policy</span>.
                </p>
              </form>
            )}

            {/* OTP VERIFY FORM */}
            {mode === "mobile" && otpSent && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-xs text-gray-700">
                  OTP sent to <strong>+91 {mobileNumber}</strong>
                  <button type="button" onClick={() => setOtpSent(false)} className="text-blue-600 ml-2 hover:underline">
                    Edit
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 4-digit OTP"
                    className="flex-1 text-center text-sm p-3 border border-gray-300 focus:border-blue-500 focus:outline-none rounded-xl font-mono font-black tracking-widest"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-gray-900 hover:bg-gray-800 text-white px-5 rounded-xl text-xs font-bold uppercase cursor-pointer"
                  >
                    Verify
                  </button>
                </div>
              </form>
            )}

            {/* EMAIL LOGIN FORM */}
            {mode === "email" && (
              <form onSubmit={handleEmailLogin} className="space-y-3">
                <div className="flex rounded-xl border border-gray-300 focus-within:border-blue-500 overflow-hidden shadow-sm">
                  <div className="bg-gray-50 border-r border-gray-200 px-3 flex items-center">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="Email address"
                    className="flex-1 text-sm p-3 focus:outline-none text-gray-800"
                    required
                  />
                </div>
                <div className="flex rounded-xl border border-gray-300 focus-within:border-blue-500 overflow-hidden shadow-sm">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="flex-1 text-sm p-3 pl-4 focus:outline-none text-gray-800"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                >
                  Login with Email
                </button>
                <p className="text-center text-xs text-gray-500">
                  No account?{" "}
                  <button type="button" onClick={() => setMode("signup")} className="text-blue-600 font-bold hover:underline cursor-pointer">
                    Sign up here
                  </button>
                </p>
              </form>
            )}

            {/* SIGNUP FORM */}
            {mode === "signup" && (
              <form onSubmit={handleSignup} className="space-y-3">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full text-sm p-3 border border-gray-300 focus:border-blue-500 focus:outline-none rounded-xl"
                  required
                />
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="Email address"
                  className="w-full text-sm p-3 border border-gray-300 focus:border-blue-500 focus:outline-none rounded-xl"
                  required
                />
                <div className="flex rounded-xl border border-gray-300 focus-within:border-blue-500 overflow-hidden">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create Password (min 6 chars)"
                    className="flex-1 text-sm p-3 focus:outline-none text-gray-800"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="px-3 text-gray-400 cursor-pointer">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                >
                  Create Account & Start Learning
                </button>
                <p className="text-center text-xs text-gray-500">
                  Already have an account?{" "}
                  <button type="button" onClick={() => setMode("email")} className="text-blue-600 font-bold hover:underline cursor-pointer">
                    Login
                  </button>
                </p>
              </form>
            )}

            {/* Divider */}
            {(mode === "mobile" || mode === "email") && (
              <>
                <div className="relative text-center">
                  <hr className="border-gray-200" />
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Or
                  </span>
                </div>

                {/* Google Login */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isSubmitting}
                  className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Toggle between mobile/email */}
                <div className="text-center space-y-1">
                  {mode === "mobile" ? (
                    <button
                      type="button"
                      onClick={() => { setMode("email"); setVerificationError(""); setOtpSent(false); }}
                      className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      Signup / Login with Email
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => { setMode("mobile"); setVerificationError(""); }}
                      className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer"
                    >
                      ← Login with Mobile OTP
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-5 text-center text-xs border-t border-gray-800">
        <p>© 2026 KDs India Ltd. · Trusted by 10,000+ CAT & MBA Aspirants</p>
        <div className="flex justify-center gap-4 mt-2 text-gray-500">
          <span className="hover:text-white cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-white cursor-pointer">Terms of Service</span>
          <span>•</span>
          <span className="hover:text-amber-400 font-bold cursor-pointer">Contact: support@kds.in</span>
        </div>
      </footer>

    </div>
  );
}
