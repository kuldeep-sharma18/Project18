import { BookOpen, Clock, Lock, Sparkles } from "lucide-react";

export default function MocksCatalog({ onStartMockTest }) {

  const mockExams = [
    {
      id: "cat_free_l1",
      title: "KDs Comprehensive CAT National Mock Test",
      description: "Full length mixed quantitative exam. Tests speed and formula revision.",
      questionsCount: 10,
      timeLimitMinutes: 15,
      isPremium: false,
      difficulty: "Mixed",
      category: "All Syllabus"
    },
    {
      id: "cat_quant_h1",
      title: "IIM Ahmedabad Quant Special Practice Round",
      description: "Focuses on advanced algebraic inequalities and logarithmic functions.",
      questionsCount: 15,
      timeLimitMinutes: 20,
      isPremium: false,
      difficulty: "Hard",
      category: "Algebra & Number Systems"
    },
    {
      id: "api_mock_test_1",
      title: "LIVE API-Driven Quantitative Rush 2026",
      description: "Dynamically retrieves active syllabus questions from the Express/Node API backend in real-time.",
      questionsCount: 11,
      timeLimitMinutes: 16,
      isPremium: false,
      difficulty: "Medium",
      category: "Pure Quant (API Endpoint)"
    },
    {
      id: "cat_premium_p1",
      title: "Pre-CAT Premium Mock Test #17",
      description: "Exact replica of previous slot timings. Includes video explanations.",
      questionsCount: 20,
      timeLimitMinutes: 30,
      isPremium: true,
      difficulty: "Hard",
      category: "All Topics"
    },
    {
      id: "xat_decision_d1",
      title: "XAT Quantitative Competency Sectional",
      description: "Includes permutation, combination and 3D surface geometries.",
      questionsCount: 15,
      timeLimitMinutes: 25,
      isPremium: true,
      difficulty: "Hard",
      category: "Modern Math & Geometry"
    }
  ];

  const handleLaunch = (mock) => {
    if (mock.isPremium) {
      alert("This is a Premium Locked Mock Test! Go to the 'Courses' screen to unlock CAT preparation assets.");
      return;
    }
    onStartMockTest(mock);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-6 rounded-2xl text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-blue-600 shadow-lg">
        <div>
          <span className="bg-amber-400 text-gray-900 text-[10px] uppercase font-mono font-extrabold px-2.5 py-1 rounded-full">CAT 2026 Series</span>
          <h1 className="text-xl font-bold mt-2 text-white">KDs National Free Mock Tests</h1>
          <p className="text-xs text-blue-200 mt-1">Practice with our national-percentile benchmark series to gauge where you stand.</p>
        </div>
        <div className="bg-white/10 p-3 rounded-xl border border-white/15 text-xs text-amber-300 font-bold shrink-0 font-mono">
          🚀 Next Live Mock Starts in: 4h 12m
        </div>
      </div>

      {/* Grid wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockExams.map((mock) => (
          <div
            key={mock.id}
            className={`bg-white rounded-2xl border p-5 flex flex-col justify-between shadow-sm transition-all hover:shadow-md hover:border-gray-300 ${
              mock.isPremium ? "border-amber-100 bg-amber-50/20" : "border-gray-200"
            }`}
          >
            <div className="space-y-3.5">
              
              {/* Badge row */}
              <div className="flex justify-between items-center">
                <span className={`text-[9px] font-mono font-extrabold uppercase px-2.5 py-0.5 rounded-lg border ${
                  mock.isPremium
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-indigo-50 text-indigo-700 border-indigo-200"
                }`}>
                  {mock.category}
                </span>

                <span className={`text-[9px] font-bold ${
                  mock.difficulty === "Hard" ? "text-rose-600" : mock.difficulty === "Easy" ? "text-emerald-600" : "text-amber-500"
                }`}>
                  {mock.difficulty} Level
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                  {mock.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed `min-h-[36px]`">
                  {mock.description}
                </p>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100/85 text-[11px] font-semibold text-slate-600">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{mock.questionsCount} Questions</span>
                </div>
                <div className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{mock.timeLimitMinutes} Mins</span>
                </div>
              </div>

            </div>

            {/* Launch CTA */}
            <div className="border-t border-slate-100 pt-4 mt-5 flex items-center justify-between">
              {mock.isPremium ? (
                <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Premium Account Lock</span>
                </div>
              ) : mock.id === "api_mock_test_1" ? (
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Real-time API Connection</span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-400 font-mono">Free Open Syllabus</span>
              )}

              <button
                onClick={() => handleLaunch(mock)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider cursor-pointer shadow-xs ${
                  mock.isPremium
                    ? "bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100"
                    : mock.id === "api_mock_test_1"
                    ? "bg-green-600 hover:bg-green-700 text-white font-black"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {mock.isPremium ? "Unlock" : mock.id === "api_mock_test_1" ? "Fetch & Solve" : "Begin Mock"}
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Proctored rules box */}
      <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4.5">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Proctored Guidelines</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            All KDs full tests run onto our sandboxed test controller. Please remain centered on the page and utilize the standard scratchpad calculator.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] font-bold bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-750">No negative marks for unanswered questions</span>
          <span className="text-[10px] font-bold bg-indigo-950/40 text-indigo-300 px-3 py-1.5 rounded-lg border border-indigo-900/30 font-mono">Marking: +3 / -1</span>
        </div>
      </div>

    </div>
  );
}
