import { useState, useEffect, useRef, useCallback } from "react";
import { Clock, Calculator, AlertTriangle, ChevronLeft, ChevronRight, Bookmark } from "lucide-react";
import OnScreenCalculator from "./OnScreenCalculator.jsx";

export default function TestEngine({ questions, timeLimitSeconds, onSubmitTest, onCancelTest }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(() => {
    const initial = {};
    questions.forEach((q) => {
      initial[q.id] = { selectedOption: null, isBookmarked: false };
    });
    return initial;
  });

  // Track time spent per question in seconds
  const [timeSpent, setTimeSpent] = useState(() => {
    const initial = {};
    questions.forEach((q) => {
      initial[q.id] = 0;
    });
    return initial;
  });

  // Main countdown timer state
  const [timeLeft, setTimeLeft] = useState(timeLimitSeconds);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

const activeQuestion = questions[currentIndex];
  const timerRef = useRef(null);

  

  // Auto-submit function - memoized to avoid changing on every render
  const handleAutoSubmit = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    const candidateAnswers = questions.map((q) => ({
      questionId: q.id,
      selectedOptionIndex: userAnswers[q.id].selectedOption,
      timeSpentSeconds: timeSpent[q.id] || 0,
      isBookmarked: userAnswers[q.id].isBookmarked,
    }));

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const categoryPerformance = {};

    questions.forEach((q) => {
      const selected = userAnswers[q.id].selectedOption;

      // Category total increments
      if (!categoryPerformance[q.category]) {
        categoryPerformance[q.category] = { total: 0, correct: 0 };
      }
      categoryPerformance[q.category].total += 1;

      if (selected === null) {
        unansweredCount += 1;
      } else if (selected === q.correctOptionIndex) {
        correctCount += 1;
        categoryPerformance[q.category].correct += 1;
      } else {
        incorrectCount += 1;
      }
    });

    // Scoring scheme: +3 correct, -1 incorrect, 0 unanswered
    const score = correctCount * 3 + incorrectCount * -1;
    const maxScore = questions.length * 3;
    const answeredCount = correctCount + incorrectCount;
    const accuracy = answeredCount > 0 ? (correctCount / answeredCount) * 100 : 0;
    const timeTakenSeconds = timeLimitSeconds - timeLeft;

    const attempt = {
      id: "attempt_" + Date.now(),
      date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      totalQuestions: questions.length,
      unansweredCount,
      correctCount,
      incorrectCount,
      score,
      maxScore,
      accuracy,
      timeTakenSeconds,
      timeLimitSeconds,
      categoryPerformance,
      answers: candidateAnswers,
      questions,
    };

    onSubmitTest(attempt);
  }, [questions, userAnswers, timeSpent, timeLeft, timeLimitSeconds, onSubmitTest]);

  // Countdown timer && Question timer
  

  // Countdown timer && Question timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      // Tick overall time down
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          // Trigger auto-submit
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });

      // Tick individual question timer up
      setTimeSpent((prev) => ({
        ...prev,
        [activeQuestion.id]: (prev[activeQuestion.id] || 0) + 1,
      }));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, activeQuestion.id, handleAutoSubmit]);

  const handleSelectOption = (optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [activeQuestion.id]: {
        ...prev[activeQuestion.id],
        selectedOption: optionIndex,
      },
    }));
  };

  const handleClearResponse = () => {
    setUserAnswers((prev) => ({
      ...prev,
      [activeQuestion.id]: {
        ...prev[activeQuestion.id],
        selectedOption: null,
      },
    }));
  };

  const handleToggleBookmark = () => {
    setUserAnswers((prev) => ({
      ...prev,
      [activeQuestion.id]: {
        ...prev[activeQuestion.id],
        isBookmarked: !prev[activeQuestion.id].isBookmarked,
      },
    }));
  };

  const handleSaveAndNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };


  // Convert seconds to format MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const totalUnanswered = questions.filter(q => userAnswers[q.id].selectedOption === null).length;

  return (
    <div id="test_engine_layout" className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      {/* Test Running Top Bar */}
      <header className="bg-gray-900 text-white py-3.5 px-6 border-b border-gray-800 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <span className="text-xs bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg text-center tracking-widest uppercase">
            KDs Live Test
          </span>
          <div className="h-4 w-px bg-gray-700" />
          <span className="text-sm font-semibold text-gray-300 hidden sm:inline">
            Active Mock Session
          </span>
        </div>

        {/* Dynamic Timer display */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
              showCalculator
                ? "bg-indigo-650 border-indigo-650 text-white shadow-xs"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Scratch Calculator</span>
          </button>

          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold text-sm transition-all shadow-inner ${
              timeLeft < 120
                ? "bg-rose-950/40 border-rose-800 text-rose-400 animate-pulse"
                : "bg-slate-800 border-slate-700 text-slate-100"
            }`}
          >
            <Clock className={`w-4 h-4 ${timeLeft < 120 ? "text-rose-400 animate-spin" : "text-slate-400"}`} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      {/* Main split dashboard panel */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* LEFT / CENTER Pane: Questions & Multi-Options (3 columns) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col `min-h-[500px]` justify-between relative">
          
          {/* Question Title Bar with attributes */}
          <div className="bg-slate-50 border-b border-slate-100 px-5 lg:px-6 py-4 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="h-3 `w-[1px]` bg-slate-200" />
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600">
                {activeQuestion.category}
              </span>
              <span className={`text-[10px] font-extrabold px-2 py-1 rounded-lg border uppercase ${
                activeQuestion.difficulty === "Easy"
                  ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                  : activeQuestion.difficulty === "Medium"
                  ? "bg-amber-50 border-amber-100 text-amber-600"
                  : "bg-rose-50 border-rose-100 text-rose-600"
              }`}>
                {activeQuestion.difficulty}
              </span>
            </div>

            {/* Time spent on this single question */}
            <div className="text-xs text-slate-400 `font-mono` flex items-center gap-1 font-sans">
              <span>Time spent here:</span>
              <span className="font-extrabold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg font-mono">
                {formatTime(timeSpent[activeQuestion.id] || 0)}
              </span>
            </div>
          </div>

          {/* Question Content View */}
          <div className="p-6 lg:p-8 space-y-6 flex-1">
            <div className="prose text-slate-800 leading-relaxed max-w-none text-base font-extrabold font-sans">
              {activeQuestion.questionText}
            </div>

            {/* Render choices elegantly */}
            <div className="space-y-3 mt-6">
              {activeQuestion.options.map((opt, oIdx) => {
                const isSelected = userAnswers[activeQuestion.id].selectedOption === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all group cursor-pointer hover:bg-slate-50 ${
                      isSelected
                        ? "bg-slate-900 border-slate-950 text-white hover:bg-slate-900"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-350"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold leading-none w-6 h-6 rounded-full flex items-center justify-center border font-mono transition-colors ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-700 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-500 group-hover:bg-slate-200"
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="text-sm font-semibold transition-colors">
                        {opt}
                      </span>
                    </div>

                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controller buttons on bottom */}
          <div className="border-t border-slate-200 bg-slate-50/50 p-4 lg:p-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-2.5 text-xs font-bold font-sans rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-slate-700 flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>

              <button
                onClick={handleClearResponse}
                disabled={userAnswers[activeQuestion.id].selectedOption === null}
                className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Clear Answer
              </button>
            </div>

            <div className="flex gap-2.5">
              <button
                onClick={handleToggleBookmark}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                  userAnswers[activeQuestion.id].isBookmarked
                    ? "bg-indigo-50/80 text-indigo-650 border-indigo-250 border-indigo-200"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${userAnswers[activeQuestion.id].isBookmarked ? "text-indigo-600 fill-indigo-600" : ""}`} />
                <span>Mark for Review</span>
              </button>

              <button
                onClick={handleSaveAndNext}
                disabled={currentIndex === questions.length - 1}
                className="px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-900 border border-slate-950 text-white hover:bg-slate-800 transition-all flex items-center gap-1 cursor-pointer"
              >
                Save & Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Pop-up calculator side-bar */}
          {showCalculator && (
            <div className="absolute right-4 top-16 shadow-2xl z-30 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
              <OnScreenCalculator onClose={() => setShowCalculator(false)} />
            </div>
          )}
        </div>

        {/* RIGHT Pane: Question Palette & Submission (1 column) */}
        <div className="space-y-6">
          
          {/* Question Grid Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3.5 border-b border-slate-100 pb-2">
              Question Palette
            </h3>

            {/* Colored Palette Grid */}
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, qIdx) => {
                const answerStatus = userAnswers[q.id];
                const isCurrent = qIdx === currentIndex;
                
                let btnClass = "bg-slate-100 text-slate-500 border-slate-200";
                
                if (answerStatus.selectedOption !== null && !answerStatus.isBookmarked) {
                  // Answered and saved
                  btnClass = "bg-emerald-500 text-white border-emerald-600";
                } else if (answerStatus.isBookmarked) {
                  if (answerStatus.selectedOption !== null) {
                    // Answered & Marked for review
                    btnClass = "bg-indigo-600 text-white border-indigo-700";
                  } else {
                    // Marked for review (Not Answered)
                    btnClass = "bg-indigo-50 text-indigo-700 border-indigo-200";
                  }
                } else if (timeSpent[q.id] > 0) {
                  // Visited but not answered
                  btnClass = "bg-slate-200 text-slate-700 border-slate-300";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(qIdx)}
                    className={`h-10 text-xs font-extrabold rounded-xl border font-mono transition-all flex items-center justify-center cursor-pointer ${btnClass} ${
                      isCurrent
                        ? "ring-2 ring-indigo-600 ring-offset-2 scale-105"
                        : "hover:scale-102"
                    }`}
                  >
                    {qIdx + 1}
                  </button>
                );
              })}
            </div>

            {/* Index Map */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-slate-500 border-t border-slate-100 pt-3.5 font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 shrink-0" />
                <span>Saved & Next</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-indigo-600 shrink-0" />
                <span>Marked & Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-indigo-50 border border-indigo-250 shrink-0" />
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-slate-100 border border-slate-200 shrink-0" />
                <span>Unvisited</span>
              </div>
            </div>
          </div>

          {/* Submission and Control Actions */}
          <div className="bg-slate-900 rounded-2xl border border-slate-950 p-5 pt-6 text-slate-100 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-white">Ready to Finish?</h4>
              <p className="text-xs text-slate-400 mt-1">
                You can review your performance immediately upon submission.
              </p>
            </div>

            {/* Quick Status */}
            <div className="bg-slate-850/50 rounded-xl p-3.5 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Total Questions:</span>
                <span className="font-bold font-mono">{questions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Unanswered Remaining:</span>
                <span className={`font-bold font-mono ${totalUnanswered > 0 ? "text-indigo-300" : "text-emerald-400"}`}>
                  {totalUnanswered}
                </span>
              </div>
            </div>

            <div className="pt-2 grid grid-cols-1 gap-2">
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 hover:shadow-lg cursor-pointer text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
              >
                Submit & Analyze
              </button>

              <button
                onClick={onCancelTest}
                className="w-full bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                title="Discard attempt and exit"
              >
                Discard Test
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Overlay Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2.5xl text-slate-850 animate-in zoom-in-95 duration-155">
            <div className="flex items-center gap-3 text-indigo-600">
              <AlertTriangle className="w-8 h-8 shrink-0 text-indigo-500" />
              <h3 className="text-lg font-bold text-slate-900">Submit Exam Mock?</h3>
            </div>
            
            <p className="text-sm text-slate-500 mt-3 leading-relaxed">
              Are you sure you want to finalize and submit this Quant mock test? You have{" "}
              <strong className="text-slate-850 font-bold font-mono">{totalUnanswered}</strong> questions left unanswered.
            </p>

            {/* Summary statistics */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mt-4 text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200/50 pb-1.5 font-bold text-slate-700">
                <span>Metric</span>
                <span>Value</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Questions Pool</span>
                <span>{questions.length}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Completed Responses</span>
                <span>{questions.length - totalUnanswered}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Time Taken</span>
                <span>{formatTime(timeLimitSeconds - timeLeft)}</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer transition-colors text-slate-600"
              >
                Keep Solving
              </button>
              <button
                onClick={() => {
                  setShowConfirmSubmit(false);
                  handleAutoSubmit();
                }}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-all"
              >
                Yes, Submit now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
