import { useState } from "react";
import { Calculator, X, Delete } from "lucide-react";

export default function OnScreenCalculator({ onClose }) {
  const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState("");
  const [isResetOnNext, setIsResetOnNext] = useState(false);

  const handleNum = (num) => {
    if (display === "0" || isResetOnNext) {
      setDisplay(num);
      setIsResetOnNext(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleDecimal = () => {
    if (isResetOnNext) {
      setDisplay("0.");
      setIsResetOnNext(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setEquation("");
    setIsResetOnNext(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const handleOp = (op) => {
    setEquation(display + " " + op + " ");
    setIsResetOnNext(true);
  };

  const handleEqual = () => {
    if (!equation) return;
    const parts = equation.trim().split(" ");
    if (parts.length < 2) return;
    const num1 = parseFloat(parts[0]);
    const op = parts[1];
    const num2 = parseFloat(display);
    let res;

    switch (op) {
      case "+": res = num1 + num2; break;
      case "-": res = num1 - num2; break;
      case "*": res = num1 * num2; break;
      case "/": res = num2 !== 0 ? num1 / num2 : 0; break;
      default: res = num2;
    }

    setDisplay(String(Number(res.toFixed(8)))); // Trim unnecessary trailing decimals
    setEquation("");
    setIsResetOnNext(true);
  };

  const handleSqrt = () => {
    const val = parseFloat(display);
    if (val >= 0) {
      setDisplay(String(Number(Math.sqrt(val).toFixed(8))));
      setIsResetOnNext(true);
    } else {
      setDisplay("Error");
    }
  };

  const handleInverse = () => {
    const val = parseFloat(display);
    if (val !== 0) {
      setDisplay(String(Number((1 / val).toFixed(8))));
      setIsResetOnNext(true);
    } else {
      setDisplay("Error");
    }
  };

  const handleToggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  return (
    <div id="onscreen_calc" className="w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 outline-hidden overflow-hidden select-none font-sans text-slate-800">
      {/* Title Bar */}
      <div className="bg-slate-900 px-3.5 py-2.5 flex items-center justify-between text-slate-100">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[10px] select-none">
          <Calculator className="w-4 h-4 text-indigo-400" />
          <span>Non-Scientific Calc</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Screen */}
      <div className="bg-slate-50 p-4.5 text-right border-b border-slate-100">
        <div className="text-xs text-slate-400 `min-h-[16px]` font-mono tracking-tight font-medium overflow-hidden text-ellipsis whitespace-nowrap">
          {equation}
        </div>
        <div className="text-2xl font-black font-mono tracking-tight truncate mt-1 text-slate-950">
          {display}
        </div>
      </div>

      {/* Keys Group */}
      <div className="p-2.5 grid grid-cols-4 gap-1.5 bg-slate-50">
        {/* Row 1 */}
        <button onClick={handleClear} className="col-span-1 h-10 text-xs font-bold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors uppercase border border-rose-100 cursor-pointer">
          C
        </button>
        <button onClick={handleBackspace} className="h-10 flex items-center justify-center rounded-lg bg-slate-200 hover:bg-slate-250 transition-colors text-slate-700 cursor-pointer">
          <Delete className="w-4 h-4" />
        </button>
        <button onClick={handleInverse} className="h-10 text-xs font-bold rounded-lg bg-slate-200 hover:bg-slate-250 transition-colors text-slate-700 font-mono cursor-pointer">
          1/x
        </button>
        <button onClick={handleSqrt} className="h-10 text-sm font-bold rounded-lg bg-slate-200 hover:bg-slate-250 transition-colors text-slate-700 font-mono cursor-pointer">
          √
        </button>

        {/* Row 2 */}
        <button onClick={() => handleNum("7")} className="h-10 text-sm font-bold rounded-lg bg-white hover:bg-slate-50 transition-colors border border-slate-200 cursor-pointer">
          7
        </button>
        <button onClick={() => handleNum("8")} className="h-10 text-sm font-bold rounded-lg bg-white hover:bg-slate-50 transition-colors border border-slate-200 cursor-pointer">
          8
        </button>
        <button onClick={() => handleNum("9")} className="h-10 text-sm font-bold rounded-lg bg-white hover:bg-slate-50 transition-colors border border-slate-200 cursor-pointer">
          9
        </button>
        <button onClick={() => handleOp("/")} className="h-10 text-sm font-bold rounded-lg bg-slate-200 hover:bg-slate-250 transition-colors text-slate-700 font-mono cursor-pointer">
          /
        </button>

        {/* Row 3 */}
        <button onClick={() => handleNum("4")} className="h-10 text-sm font-bold rounded-lg bg-white hover:bg-slate-50 transition-colors border border-slate-200 cursor-pointer">
          4
        </button>
        <button onClick={() => handleNum("5")} className="h-10 text-sm font-bold rounded-lg bg-white hover:bg-slate-50 transition-colors border border-slate-200 cursor-pointer">
          5
        </button>
        <button onClick={() => handleNum("6")} className="h-10 text-sm font-bold rounded-lg bg-white hover:bg-slate-50 transition-colors border border-slate-200 cursor-pointer">
          6
        </button>
        <button onClick={() => handleOp("*")} className="h-10 text-sm font-bold rounded-lg bg-slate-200 hover:bg-slate-250 transition-colors text-slate-700 font-mono cursor-pointer">
          *
        </button>

        {/* Row 4 */}
        <button onClick={() => handleNum("1")} className="h-10 text-sm font-bold rounded-lg bg-white hover:bg-slate-50 transition-colors border border-slate-200 cursor-pointer">
          1
        </button>
        <button onClick={() => handleNum("2")} className="h-10 text-sm font-bold rounded-lg bg-white hover:bg-slate-50 transition-colors border border-slate-200 cursor-pointer">
          2
        </button>
        <button onClick={() => handleNum("3")} className="h-10 text-sm font-bold rounded-lg bg-white hover:bg-slate-50 transition-colors border border-slate-200 cursor-pointer">
          3
        </button>
        <button onClick={() => handleOp("-")} className="h-10 text-sm font-bold rounded-lg bg-slate-200 hover:bg-slate-250 transition-colors text-slate-700 font-mono cursor-pointer">
          -
        </button>

        {/* Row 5 */}
        <button onClick={handleToggleSign} className="h-10 text-xs font-bold rounded-lg bg-white hover:bg-slate-50 transition-colors border border-slate-200 cursor-pointer">
          +/-
        </button>
        <button onClick={() => handleNum("0")} className="h-10 text-sm font-bold rounded-lg bg-white hover:bg-slate-50 transition-colors border border-slate-200 cursor-pointer">
          0
        </button>
        <button onClick={handleDecimal} className="h-10 text-sm font-bold rounded-lg bg-white hover:bg-slate-50 transition-colors border border-slate-200 cursor-pointer">
          .
        </button>
        <button onClick={() => handleOp("+")} className="h-10 text-sm font-bold rounded-lg bg-slate-200 hover:bg-slate-250 transition-colors text-slate-700 font-mono cursor-pointer">
          +
        </button>
      </div>

      <button onClick={handleEqual} className="w-full h-11 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors border-t border-indigo-500 uppercase tracking-widest cursor-pointer">
        =
      </button>
    </div>
  );
}
