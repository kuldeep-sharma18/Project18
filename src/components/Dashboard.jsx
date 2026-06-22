import { useState } from "react";
import { TrendingUp, Award, CheckCircle2, XCircle, AlertCircle, Clock, BookOpen, ChevronRight, RotateCcw, HelpCircle } from "lucide-react";

// Pre-defined high-fidelity mock scores to make the initial dashboard experience gorgeous
// export const PRE_POPULATED_MOCKS = [
//   {
//     id: "mock_1",
//     date: "Jun 02, 10:15 AM",
//     totalQuestions: 10,
//     unansweredCount: 1,
//     correctCount: 6,
//     incorrectCount: 3,
//     score: 15, // 6*3 - 3*1 = 15
//     maxScore: 30,
//     accuracy: 66.6,
//     timeTakenSeconds: 712,
//     timeLimitSeconds: 900,
//     categoryPerformance: {
//       "Arithmetic": { total: 4, correct: 3 },
//       "Algebra": { total: 2, correct: 1 },
//       "Geometry": { total: 2, correct: 1 },
//       "Number Systems": { total: 2, correct: 1 }
//     },
//     answers: [],
//     questions: []
//   },
//   {
//     id: "mock_2",
//     date: "Jun 10, 04:30 PM",
//     totalQuestions: 10,
//     unansweredCount: 0,
//     correctCount: 7,
//     incorrectCount: 3,
//     score: 18, // 7*3 - 3 = 18
//     maxScore: 30,
//     accuracy: 70,
//     timeTakenSeconds: 618,
//     timeLimitSeconds: 900,
//     categoryPerformance: {
//       "Arithmetic": { total: 3, correct: 2 },
//       "Algebra": { total: 3, correct: 2 },
//       "Geometry": { total: 2, correct: 2 },
//       "Modern Math": { total: 2, correct: 1 }
//     },
//     answers: [],
//     questions: []
//   },
//   {
//     id: "mock_3",
//     date: "Jun 17, 11:00 AM",
//     totalQuestions: 10,
//     unansweredCount: 2,
//     correctCount: 7,
//     incorrectCount: 1,
//     score: 20, // 7*3 - 1 = 20
//     maxScore: 30,
//     accuracy: 87.5,
//     timeTakenSeconds: 580,
//     timeLimitSeconds: 900,
//     categoryPerformance: {
//       "Arithmetic": { total: 3, correct: 3 },
//       "Algebra": { total: 2, correct: 1 },
//       "Number Systems": { total: 3, correct: 2 },
//       "Modern Math": { total: 2, correct: 1 }
//     },
//     answers: [],
//     questions: []
//   }
// ];

export default function Dashboard({ attempts, onStartNewMock, onClearHistory, onRestoreSamples }) {
  // Use attempts directly to allow full and functional resetting!
  const allAttempts = attempts || [];
  const [selectedAttemptId, setSelectedAttemptId] = useState("");
  const [activeTab, setActiveTab] = useState("analytics");

  // Get active selected attempt
  const activeAttemptId = selectedAttemptId || (allAttempts.length > 0 ? allAttempts[allAttempts.length - 1].id : "");
  const activeAttempt = allAttempts.find((a) => a.id === activeAttemptId) || allAttempts[allAttempts.length - 1];

  // Calculations for KPI Cards
  const totalTests = allAttempts.length;
  const bestScoreAttempt = [...allAttempts].sort((a, b) => b.score - a.score)[0];
  const maxScoreAchieved = bestScoreAttempt ? bestScoreAttempt.score : 0;
  
  // const avgAccuracy = allAttempts.reduce((acc, curr) => acc + curr.accuracy, 0) / (totalTests || 1);
  const totalCorrect = allAttempts.reduce((acc, curr) => acc + curr.correctCount, 0);
  const totalAnswered = allAttempts.reduce((acc, curr) => acc + (curr.correctCount + curr.incorrectCount), 0);
  const globalAccuracy = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;

  // Average Score Calculation
  const avgScore = allAttempts.reduce((acc, curr) => acc + curr.score, 0) / (totalTests || 1);

  // Percentile Estimation (simple simulated lookup)
  const calculatePercentile = (avgSc) => {
    if (avgSc >= 25) return "99.2 %ile";
    if (avgSc >= 20) return "95.8 %ile";
    if (avgSc >= 15) return "88.1 %ile";
    if (avgSc >= 10) return "74.5 %ile";
    return "52.0 %ile";
  };

  // Compile Topic Strengths
  const topicStats = {};
  allAttempts.forEach((attempt) => {
    if (attempt.categoryPerformance) {
      Object.entries(attempt.categoryPerformance).forEach(([cat, data]) => {
        if (!topicStats[cat]) {
          topicStats[cat] = { total: 0, correct: 0 };
        }
        topicStats[cat].total += data.total;
        topicStats[cat].correct += data.correct;
      });
    }
  });

  const topicStrengths = Object.entries(topicStats).map(([name, data]) => ({
    name,
    total: data.total,
    correct: data.correct,
    accuracy: data.total > 0 ? (data.correct / data.total) * 100 : 0,
  })).sort((a, b) => b.accuracy - a.accuracy);

  // Compute values for Chronological SVG score line chart
  const highestActualScore = Math.max(...allAttempts.map(a => a.score), 10);
  const chartHeightRange = Math.max(highestActualScore + 5, 30);

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6 font-sans bg-gray-50 min-h-screen">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-lg">
        <div>
          <h1 className="text-xl font-black tracking-tight">Welcome back! 👋</h1>
          <p className="text-blue-200 text-sm mt-1">
            Track your performance, attempt mocks, and climb the percentile ladder.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={onClearHistory}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-blue-400 text-blue-100 hover:bg-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
          <button
            onClick={onStartNewMock}
            className="bg-white text-blue-700 hover:bg-blue-50 px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            New Mock
          </button>
        </div>
      </div>

      {/* KPI Performance Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total tests */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Mocks Taken</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{totalTests}</p>
          </div>
        </div>

        {/* Global accuracy */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-xl">
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Avg Accuracy</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{globalAccuracy.toFixed(1)}%</p>
          </div>
        </div>

        {/* High Score */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-xl">
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Highest Score</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">+{maxScoreAchieved}</p>
          </div>
        </div>

        {/* Estimated Percentile based on score */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl">
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Est. Percentile</p>
            <p className="text-2xl font-black text-blue-600 mt-0.5 font-mono">
              {calculatePercentile(avgScore)}
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Sub-Tabs */}
      {allAttempts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-5 max-w-xl mx-auto shadow-sm my-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-3xl border border-blue-100">
            📊
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-black text-gray-800">No Test Records Yet</h2>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              Your mock session logs are empty. Start a live sectional test or load demo records to explore your analytics dashboard.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <button
              onClick={onRestoreSamples}
              className="px-5 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-black rounded-xl cursor-pointer uppercase tracking-wider transition-all"
            >
              🔄 Load Demo Records
            </button>
            <button
              onClick={onStartNewMock}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl cursor-pointer uppercase tracking-wider shadow-md transition-all"
            >
              ⚡ Start Live Sectional
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="border-b border-gray-200 flex flex-wrap gap-2 pt-2">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 cursor-pointer ${
            activeTab === "analytics"
              ? "border-blue-600 text-blue-600 font-extrabold"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Analytics
        </button>

        <button
          onClick={() => setActiveTab("review")}
          disabled={!activeAttempt || !activeAttempt.answers || activeAttempt.answers.length === 0}
          className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 cursor-pointer disabled:opacity-35 disabled:cursor-not-allowed ${
            activeTab === "review"
              ? "border-blue-600 text-blue-600 font-extrabold"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Test Review
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`pb-2.5 px-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 cursor-pointer ${
            activeTab === "history"
              ? "border-blue-600 text-blue-600 font-extrabold"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          Exam History
        </button>
      </div>

      {/* Sub-tab view: Dynamic Analytics */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chronological Score Trend Graph (2 Columns) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-gray-800">Score Trend</h3>
                <p className="text-xs text-gray-400">Your score trajectory across all mock exams.</p>
              </div>
              <span className="text-[11px] font-mono bg-gray-100 text-gray-600 px-2.5 py-1 rounded font-bold">
                Max: 30-60 pts
              </span>
            </div>

            {/* Hand-coded interactive SVG Line Chart */}
            <div className="w-full h-64 relative bg-gray-50 border border-gray-100 rounded-xl p-2 overflow-hidden flex flex-col justify-between">
              
              <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                {/* Horizontal grid lines */}
                {[0, 50, 100, 150].map((y, idx) => (
                  <line
                    key={idx}
                    x1="40"
                    y1={y + 20}
                    x2="480"
                    y2={y + 20}
                    stroke="#E5E7EB"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Score path lines */}
                {allAttempts.length > 1 && (
                  <path
                    d={allAttempts.map((attempt, idx) => {
                      const stepX = 40 + (idx * 440) / (allAttempts.length - 1);
                      const valY = 170 - (attempt.score / chartHeightRange) * 150;
                      return `${idx === 0 ? 'M' : 'L'} ${stepY(stepX)} ${stepY(valY)}`;

                      function stepY(v) {
                        return isNaN(v) ? 0 : Math.round(v);
                      }
                    }).join(' ')}
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Plot points */}
                {allAttempts.map((attempt, idx) => {
                  const x = 40 + (idx * 440) / (Math.max(1, allAttempts.length - 1));
                  const y = 170 - (attempt.score / chartHeightRange) * 150;

                  return (
                    <g key={attempt.id} className="group cursor-pointer">
                      <circle
                        cx={x}
                        cy={y}
                        r="6"
                        fill="#2563EB"
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                        className="transition-all hover:scale-130"
                      />
                      <text
                        x={x}
                        y={y - 12}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fill="#1e40af"
                        className="opacity-90 font-mono"
                      >
                        +{attempt.score}
                      </text>
                    </g>
                  );
                })}

                {/* X Axis text timestamps */}
                {allAttempts.map((attempt, idx) => {
                  const x = 40 + (idx * 440) / (Math.max(1, allAttempts.length - 1));
                  const labelParts = attempt.date.split(",");
                  return (
                    <text
                      key={idx}
                      x={x}
                      y="188"
                      textAnchor="middle"
                      fontSize="8"
                      className="fill-slate-400 font-mono font-medium"
                    >
                      {labelParts[0]}
                    </text>
                  );
                })}
              </svg>
            </div>

            <div className="flex gap-4 items-center justify-center text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                Actual Mock Score
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-200" />
                Benchmark Threshold
              </span>
            </div>
          </div>

          {/* Syllabus Topic Accuracies (1 Column) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-extrabold text-gray-800">Syllabus Breakdown</h3>
              <p className="text-xs text-gray-400">Accuracy by topic.</p>
            </div>

            {topicStrengths.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-4">
                <HelpCircle className="w-8 h-8 text-slate-300 stroke-1 mb-2" />
                <span className="text-xs text-slate-400">Complete more tests to populate strength curves.</span>
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                {topicStrengths.map((str) => {
                  let progressColor = "bg-blue-600";
                  let textColor = "text-blue-600";
                  let ratingText = "Moderate";
                  if (str.accuracy >= 80) {
                    progressColor = "bg-green-500";
                    textColor = "text-green-600";
                    ratingText = "Excellent";
                  } else if (str.accuracy < 50) {
                    progressColor = "bg-red-500";
                    textColor = "text-red-600";
                    ratingText = "Needs Work";
                  }

                  return (
                    <div key={str.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">{str.name}</span>
                        <div className="flex gap-1 items-center">
                          <span className={`${textColor} font-bold`}>{str.accuracy.toFixed(0)}%</span>
                          <span className="text-[10px] text-slate-400 font-mono">({str.correct}/{str.total})</span>
                        </div>
                      </div>

                      {/* Custom bar */}
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                          style={{ width: `${str.accuracy}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                        <span>Confidence: {ratingText}</span>
                        <span>Avg time: 48s/Q</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Speed vs Accuracy Bubble Plot */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-800">Tempo vs Accuracy Correlations</h3>
              <p className="text-xs text-slate-400">Compare individual sections to pinpoint speed bottle-necks (aim for high accuracy, moderate-fast tempo).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/60 text-slate-700 space-y-1">
                <span className="text-xs font-bold uppercase text-amber-600 tracking-wider">Fast / High Error</span>
                <p className="text-sm font-semibold text-slate-800">Number Systems</p>
                <p className="text-xs text-slate-500">Averages 35s per response, but accuracy stays at 55%. Slow down and cross-check calculations.</p>
              </div>
              <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/50 text-slate-700 space-y-1">
                <span className="text-xs font-bold uppercase text-emerald-600 tracking-wider">Optimal Pace</span>
                <p className="text-sm font-semibold text-slate-800">Arithmetic</p>
                <p className="text-xs text-slate-500">Averages 48s per response, pulling 85% accuracy. Great pacing, maintain this exact operational strategy.</p>
              </div>
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50 text-slate-750 space-y-1">
                <span className="text-xs font-bold uppercase text-indigo-600 tracking-wider">Slow / Over-indexed</span>
                <p className="text-sm font-semibold text-indigo-950">Algebra & Geometry</p>
                <p className="text-xs text-slate-500">Takes 112s per question. Concepts require extensive sketching. Practice algebraic shortcuts to shave off minutes.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab view: Test Review details */}
      {activeTab === "review" && activeAttempt && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Left panel: Quick indicators & lists */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Attempt Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1.5 text-center">
                Review Target stats
              </h3>

              <div className="text-center py-2">
                <p className="text-sm text-slate-500 font-semibold">{activeAttempt.date}</p>
                <p className="text-3xl font-black text-indigo-600 mt-1">+{activeAttempt.score} pts</p>
                <p className="text-xs text-slate-400 font-mono mt-1">accuracy: {activeAttempt.accuracy.toFixed(1)}%</p>
              </div>

              <div className="`h-[1px]` bg-slate-100" />

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                  <span className="block font-bold text-emerald-700">{activeAttempt.correctCount}</span>
                  <span className="text-[10px] text-emerald-600 font-medium">Right</span>
                </div>
                <div className="bg-rose-50 p-2 rounded-xl border border-rose-100">
                  <span className="block font-bold text-rose-700">{activeAttempt.incorrectCount}</span>
                  <span className="text-[10px] text-rose-600 font-medium">Wrong</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                  <span className="block font-bold text-slate-700">{activeAttempt.unansweredCount}</span>
                  <span className="text-[10px] text-slate-500 font-medium font-sans">Skipped</span>
                </div>
              </div>
            </div>

            {/* Test attempts list selector */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-2">
                Select Active Mock to Review
              </h4>
              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {allAttempts.map((att) => {
                  const hasReviewData = att.answers && att.answers.length > 0;
                  return (
                    <button
                      key={att.id}
                      onClick={() => {
                        if (hasReviewData) setSelectedAttemptId(att.id);
                      }}
                      disabled={!hasReviewData}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs flex justify-between items-center transition-all cursor-pointer disabled:opacity-40 ${
                        selectedAttemptId === att.id
                          ? "bg-indigo-600 text-white font-bold"
                          : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      <div className="truncate">
                        <span className="block font-bold truncate">{att.date}</span>
                        <span className="text-[10px] font-mono font-medium opacity-90">Score: +{att.score}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right panel: Questions with step-by-step solutions (3 Columns) */}
          <div className="lg:col-span-3 space-y-6">
            
            <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-950 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white">Full Explanations & Solution Keys</h3>
                <p className="text-xs text-slate-400 font-sans">Read mathematical methodologies to learn core quantitative theorems.</p>
              </div>
              <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold px-2.5 py-1 rounded-lg">
                Questions: {activeAttempt.questions?.length || 0}
              </span>
            </div>

            {activeAttempt.questions && activeAttempt.questions.length > 0 ? (
              <div className="space-y-5">
                {activeAttempt.questions.map((q, qIdx) => {
                  const candidateAnsObj = activeAttempt.answers?.find((a) => a.questionId === q.id);
                  const selectedIdx = candidateAnsObj ? candidateAnsObj.selectedOptionIndex : null;
                  const isCorrect = selectedIdx === q.correctOptionIndex;
                  const isUnanswered = selectedIdx === null;

                  let cardBorder;
                  let statusBanner;
                  if (isCorrect) {
                     cardBorder = "border-emerald-200 bg-emerald-50/10";
                     statusBanner = (
                      <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-pulse" />
                        <span>Correct Response (+3 marks)</span>
                      </div>
                    );
                  } else if (isUnanswered) {
                    cardBorder = "border-slate-200 bg-slate-50/10";
                    statusBanner = (
                      <div className="bg-slate-50 text-slate-600 border border-slate-200 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold">
                        <AlertCircle className="w-4 h-4 text-slate-500" />
                        <span>Question Skipped (0 marks)</span>
                      </div>
                    );
                  } else {
                    cardBorder = "border-rose-200 bg-rose-50/5";
                    statusBanner = (
                      <div className="bg-rose-50 text-rose-700 border border-rose-100 px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Incorrect Response (-1 mark penalty)</span>
                      </div>
                    );
                  }

                  return (
                    <div key={q.id} className={`bg-white rounded-2xl border p-5 md:p-6 space-y-4 shadow-sm ${cardBorder}`}>
                      
                      {/* Top attributes rows */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold font-mono text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                            Q {qIdx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-lg capitalize">
                            {q.category}
                          </span>
                          <span className={`text-[10px] font-bold border px-1.5 py-0.5 rounded-lg uppercase ${
                            q.difficulty === "Easy"
                              ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                              : q.difficulty === "Medium"
                              ? "bg-amber-50 border-amber-150 text-amber-600"
                              : "bg-rose-50 border-rose-100 text-rose-650 text-rose-600"
                          }`}>
                            {q.difficulty}
                          </span>
                        </div>

                        {/* Question time metrics */}
                        {candidateAnsObj && (
                          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium font-sans">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Your time spent on this Q:</span>
                            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg font-mono">
                              {Math.floor(candidateAnsObj.timeSpentSeconds / 60)}m {candidateAnsObj.timeSpentSeconds % 60}s
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Question Text */}
                      <div className="text-slate-800 font-extrabold leading-relaxed text-sm font-sans">
                        {q.questionText}
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                        {q.options.map((opt, oIdx) => {
                          const wasSelected = selectedIdx === oIdx;
                          const isTheCorrect = q.correctOptionIndex === oIdx;

                          let outerStyle = "border-slate-200 text-slate-700 hover:bg-slate-50";
                          let checkDot = null;

                          if (isTheCorrect) {
                            outerStyle = "border-emerald-500 bg-emerald-50/50 text-emerald-800 font-bold";
                            checkDot = <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500 text-white font-sans uppercase">Correct Match</span>;
                          } else if (wasSelected) {
                            outerStyle = "border-rose-500 bg-rose-50/50 text-rose-800 font-bold";
                            checkDot = <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500 text-white font-sans uppercase">Your Pick</span>;
                          }

                          return (
                            <div
                              key={oIdx}
                              className={`p-3.5 rounded-xl border text-xs flex justify-between items-center transition-all ${outerStyle}`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono font-bold shrink-0 ${
                                  isTheCorrect
                                    ? "bg-emerald-500 border-emerald-600 text-white"
                                    : wasSelected
                                    ? "bg-rose-500 border-rose-600 text-white"
                                    : "bg-slate-50 border-slate-200 text-slate-500"
                                }`}>
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span className="font-semibold">{opt}</span>
                              </div>
                              {checkDot}
                            </div>
                          );
                        })}
                      </div>

                      {/* Review feedback row */}
                      <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
                        {statusBanner}
                      </div>

                      {/* Step-by-Step Explanation Banner */}
                      <div className="bg-slate-50 rounded-2xl border border-slate-200/70 p-5 space-y-2.5 mt-4">
                        <span className="text-xs font-black text-indigo-650 uppercase tracking-widest block border-b border-slate-200/50 pb-1.5 font-sans">
                          Methodology & Detailed Solution:
                        </span>
                        <div className="text-xs text-slate-600 leading-relaxed font-sans whitespace-pre-wrap">
                          {q.explanation}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
                <HelpCircle className="w-10 h-10 mx-auto text-slate-300 mb-2 stroke-1" />
                <p>No query data exists for this mock test attempt.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub-tab view: Comprehensive Exam logs */}
      {activeTab === "history" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-900 p-5 text-white flex justify-between items-center border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Full Performance Archives</h3>
              <p className="text-xs text-slate-400 font-sans">Chronological history registry tracking accuracy ratios and net scores.</p>
            </div>
            <span className="text-xs font-mono text-slate-400 uppercase">
              Registered logs: {allAttempts.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-widest text-[10px] select-none">
                  <th className="py-3.5 px-5">Attempt Date</th>
                  <th className="py-3.5 px-5">Total Questions</th>
                  <th className="py-3.5 px-5">Accuracy %</th>
                  <th className="py-3.5 px-5">Right / Wrong / Skipped</th>
                  <th className="py-3.5 px-5 text-right">Net Score Achieving</th>
                  <th className="py-3.5 px-5 text-right">Interactive Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {allAttempts.map((att) => {
                  const recordHasData = att.answers && att.answers.length > 0;
                  return (
                    <tr key={att.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-5 font-bold text-slate-900">{att.date}</td>
                      <td className="py-4 px-5 font-mono text-slate-500">{att.totalQuestions} Qs</td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                           <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="bg-indigo-650 h-full" style={{ width: `${att.accuracy}%` }} />
                          </div>
                          <span className="font-extrabold text-slate-800">{att.accuracy.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-slate-500">
                        <span className="text-emerald-600 font-bold">{att.correctCount}</span>
                        {" / "}
                        <span className="text-rose-600 font-bold">{att.incorrectCount}</span>
                        {" / "}
                        <span className="text-slate-400">{att.unansweredCount}</span>
                      </td>
                      <td className="py-4 px-5 text-right font-black text-slate-900">
                        <div className="inline-flex items-center bg-slate-100 text-slate-800 px-3 py-1 rounded-xl font-mono text-[11px] font-bold">
                          +{att.score} / {att.maxScore}
                        </div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        {recordHasData ? (
                          <button
                            onClick={() => {
                              setSelectedAttemptId(att.id);
                              setActiveTab("review");
                            }}
                            className="bg-indigo-600 text-white font-extrabold hover:bg-indigo-700 px-3 py-1.5 rounded-xl text-[11px] uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                          >
                            Analyze Solutions
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-sans">Preset Historical Mock</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
        </>
      )}

    </div>
  );
}
