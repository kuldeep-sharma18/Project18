import { useState } from "react";
import { Play, ClipboardCheck, Clock, Award, ShieldAlert } from "lucide-react";
import { QUESTION_POOL } from "../data/questions.js";

export default function TestSetup({ onStartTest }) {
  const [numQuestions, setNumQuestions] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [timerFormat, setTimerFormat] = useState(15); // minutes

  // Get unique categories from pool
  const categories = ["All", ...Array.from(new Set(QUESTION_POOL.map(q => q.category)))];
  const difficulties = ["All", "Easy", "Medium", "Hard"];

  const handleStart = () => {
    // Filter questions based on criteria
    let filtered = [...QUESTION_POOL];
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }
    
    if (selectedDifficulty !== "All") {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }

    // shuffle
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    
    // slice down to requested amount
    const selectedQuestions = shuffled.slice(0, Math.min(numQuestions, shuffled.length));

    if (selectedQuestions.length === 0) {
      alert("No questions matches your selected filters. Please adjust your criteria!");
      return;
    }

    const timeInSeconds = timerFormat * 60;
    onStartTest(selectedQuestions, timeInSeconds);
  };

  return (
    <div id="test_setup_container" className="max-w-4xl mx-auto py-6 px-4 font-sans">
      {/* Hero Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-100 inline-block">
          Quant Rush Prep
        </span>
        <h1 className="text-3xl font-extrabold font-sans text-slate-900 tracking-tight mt-4">
          Configure Your Quantitative Aptitude Mock
        </h1>
        <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
          Challenge yourself under strict timed conditions mimicking top business school math admissions and engineering recruitment tests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Left 2 cols: Setup parameters */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div className="space-y-5">
            <h2 className="text-md font-bold text-slate-800 border-b border-slate-100 pb-2">
              Parameters
            </h2>

            {/* Questions count */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5">
                Number of Questions
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setNumQuestions(num);
                      // Set an active default timer proportional to questions count (1.5 min per q)
                      setTimerFormat(Math.max(5, Math.round(num * 1.5)));
                    }}
                    className={`py-2.5 px-3 text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                      numQuestions === num
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>
            </div>

            {/* Category / Topic */}
            <div>
              <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                Syllabus Topic
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-sm p-3 bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-slate-300 focus:outline-hidden focus:border-indigo-500 capitalize cursor-pointer transition-colors"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "All" ? "All Quantitative Subtopics" : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty & Time Limit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                  Target Difficulty
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full text-sm p-3 bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-slate-300 focus:outline-hidden focus:border-indigo-500 cursor-pointer transition-colors"
                >
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff === "All" ? "Mixed Difficulty" : `${diff} Mode`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                  Time Allocation
                </label>
                <select
                  value={timerFormat}
                  onChange={(e) => setTimerFormat(Number(e.target.value))}
                  className="w-full text-sm p-3 bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-slate-300 focus:outline-hidden focus:border-indigo-500 cursor-pointer transition-colors"
                >
                  {[5, 10, 15, 20, 30, 45].map((mins) => (
                    <option key={mins} value={mins}>
                      {mins} Minutes ({mins * 60} seconds)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={handleStart}
              className="w-full bg-blue-600 hover:bg-blue-700 active:translate-y-0.5 text-white py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all text-xs uppercase tracking-wider"
            >
              <Play className="w-4 h-4 fill-white" />
              Begin Quant Rush Mock
            </button>
          </div>
        </div>

        {/* Right 1 col: Exam rules card */}
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-md font-bold text-white border-b border-slate-800 pb-2">
              Official Instructions
            </h2>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-slate-800 text-indigo-400 shrink-0">
                  <Award className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-slate-100">Competitive Marking Scheme</p>
                  <p className="mt-0.5 text-slate-400 leading-relaxed text-[11px]">Gets +3 marks for every correct choice. Earns a penalty of -1 mark for every incorrect choice. Unanswered questions trigger solid 0 marks.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-slate-800 text-indigo-400 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-slate-100">Strict Live Countdown</p>
                  <p className="mt-0.5 text-slate-400 leading-relaxed text-[11px]">The exam automatically auto-submits once the countdown clock ticks to 00:00. Time per question will be computed.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-slate-800 text-indigo-400 shrink-0">
                  <ClipboardCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-slate-100">Permitted Scientific Aids</p>
                  <p className="mt-0.5 text-slate-400 leading-relaxed text-[11px]">A pop-up standard non-programmable on-screen calculator is provided. Hardware calculators are prohibited.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-slate-800 text-rose-400 shrink-0">
                  <ShieldAlert className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-bold text-slate-100">No Tab Switching</p>
                  <p className="mt-0.5 text-slate-400 leading-relaxed text-[11px]">Remain on the browser interface to avoid session suspension. Focus and keep high math accuracy!</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-800/80 mt-6 md:mt-0 font-mono">
            <span className="text-[10px] tracking-widest text-slate-400 uppercase">
              Current Database pool: {QUESTION_POOL.length} Questions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
