// Pre-defined high-fidelity mock scores to make the initial dashboard experience gorgeous
export const PRE_POPULATED_MOCKS = [
  {
    id: "mock_1",
    date: "Jun 02, 10:15 AM",
    totalQuestions: 10,
    unansweredCount: 1,
    correctCount: 6,
    incorrectCount: 3,
    score: 15, // 6*3 - 3*1 = 15
    maxScore: 30,
    accuracy: 66.6,
    timeTakenSeconds: 712,
    timeLimitSeconds: 900,
    categoryPerformance: {
      "Arithmetic": { total: 4, correct: 3 },
      "Algebra": { total: 2, correct: 1 },
      "Geometry": { total: 2, correct: 1 },
      "Number Systems": { total: 2, correct: 1 }
    },
    answers: [],
    questions: []
  },
  {
    id: "mock_2",
    date: "Jun 10, 04:30 PM",
    totalQuestions: 10,
    unansweredCount: 0,
    correctCount: 7,
    incorrectCount: 3,
    score: 18, // 7*3 - 3 = 18
    maxScore: 30,
    accuracy: 70,
    timeTakenSeconds: 618,
    timeLimitSeconds: 900,
    categoryPerformance: {
      "Arithmetic": { total: 3, correct: 2 },
      "Algebra": { total: 3, correct: 2 },
      "Geometry": { total: 2, correct: 2 },
      "Modern Math": { total: 2, correct: 1 }
    },
    answers: [],
    questions: []
  },
  {
    id: "mock_3",
    date: "Jun 17, 11:00 AM",
    totalQuestions: 10,
    unansweredCount: 2,
    correctCount: 7,
    incorrectCount: 1,
    score: 20, // 7*3 - 1 = 20
    maxScore: 30,
    accuracy: 87.5,
    timeTakenSeconds: 580,
    timeLimitSeconds: 900,
    categoryPerformance: {
      "Arithmetic": { total: 3, correct: 3 },
      "Algebra": { total: 2, correct: 1 },
      "Number Systems": { total: 3, correct: 2 },
      "Modern Math": { total: 2, correct: 1 }
    },
    answers: [],
    questions: []
  }
];