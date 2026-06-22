import { useState, useRef, useEffect } from "react";
import { ShieldAlert, LogOut, GraduationCap, ChevronDown, User, Bell } from "lucide-react";
import Dashboard from "./components/Dashboard.jsx";
import { PRE_POPULATED_MOCKS } from "./components/Pop.jsx";
import TestSetup from "./components/TestSetup.jsx";
import TestEngine from "./components/TestEngine.jsx";
import KDsLogin from "./components/KDsLogin.jsx";
import MocksCatalog from "./components/MocksCatalog.jsx";
import PastPapers from "./components/PastPapers.jsx";
import LearnBook from "./components/LearnBook.jsx";
import PracticeZone from "./components/PracticeZone.jsx";
import CoursesCatalog from "./components/CoursesCatalog.jsx";

// Dropdown menu definitions matching Cracku nav
const NAV_ITEMS = [
  {
    label: "Mocks",
    view: "MOCKS",
    items: ["CAT Mocks", "XAT Mocks", "SNAP Mocks", "IIFT Mocks", "Free Mock Tests"],
  },
  {
    label: "Sectionals",
    view: "SECTIONALS",
    items: ["Quantitative Aptitude", "Verbal Ability", "DILR", "General Awareness"],
  },
  {
    label: "Past Papers",
    view: "PAST_PAPERS",
    items: ["CAT 2023", "CAT 2022", "CAT 2021", "XAT 2023", "SNAP 2023"],
  },
  {
    label: "Learn",
    view: "LEARN",
    items: ["Formulas Handbook", "Video Lectures", "Concept Notes", "Shortcuts & Tips"],
  },
  {
    label: "Practice",
    view: "PRACTICE",
    items: ["Daily Quiz", "Topic-wise Practice", "Booster Rounds", "Speed Tests"],
  },
  {
    label: "Courses",
    view: "COURSES",
    items: ["CAT Complete 2026", "Quant Mastery Pack", "XAT & SNAP Special", "Free Courses"],
  },
];

function NavDropdown({ item, currentView, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = currentView === item.view;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { onNavigate(item.view); setOpen(!open); }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`flex items-center gap-1 px-1 py-1 text-sm font-semibold transition-colors cursor-pointer ${
          isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
        }`}
      >
        {item.label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl border border-gray-200 shadow-xl z-50 py-1.5 overflow-hidden"
        >
          {item.items.map((sub) => (
            <button
              key={sub}
              onClick={() => { onNavigate(item.view); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer"
            >
              {sub}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState("DASHBOARD");
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [activeTimeLimit, setActiveTimeLimit] = useState(900); // 15 mins default
  const [attempts, setAttempts] = useState(() => {
    try {
      const storedAttempts = localStorage.getItem("quant_rush_attempts");
      if (storedAttempts) return JSON.parse(storedAttempts);
      // seed on first load
      localStorage.setItem("quant_rush_attempts", JSON.stringify(PRE_POPULATED_MOCKS));
      return PRE_POPULATED_MOCKS;
    } catch (e) {
      console.warn("Could not read attempts from localStorage:", e);
      return [];
    }
  });

  // Real LocalStorage Persistence for Login Info
  const [loggedInUser, setLoggedInUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("kds_logged_in_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.warn("Could not read user from localStorage:", e);
      return null;
    }
  });
  const [loadingApp] = useState(false);

  // Non-blocking iframe-compatible overlay confirmation state
  const [confirmModal, setConfirmModal] = useState(null);

  // Check login state on initial boot (loading handled by initial state)

  const handleLoginSuccess = (userPayload) => {
    setLoggedInUser(userPayload);
    try {
      localStorage.setItem("kds_logged_in_user", JSON.stringify(userPayload));
    } catch (e) {
      console.warn("Could not write user to local storage:", e);
    }
    setCurrentView("DASHBOARD");
  };

  const handleLogOut = () => {
    setConfirmModal({
      title: "Logout Account Confirmation",
      message: "Are you sure you want to log out of your KDs coaching account? Your saved stats will remain in this browser.",
      confirmText: "Yes, Logout",
      cancelText: "Keep Me Signed In",
      isDanger: true,
      onConfirm: () => {
        setLoggedInUser(null);
        try {
          localStorage.removeItem("kds_logged_in_user");
        } catch (e) {
          console.warn("Could not wipe user local storage:", e);
        }
        setCurrentView("DASHBOARD");
        setConfirmModal(null);
      }
    });
  };

  // Save attempts helper
  const saveAttempt = (newAttempt) => {
    const updated = [...attempts, newAttempt];
    setAttempts(updated);
    try {
      localStorage.setItem("quant_rush_attempts", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not write to local attempts storage:", e);
    }
    // Return student directly back to dashboard analytics to review solutions!
    setCurrentView("DASHBOARD");
  };

  // Trigger test setup launch
  const handleStartTest = (questions, timeLimitSeconds) => {
    setActiveQuestions(questions);
    setActiveTimeLimit(timeLimitSeconds);
    setCurrentView("TEST");
  };

  // Launch pre-built mock tests (including API-driven test)
  const handleStartMockTest = async (mock) => {
    if (mock.id === "api_mock_test_1") {
      // Dynamic API Question loading! Fulfills: "add questions api where questions will be provided to students in tests"
      try {
        alert("Connecting to backend Express /api/questions endpoint to fetch the latest balanced mock payload...");
        const res = await fetch("/api/questions");
        const data = await res.json();
        
        if (data.success && data.questions && data.questions.length > 0) {
          handleStartTest(data.questions, mock.timeLimitMinutes * 60);
        } else {
          throw new Error("Empty question list returned from backend API.");
        }
      } catch (e) {
        console.error(e);
        alert("Failed to stream questions from /api/questions API. Restoring offline fallback questions...");
        // Fallback to custom filter sequence
        import("./data/questions.js").then((mod) => {
          const qs = mod.QUESTION_POOL.slice(0, 10);
          handleStartTest(qs, mock.timeLimitMinutes * 60);
        });
      }
    } else {
      // Launch offline mock test filters
      import("./data/questions.js").then((mod) => {
        let qs = [...mod.QUESTION_POOL];
        if (mock.id === "cat_quant_h1") {
          qs = qs.filter(q => q.category === "Algebra" || q.category === "Number Systems" || q.difficulty === "Hard");
        }
        qs = qs.slice(0, mock.questionsCount);
        handleStartTest(qs, mock.timeLimitMinutes * 60);
      });
    }
  };

  const handleClearHistory = () => {
    setConfirmModal({
      title: "Reset All Records",
      message: "Are you sure you want to completely reset all your mock records? This will clear all statistics and logs.",
      confirmText: "Yes, Reset All",
      cancelText: "Cancel",
      isDanger: true,
      onConfirm: () => {
        setAttempts([]);
        try {
          localStorage.setItem("quant_rush_attempts", JSON.stringify([]));
        } catch (e) {
          console.warn("Could not clear local attempts storage:", e);
        }
        setConfirmModal(null);
      }
    });
  };

  const handleRestoreSamples = () => {
    setConfirmModal({
      title: "Restore Sample Data",
      message: "Restore sample mock data scores to repopulate active analytics dashboards?",
      confirmText: "Yes, Repopulate",
      cancelText: "Cancel",
      isDanger: false,
      onConfirm: () => {
        setAttempts(PRE_POPULATED_MOCKS);
        try {
          localStorage.setItem("quant_rush_attempts", JSON.stringify(PRE_POPULATED_MOCKS));
        } catch (e) {
          console.warn("Could not write attempts to local storage:", e);
        }
        setConfirmModal(null);
      }
    });
  };

  if (loadingApp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 font-sans">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin mx-auto text-indigo-600" />
          <p className="text-xs uppercase font-bold tracking-widest text-slate-400">Loading KDs Student Portal...</p>
        </div>
      </div>
    );
  }

  // FORCE LOGIN: Fulfills: "first create this type of UI, like login, user login info save"
  if (!loggedInUser) {
    return <KDsLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      
      {/* Top announcement bar */}
      {currentView !== "TEST" && (
        <div className="bg-sky-900 text-white text-[11px] font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 flex-wrap">
          <span className="bg-amber-400 text-gray-900 text-[9px] font-black rounded px-1.5 uppercase shrink-0">EXCLUSIVE</span>
          <span>
            Logged in as <strong className="text-amber-300 font-mono">{loggedInUser.identifier}</strong> ·{" "}
            <button onClick={handleLogOut} className="underline text-amber-300 hover:text-amber-200 cursor-pointer">
              Logout
            </button>
          </span>
        </div>
      )}

      {/* Cracku-style Navigation Bar */}
      {currentView !== "TEST" && (
        <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between h-14">

              {/* Logo */}
              <button
                onClick={() => setCurrentView("DASHBOARD")}
                className="flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span className="text-xl font-black text-gray-900 tracking-tight">kd</span>
                <span className="text-xl font-black text-blue-600">s</span>
                <GraduationCap className="w-5 h-5 text-blue-500 fill-blue-100" />
              </button>

              {/* Nav items — hidden on small screens */}
              <div className="hidden lg:flex items-center gap-1">
                {NAV_ITEMS.map((item) => (
                  <NavDropdown
                    key={item.label}
                    item={item}
                    currentView={currentView}
                    onNavigate={setCurrentView}
                  />
                ))}
              </div>

              {/* Right side — user + offer */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView("COURSES")}
                  className="hidden sm:flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-gray-900 px-3 py-1.5 rounded text-xs font-black uppercase tracking-wide transition-colors cursor-pointer"
                >
                  🎁 Upto 70% Off
                </button>

                <button className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
                  <Bell className="w-4.5 h-4.5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* User avatar + name */}
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black uppercase shrink-0">
                    {loggedInUser.identifier.slice(0, 1)}
                  </div>
                  <span className="hidden sm:block text-xs font-bold text-gray-700 truncate max-w-[120px]">
                    {loggedInUser.identifier}
                  </span>
                  <button
                    onClick={handleLogOut}
                    title="Logout"
                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer ml-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Core View Routing mapped directly to functional buttons */}
      <div className="flex-1">
        {currentView === "DASHBOARD" && (
          <Dashboard
            attempts={attempts}
            onStartNewMock={() => setCurrentView("SECTIONALS")}
            onClearHistory={handleClearHistory}
            onRestoreSamples={handleRestoreSamples}
          />
        )}

        {currentView === "MOCKS" && (
          <MocksCatalog
            onStartMockTest={handleStartMockTest}
          />
        )}

        {currentView === "SECTIONALS" && (
          <TestSetup
            onStartTest={handleStartTest}
          />
        )}

        {currentView === "PAST_PAPERS" && (
          <PastPapers />
        )}

        {currentView === "LEARN" && (
          <LearnBook />
        )}

        {currentView === "PRACTICE" && (
          <PracticeZone />
        )}

        {currentView === "COURSES" && (
          <CoursesCatalog userEmail={loggedInUser.identifier} />
        )}

        {currentView === "TEST" && (
          <TestEngine
            questions={activeQuestions}
            timeLimitSeconds={activeTimeLimit}
            onSubmitTest={saveAttempt}
            onCancelTest={() => {
              setConfirmModal({
                title: "Cancel & Discard Exam",
                message: "Are you sure you want to cancel and discard this active quantitative mock exam? All progress will be permanently lost.",
                confirmText: "Discard Exam",
                cancelText: "Keep Testing",
                isDanger: true,
                onConfirm: () => {
                  setCurrentView("DASHBOARD");
                  setConfirmModal(null);
                }
              });
            }}
          />
        )}
      </div>

      {/* Footer */}
      {currentView !== "TEST" && (
        <footer className="bg-gray-900 border-t border-gray-800 py-6 mt-12 text-gray-400 text-xs">
          <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-white font-black text-base">kds</span>
              <GraduationCap className="w-4 h-4 text-blue-400" />
              <span>© 2026 KDs India Ltd. All rights reserved.</span>
            </div>
            <div className="flex gap-4 text-gray-500">
              <span onClick={() => setCurrentView("LEARN")} className="hover:text-amber-400 cursor-pointer transition-colors">Formulas Book</span>
              <span>•</span>
              <span onClick={() => setCurrentView("PAST_PAPERS")} className="hover:text-amber-400 cursor-pointer transition-colors">Past Papers</span>
              <span>•</span>
              <span onClick={() => setCurrentView("COURSES")} className="hover:text-amber-400 cursor-pointer font-bold text-amber-400 transition-colors">Use Coupon KD70</span>
            </div>
          </div>
        </footer>
      )}

      {/* Premium custom state-driven confirmation modal dialog */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none animate-fadeIn">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setConfirmModal(null)} 
          />
          
          {/* Modal Content Box */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 max-w-sm w-full mx-auto relative z-10 scale-in-center animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-full shrink-0 ${confirmModal.isDanger ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900">
                  {confirmModal.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  {confirmModal.message}
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-6">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-[11px] font-extrabold uppercase tracking-wide rounded-xl cursor-pointer transition-all"
              >
                {confirmModal.cancelText || "Cancel"}
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`px-4 py-2 text-white text-[11px] font-extrabold uppercase tracking-wide rounded-xl cursor-pointer transition-all active:scale-95 shadow-xs ${
                  confirmModal.isDanger 
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/10' 
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/10'
                }`}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
