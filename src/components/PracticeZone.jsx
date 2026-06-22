import { useState, useEffect, useCallback } from "react";
import { RefreshCcw, Check, X, ShieldAlert, Sparkles } from "lucide-react";

export default function PracticeZone() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState({ correct: 0, attempted: 0 });

  const fetchApiQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/questions");
      const data = await res.json();
      if (data.success && data.questions) {
        setQuestions(data.questions);
      } else {
        throw new Error("Invalid API format response.");
      }
    } catch (e) {
      console.error(e);
      setError("Failed to stream questions from the real Express/Node API server. Please check that port 3000 serves backend routes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadQuestions = async () => {
      await fetchApiQuestions();
    };
    loadQuestions();
  }, [fetchApiQuestions]);

  const handleOptionClick = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
  if (selectedOption === null || isAnswered) return;
  
  const currentQuestion = questions[currentIndex];  // Define first
  setIsAnswered(true);
  // const correctIdx = currentQuestion.correctOptionIndex;  // Now it works
  const correctIdx = currentQuestion.correctOptionIndex;
  if (selectedOption === correctIdx) {
    setScore((prev) => ({ correct: prev.correct + 1, attempted: prev.attempted + 1 }));
  } else {
    setScore((prev) => ({ ...prev, attempted: prev.attempted + 1 }));
  }
};

  const handleNext = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Wrap around or restart
      setCurrentIndex(0);
    }
  };

// const handleSubmitAnswer = () => {
//   if (selectedOption === null || isAnswered) return;
  
//   const currentQuestion = questions[currentIndex];  // ✅ Define first
//   setIsAnswered(true);
//   const correctIdx = currentQuestion.correctOptionIndex;
//   if (selectedOption === correctIdx) {
//     setScore((prev) => ({ correct: prev.correct + 1, attempted: prev.attempted + 1 }));
//   } else {
//     setScore((prev) => ({ ...prev, attempted: prev.attempted + 1 }));
//   }
// };

// const handleNext = () => {
//   setSelectedOption(null);
//   setIsAnswered(false);
//   if (currentIndex < questions.length - 1) {
//     setCurrentIndex((prev) => prev + 1);  // ✅ Correct increment
//   } else {
//     setCurrentIndex(0);
//   }
// };

  function handleReset() {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore({ correct: 0, attempted: 0 });
    fetchApiQuestions();
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-4 font-sans">
        <div className="w-12 h-12 border-4 border-indigo-650 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">Querying active questions from EXPRESS /api/questions backend endpoint...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center space-y-4 font-sans bg-rose-50/50 rounded-2xl border border-rose-100">
        <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto" />
        <h3 className="text-sm font-bold text-slate-800">API Connection Error</h3>
        <p className="text-xs text-rose-700 leading-relaxed max-w-md mx-auto">{error}</p>
        <button
          onClick={fetchApiQuestions}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const q = questions[currentIndex];
  if (!q) return null;

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6 font-sans">
      
      {/* Quiz statistics panel with dynamic state counter */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase text-[10px] font-mono font-extrabold shrink-0">
            Node.js Live API
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 leading-none">Instant KDs Booster Quiz</h3>
            <p className="text-[10px] text-slate-400 mt-1">Questions delivered dynamically from the backend controller.</p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest leading-none">Success Rate</span>
            <span className="text-sm font-black font-mono text-slate-800 leading-normal">
              {score.attempted > 0 ? Math.round((score.correct / score.attempted) * 100) : 0}% 
              <span className="text-xs font-medium text-slate-400 ml-1">({score.correct}/{score.attempted})</span>
            </span>
          </div>

          <button
            onClick={handleReset}
            title="Reload from API"
            className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl cursor-pointer"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6.5 shadow-sm space-y-5">
        
        {/* Category & indices */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <span className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 border border-indigo-120 px-2 py-0.5 rounded-md">
            {q.category} · {q.difficulty}
          </span>
          <span className="text-xs font-mono text-slate-400 font-extrabold">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Question item */}
        <p className="text-slate-850 font-extrabold text-sm leading-relaxed">
          {q.questionText}
        </p>

        {/* Options */}
        <div className="space-y-2.5">
          {q.options.map((opt, oIdx) => {
            const isSelected = selectedOption === oIdx;
            const isCorrect = q.correctOptionIndex === oIdx;
            
            let btnClass = "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-700";
            if (isSelected) {
              btnClass = "border-indigo-600 bg-indigo-50/60 text-indigo-900";
            }
            if (isAnswered) {
              if (isCorrect) {
                btnClass = "border-emerald-500 bg-emerald-50 text-emerald-800";
              } else if (isSelected) {
                btnClass = "border-rose-300 bg-rose-50 text-rose-800";
              } else {
                btnClass = "opacity-55 border-slate-100 bg-slate-50 text-slate-400";
              }
            }

            return (
              <button
                key={opt}
                disabled={isAnswered}
                onClick={() => handleOptionClick(oIdx)}
                className={`w-full text-left p-4.5 text-xs font-semibold rounded-2xl border transition-all duration-150 flex items-center justify-between cursor-pointer ${btnClass}`}
              >
                <span>{opt}</span>
                <div className="shrink-0 flex items-center gap-1.5 font-sans">
                  {isAnswered && isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                  {isAnswered && !isCorrect && isSelected && <X className="w-4 h-4 text-rose-600" />}
                  <span className="text-[10px] font-mono text-slate-400">Option {String.fromCharCode(65 + oIdx)}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Submit or Next footer action bar */}
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <span className="text-[10px] text-slate-400 uppercase font-mono font-extrabold">
            API Question Payload Hash: {q.id}
          </span>

          {!isAnswered ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all disabled:opacity-50 cursor-pointer"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Next Question →
            </button>
          )}
        </div>

      </div>

      {/* Answer detail explanation card */}
      {isAnswered && (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-705 text-slate-705 text-indigo-600">
            <Sparkles className="w-4 h-4 text-indigo-505" />
            <span>EXPERT ACADEMIC EXPLANATION</span>
          </div>
          <p className="text-xs font-sans text-slate-600 leading-relaxed whitespace-pre-wrap">
            {q.explanation}
          </p>
        </div>
      )}

    </div>
  );
}
