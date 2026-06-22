import express from "express";
import path from "path";
import process from "process";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Get quantitative questions from the real backend API
  app.get("/api/questions", (req, res) => {
    res.json({
      success: true,
      questions: [
        {
          id: "api_q1",
          category: "Arithmetic",
          difficulty: "Medium",
          questionText: "A solution of 100 liters contains 10% spirit. How many liters of pure spirit should be added to make the solution contain 20% spirit?",
          options: ["10 liters", "12.5 liters", "15 liters", "8.5 liters"],
          correctOptionIndex: 1,
          explanation: "Initial solution = 100 liters. Spirit content = 10% of 100 = 10 liters. Water = 90 liters.\nLet 'x' liters of pure spirit be added.\nNew total solution = 100 + x.\nNew spirit amount = 10 + x.\nWe want spirit to be 20%:\n(10 + x) / (100 + x) = 0.2\n10 + x = 20 + 0.2x\n0.8x = 10\nx = 10 / 0.8 = 12.5 liters."
        },
        {
          id: "api_q2",
          category: "Algebra",
          difficulty: "Hard",
          questionText: "If x and y are positive integers such that x² - y² = 101, what is the value of x² + y²?",
          options: ["5101", "5151", "5051", "5201"],
          correctOptionIndex: 0,
          explanation: "Given x² - y² = 101. Factoring: (x - y)(x + y) = 101.\nSince 101 is a prime number and x, y are positive integers, the only factors are 1 and 101.\nSince (x + y) > (x - y):\nx + y = 101\nx - y = 1\nAdding the two equations: 2x = 102 => x = 51.\nSubtracting them: 2y = 100 => y = 50.\nx² + y² = 51² + 50² = 2601 + 2500 = 5101."
        },
        {
          id: "api_q3",
          category: "Geometry",
          difficulty: "Medium",
          questionText: "A rectangular park of dimensions 60m x 40m has two cross paths of width 5m running in the middle of it, one parallel to length and other parallel to breadth. Find the cost of gravelling the paths at $2.50 per sq.m.",
          options: ["$1200", "$1187.50", "$1125.00", "$1250"],
          correctOptionIndex: 1,
          explanation: "Area of path parallel to length = 60 * 5 = 300 sq.m.\nArea of path parallel to breadth = 40 * 5 = 200 sq.m.\nArea common to both paths = 5 * 5 = 25 sq.m.\nTotal area of paths = 300 + 200 - 25 = 475 sq.m.\nCost of gravelling = 475 * $2.50 = $1187.50."
        },
        {
          id: "api_q4",
          category: "Number Systems",
          difficulty: "Hard",
          questionText: "Find the least positive integer 'n' such that 1260 * n is a perfect cube.",
          options: ["1050", "441", "44100", "7350"],
          correctOptionIndex: 3,
          explanation: "Prime factorization of 1260:\n1260 = 122 * 10 = 2² * 3² * 5¹ * 7¹.\nTo make it a perfect cube, the power of every prime factor must be a multiple of 3.\nTherefore, we need to multiply 1260 by:\n2¹ * 3¹ * 5² * 7² = 7350.\nHence, n = 7350."
        },
        {
          id: "api_q5",
          category: "Modern Math",
          difficulty: "Medium",
          questionText: "In how many ways can 5 boys and 3 girls be seated along a circular table such that no two girls are adjacent?",
          options: ["1440 ways", "1200 ways", "720 ways", "2880 ways"],
          correctOptionIndex: 0,
          explanation: "First, arrange the 5 boys in a circle. This can be done in (5 - 1)! = 4! = 24 ways.\nThis arrangement creates 5 spaces between the boys.\nNow, seat the 3 girls in these 5 gaps. The number of ways to pick and arrange girls in the gaps = 5P3 = 5 * 4 * 3 = 60 ways.\nTotal number of circular arrangements = 24 * 60 = 1440 ways."
        },
        {
          id: "api_q6",
          category: "Arithmetic",
          difficulty: "Easy",
          questionText: "A vendor bought toffees at 6 for a rupee. How many for a rupee must he sell to gain 20%?",
          options: ["3", "4", "5", "6"],
          correctOptionIndex: 2,
          explanation: "Cost Price (CP) of 6 toffees = Re 1 = 100 paise. CP of 1 toffee = 100/6 paise.\nTo gain 20%, Selling Price (SP) of 1 toffee must be:\n(100/6) * 1.20 = 20 paise.\nFor Re 1 (100 paise), number of toffees he must sell = 100 / 20 = 5 toffees."
        },
        {
          id: "api_q7",
          category: "Algebra",
          difficulty: "Medium",
          questionText: "If log₂ (log₃ (log₄ x)) = 0, what is the value of 2x + 1?",
          options: ["129", "131", "65", "63"],
          correctOptionIndex: 0,
          explanation: "Given: log₂ (log₃ (log₄ x)) = 0\nTaking base 2 exponent on both sides:\nlog₃ (log₄ x) = 2⁰ = 1\nTaking base 3 exponent on both sides:\nlog₄ x = 3¹ = 3\nTaking base 4 exponent on both sides:\nx = 4³ = 64.\nWe need the value of 2x + 1 = 2(64) + 1 = 128 + 1 = 129."
        },
        {
          id: "api_q8",
          category: "Geometry",
          difficulty: "Easy",
          questionText: "The length of diagonal of a square is 12√2 cm. What is the length of diagonal of another square whose area is double that of first square?",
          options: ["24 cm", "18 cm", "12 cm", "36 cm"],
          correctOptionIndex: 0,
          explanation: "Side of the first square = Diagonal / √2 = 12 cm.\nArea of first square = 12² = 144 sq.cm.\nArea of second square = 2 * 144 = 288 sq.cm.\nSide of the second square = √288 = 12√2 cm.\nDiagonal of second square = Side * √2 = 24 cm."
        },
        {
          id: "api_q9",
          category: "Number Systems",
          difficulty: "Hard",
          questionText: "Which is the highest power of 7 that completely divides 1000! (1000 factorial)?",
          options: ["164", "165", "163", "166"],
          correctOptionIndex: 0,
          explanation: "Using Legendre's formula, the highest power of a prime 'p' dividing 'N!' is given by:\nE_p(N!) = [1000/7] + [1000/49] + [1000/343] = 142 + 20 + 2 = 164.\nSo, the highest power is 164."
        },
        {
          id: "api_q10",
          category: "Arithmetic",
          difficulty: "Medium",
          questionText: "The populations of two towns are in ratio 5:6. If 2000 residents migrate from the second town to the first town, the ratio becomes 1:1. Find the initial population of the second town.",
          options: ["12000", "24000", "10000", "15000"],
          correctOptionIndex: 1,
          explanation: "Let initial populations be 5x and 6x. Town 1 has 5x, Town 2 has 6x.\nAfter 2000 migration from second to first:\nTown 1 = 5x + 2000\nTown 2 = 6x - 2000\nThey are equal:\n5x + 2000 = 6x - 2000 => x = 4000.\nInitial population of second town = 6x = 6 * 4000 = 24,000."
        },
        {
          id: "api_q11",
          category: "Arithmetic",
          difficulty: "Medium",
          questionText: "A runner completes a 400-meter lap inside an athletic arena. He runs the first 200 meters at 10 m/s and the next 200 meters at 15 m/s. What is his average speed across the entire lap?",
          options: ["12 m/s", "12.5 m/s", "13 m/s", "11.5 m/s"],
          correctOptionIndex: 0,
          explanation: "Average speed = Total Distance / Total Time.\nTime taken for first half = 200m / 10 m/s = 20 seconds.\nTime taken for second half = 200m / 15 m/s = 13.33 seconds.\nTotal Time = 20 + 13.33 = 33.33 seconds (i.e. 100/3 seconds).\nAverage Speed = 400 / (100/3) = 12 m/s."
        }
      ]
    });
  });

  // Vite middleware setup for Development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[KDs Backend Server] Operating successfully on http://0.0.0.0:${PORT}`);
  });
}

startServer();





