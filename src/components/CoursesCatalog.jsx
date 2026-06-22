import { useState } from "react";
import { CheckSquare, Percent } from "lucide-react";

export default function CoursesCatalog({ userEmail }) {
  const [couponCode, setCouponCode] = useState("KD70");
  const [discountMultiplier, setDiscountMultiplier] = useState(0.3); // 70% off defaults to paying 30%
  const [appliedCode, setAppliedCode] = useState("KD70"); //KD70
  const [enrollmentStatus, setEnrollmentStatus] = useState({});

  const coursesList = [
    {
      id: "cat_complete_2026",
      title: "KDs Complete CAT 2026 coaching",
      originalPrice: 19999,
      duration: "1 Year Full Program",
      features: [
        "150+ interactive concept video modules",
        "30 National full-length CAT mocks with dynamic analytics",
        "1-On-1 mentoring sessions from IIM post-graduates",
        "Direct access to previous years' verified mock answers",
        "Daily proctored speed rounds"
      ]
    },
    {
      id: "quant_rush_pack",
      title: "Pure Quant Mastery Booster Program",
      originalPrice: 4999,
      duration: "6 Months Crash Syllabus",
      features: [
        "Specialized focus on Algebra & Number systems",
        "Formula cheatsheet physical handouts shipped instantly",
        "10 targeted sectionals in hard geometry theorems",
        "Full simulation portal access"
      ]
    },
    {
      id: "mba_non_cat_pack",
      title: "XAT & SNAP Comprehensive Special",
      originalPrice: 7999,
      duration: "8 Months targeted syllabus",
      features: [
        "Includes Decision Making special segments",
        "25 mock sessions for SNAP, XAT and IIFT",
        "Weekly peer scoreboard review panels"
      ]
    }
  ];

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const formatted = couponCode.trim().toUpperCase();
    if (formatted === "KD70") {
      setDiscountMultiplier(0.3); // 70% off
      setAppliedCode("KD70");
      alert("Success! CAT-2026 Special Coupon 'KD70' applied. 70% Flat savings calculated.");
    } else if (formatted === "FREE100") {
      setDiscountMultiplier(0); // 100% off
      setAppliedCode("FREE100");
      alert("Developer code 'FREE100' applied successfully! Entire balance waived.");
    } else {
      alert("Invalid promotional code! Try using 'KD70' to save flat 70% off.");
    }
  };

  const handleEnroll = (courseId) => {
    setEnrollmentStatus((prev) => ({
      ...prev,
      [courseId]: true
    }));
    alert(`Congratulations! You have initialized student enrollment for course: ${courseId}. We sent confirmation outlines and mock credentials to your email ${userEmail || "your register profile"}.`);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6 font-sans">
      
      {/* Promo banner and Coupon input bar */}
      <div className="`bg-gradient-to-r` from-amber-500 to-amber-600 p-6 rounded-2xl text-slate-900 border border-amber-400 shadow-md flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-1.5 font-sans">
            <Percent className="w-5 h-5 text-slate-950 fill-slate-950" />
            <h2 className="text-sm font-black uppercase tracking-wider leading-none">Flash MBA Discount Coupon Gateway</h2>
          </div>
          <p className="text-xs text-slate-800 mt-1.5 font-semibold">
            Use corporate coaching coupons to claim 70% instant discount savings calculated automatically below.
          </p>
        </div>

        <form onSubmit={handleApplyCoupon} className="flex gap-2 w-full lg:w-96">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Type 'KD70' or 'FREE100'"
            className="w-full text-xs font-mono font-extrabold uppercase placeholder:text-slate-500 p-3 bg-white/95 rounded-xl border border-amber-350 focus:outline-hidden text-slate-900 shadow-inner"
          />
          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase px-5 rounded-xl tracking-wider shrink-0 transition-colors shadow-sm cursor-pointer"
          >
            Apply Code
          </button>
        </form>
      </div>

      {/* Courses Cards layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coursesList.map((course) => {
          const finalPrice = Math.round(course.originalPrice * discountMultiplier);
          const percentSaved = Math.round((1 - discountMultiplier) * 100);
          const hasEnrolled = enrollmentStatus[course.id];

          return (
            <div
              key={course.id}
              className={`bg-white rounded-2xl border p-5.5 flex flex-col justify-between shadow-xs relative overflow-hidden ${
                hasEnrolled ? "border-emerald-400 bg-emerald-50/10" : "border-slate-200"
              }`}
            >
              {/* Sticker banner */}
              {percentSaved > 0 && (
                <div className="absolute top-3 right-3 bg-red-500 text-white font-extrabold text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full border border-red-400 shadow-sm">
                  -{percentSaved}% OFF
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <span className="text-[9px] font-mono tracking-wider font-extrabold text-slate-400 block uppercase">
                    {course.duration}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 mt-1 leading-snug">
                    {course.title}
                  </h3>
                </div>

                {/* Pricing layout with dynamically calculated discount */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150 text-left font-sans">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-slate-900">
                      ₹{finalPrice.toLocaleString()}
                    </span>
                    {percentSaved > 0 && (
                      <span className="text-xs font-mono line-through text-slate-400 font-bold">
                        ₹{course.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono font-bold block mt-1">
                    Coupon code <strong className="text-indigo-650">{appliedCode}</strong> applied successfully.
                  </span>
                </div>

                {/* Features list */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Included features:</p>
                  <div className="space-y-1.5">
                    {course.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2 text-xs">
                        <CheckSquare className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span className="text-slate-650 font-semibold">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action */}
              <div className="pt-5 mt-6 border-t border-slate-100">
                <button
                  onClick={() => handleEnroll(course.id, finalPrice)}
                  disabled={hasEnrolled}
                  className={`w-full text-center py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    hasEnrolled
                      ? "bg-green-100 text-green-800 border border-green-300 pointer-events-none"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  }`}
                >
                  {hasEnrolled ? "✓ Enrolled & Ready" : "Proceed & Buy Online"}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
