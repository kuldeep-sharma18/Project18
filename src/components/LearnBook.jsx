import { useState } from "react";
import { Search, HelpCircle } from "lucide-react";

export default function LearnBook() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["All", "Arithmetic", "Algebra", "Geometry", "Number Systems"];

  const theorems = [
    {
      id: "th1",
      category: "Arithmetic",
      title: "Pacing Speed Ratio & Average Speeds",
      formula: "Avg Speed = 2xy / (x + y)",
      explanation: "Applicable when a runner covers equal half distances at speed x and speed y. If three equal distance segments are covered, avg speed is 3xyz / (xy + yz + zx).",
      shortcut: "For equal time segments, average is simple Arithmetic Mean: (x + y)/2."
    },
    {
      id: "th2",
      category: "Algebra",
      title: "Roots of Quadratic Discriminants",
      formula: "x = [-b ± √(b² - 4ac)] / 2a",
      explanation: "Roots are real and distinct if Discriminant (D) > 0. Roots are complex conjugate pairs if D < 0. Equal if D = 0.",
      shortcut: "If a + b + c = 0, the roots of ax² + bx + c = 0 are always 1 and c/a."
    },
    {
      id: "th3",
      category: "Geometry",
      title: "Euler's Euler Polyhedron Formula",
      formula: "F + V = E + 2",
      explanation: "For any standard convex polyhedron, where F is faces, V is vertices, and E is edges.",
      shortcut: "For a cube: Faces 6, Vertices 8, Edges 12 => 6 + 8 = 12 + 2."
    },
    {
      id: "th4",
      category: "Number Systems",
      title: "Fermat's Little Theorem Remainder Shortcut",
      formula: "a^(p-1) ≡ 1 (mod p)",
      explanation: "When prime number p divides a^(p-1), the positive integer base 'a' being non-divisible by p, remainder is always 1.",
      shortcut: "Extremely useful for solving remainder problems which have high prime denominators (e.g. 2¹⁰⁰ mod 101)."
    },
    {
      id: "th5",
      category: "Geometry",
      title: "Hero's Triangular Area Theorem",
      formula: "Area = √[s(s-a)(s-b)(s-c)]",
      explanation: "Where s = (a + b + c)/2 is the semi-perimeter of the triangle.",
      shortcut: "Use basic integer pythagorean triples (3-4-5, 5-12-13, 8-15-17) to bypass semiperimeter calculations."
    },
    {
      id: "th6",
      category: "Arithmetic",
      title: "Partnership Capital Investment Shares",
      formula: "Profit Ratio = (Capital A * Time A) : (Capital B * Time B)",
      explanation: "Dividends share directly in proportion to both capital volume invested and active holding duration.",
      shortcut: "If profits are equal, Time ratio is inverse of Capital ratio."
    }
  ];

  const filteredTheorems = theorems.filter((th) => {
    const matchesCat = selectedCategory === "All" || th.category === selectedCategory;
    const matchesSearch = th.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          th.formula.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6 font-sans">
      
      {/* Search Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-md font-extrabold text-slate-900 tracking-tight">Quantitative Formulas Handbook</h2>
            <p className="text-xs text-slate-450 text-slate-500">Quickly unlock core MBA entrance theorems, geometric rules, and shortcut tips.</p>
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search formula names..."
              className="w-full text-xs pl-9 pr-3 py-2 border border-slate-250 focus:border-indigo-600 focus:outline-hidden rounded-xl bg-slate-50/50"
            />
          </div>
        </div>

        {/* Category filtering sub bar */}
        <div className="flex flex-wrap gap-1.5 border-t border-slate-100 pt-3.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white"
                  : "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTheorems.map((th) => (
          <div key={th.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:shadow-sm">
            <div className="space-y-3">
              
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  {th.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Formula Handout</span>
              </div>

              <div>
                <h4 className="text-xs font-black text-slate-800 tracking-tight">{th.title}</h4>
                <div className="bg-slate-900 text-amber-400 font-mono font-bold text-center py-3 px-4 rounded-xl border border-slate-950 text-xs mt-2 shadow-inner">
                  {th.formula}
                </div>
              </div>

              <div className="space-y-1 pt-1.5 text-xs text-slate-500 leading-relaxed">
                <p>{th.explanation}</p>
              </div>

            </div>

            <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl p-3 mt-4 text-[11px] text-emerald-800">
              <strong className="text-emerald-905 block mb-0.5">🚀 KDs Shortcut tip:</strong>
              {th.shortcut}
            </div>

          </div>
        ))}

        {filteredTheorems.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400">
            <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs">No quantitative formulas match your current search constraints.</p>
          </div>
        )}
      </div>

    </div>
  );
}
