import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTestSeriesByIdForUser } from "@/api/userTestSeries";
import { toast } from "sonner";

interface SectionData {
  sectionName: string;
  totalQuestionsSupposedToBeAdded: number;
  totalQuestionsAdded: number;
  sectionDurationInMinutes: number;
  pointsForCorrectAnswer?: number;
}

const generalInstructions = [
  {
    id: 1,
    title: "Test Timer.",
    points: [
      "The test timer is controlled by the server.",
      "A countdown timer will be visible at the top of your screen showing the remaining time.",
      "Once the timer reaches zero, the test will automatically end.",
      "You are not required to manually submit the test."
    ]
  },
  {
    id: 2,
    title: "Question Palette (Bottom Nav of the Screen).",
    description: "The Question Palette helps you track the status of each question using different symbols:",
    points: [
      { icon: "blue-circle", text: "You are currently on this question" },
      { icon: "green-circle", text: "You have answered the question." },
      { icon: "red-circle", text: "You have not answered the question." },
      { icon: "gray-circle", text: "You have not visited the question yet." }
    ]
  },
  {
    id: 3,
    title: "Navigating and Answering Questions",
    description: "You can answer questions in the following ways:",
    steps: [
      { label: "A.", text: "Click on a question number in the Question Palette to jump directly to that question." },
      { label: "⚠️", text: "Note: This does not save your current answer automatically.", isWarning: true },
      { label: "B.", text: "Click Save & Next to save your answer and move to the next question." },
      { label: "C.", text: "Click Mark for Review & Next to save your answer, mark the question for review, and move to the next question." }
    ],
    footer: "An answer will be considered saved only if you click:",
    footerPoints: ["Save & Next", "Save & Mark for Review"]
  },
  {
    id: 4,
    title: "Marking Scheme",
    sections: [
      {
        subtitle: "Objective Type Questions:",
        points: [
          "Negative marking is applicable.",
          "¼ (one-fourth) of the marks will be deducted for every incorrect answer."
        ]
      },
      {
        subtitle: "Numerical Type Questions:",
        points: ["No negative marking."]
      }
    ]
  }
];

export function TestInfo() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [testName, setTestName] = useState("Mock Test");
  const [pointsPerQuestion, setPointsPerQuestion] = useState(4);
  const [negativeMarks, setNegativeMarks] = useState(1);
  const [negativeMarkingEnabled, setNegativeMarkingEnabled] = useState(true);
  // New state for attempts
  const [attempts, setAttempts] = useState<any[]>([]);

  const userId = localStorage.getItem("phone") || "";

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await getTestSeriesByIdForUser(userId, testId!);
        if (response.status && response.data) {
          const data = response.data;

          // Set test details
          setTestName(data.testName || "Mock Test");
          setPointsPerQuestion(data.pointsForCorrectAnswer || 4);
          setNegativeMarks(data.negativeMarks || 1);
          setNegativeMarkingEnabled(data.negativeMarkingEnabled || false);

          // Extract section information from listOfSection
          setSections(data.listOfSection || []);
        }

        if (response.attempts) {
          setAttempts(response.attempts);
        }
      } catch (error) {
        toast.error("Failed to load test information");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (testId) {
      fetchTestData();
    }
  }, [testId, userId]);

  const totalDuration = sections.reduce(
    (sum, row) => sum + (row.sectionDurationInMinutes || 0),
    0
  );
  const totalQuestions = sections.reduce(
    (sum, row) => sum + (row.totalQuestionsSupposedToBeAdded || 0),
    0
  );
  const totalMarks = totalQuestions * pointsPerQuestion;

  // Logic to determine button state
  const inProgressAttempt = attempts.find(a => a.status === "IN_PROGRESS");

  // Handler for Start/Resume button
  const handleMainAction = () => {
    if (inProgressAttempt) {
      // Resume
      navigate(`/take-test/${testId}`, { state: { attemptId: inProgressAttempt.attemptId, isResume: true } });
    } else {
      // Start New
      navigate(`/take-test/${testId}`); // TakeTest will handle creation
    }
  };

  const handleAnalysis = (attemptId: string) => {
    navigate(`/t/analysis/${testId}/${attemptId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading test information...</p>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-24 w-full mx-auto max-w-7xl h-full flex flex-col items-center gap-4 px-3 pb-24">
      <h1 className="text-(text-app-primary) font-semibold text-[1rem] md:text-2xl">
        {testName}
      </h1>

      <div className="w-full max-w-[800px] lg:max-w-[1200px] border border-t-0 border-[#E4E8EC] rounded-2xl bg-white overflow-hidden">
        {/* HEADER */}
        <div className="grid grid-cols-4 gap-x-4 lg:gap-x-12 bg-[#F8F9FA] text-center text-(--text-muted) rounded-tr-[15px] rounded-tl-[15px] rounded-b-2xl">
          {["Section", "No. of Question", "Duration", "Marks"].map((h, idx) => (
            <div
              key={h}
              className={`px-3 py-4 font-normal text-xs md:text-base ${idx === 0 ? "text-left pl-6 md:pl-10" : ""
                }`}
            >
              {h}
            </div>
          ))}
        </div>

        {/* BODY */}
        {sections?.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-4 gap-x-4 lg:gap-x-12 text-center"
          >
            <div className="px-3 py-4 font-semibold text-xs md:text-base text-left pl-6 md:pl-10">
              {row.sectionName}
            </div>
            <div className="px-3 py-4 font-semibold text-xs md:text-base">
              {row.totalQuestionsSupposedToBeAdded}
            </div>
            <div className="px-3 py-4 font-semibold text-xs md:text-base">
              {row.sectionDurationInMinutes} mins
            </div>
            <div className="px-3 py-4 font-semibold text-xs md:text-base">
              {/* Show marking per section if different, otherwise implied global */}
              {row.pointsForCorrectAnswer ? `+${row.pointsForCorrectAnswer}` : `+${pointsPerQuestion}`}
            </div>
          </div>
        ))}

        {/* SUMMARY */}
        <div className="border-t border-[#E4E8EC]">
          <div className="px-6 md:px-10 py-4">
            <div className="flex gap-4 md:gap-10 flex-wrap">
              <div className="flex flex-col md:flex-row md:gap-2">
                <p className="text-xs font-normal md:text-sm text-(--text-muted)">
                  Total Time:
                </p>
                <p className="text-sm font-semibold md:text-[1rem] text-(--text-app-primary)">
                  {totalDuration} mins
                </p>
              </div>

              <div className="flex flex-col md:flex-row md:gap-2">
                <p className="text-xs font-normal md:text-sm text-(--text-muted)">
                  Total Marks:
                </p>
                <p className="text-sm font-semibold md:text-[1rem] text-(--text-app-primary)">
                  {totalMarks}
                </p>
              </div>

              <div className="flex flex-col md:flex-row md:gap-2">
                <p className="text-xs font-normal md:text-sm text-(--text-muted)">
                  Marking Scheme:
                </p>
                <p className="text-sm font-semibold md:text-[1rem] text-(--text-app-primary)">
                  {/* Simplification: mostly global, but if sections differ, maybe just show global default or "Variable" */}
                  +{pointsPerQuestion} {negativeMarkingEnabled ? `/ -${negativeMarks}` : '/ No negative'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Previous Attempts Section */}
      {attempts.length > 0 && (
        <div className="w-full max-w-[800px] lg:max-w-[1200px] mt-2">
          <h2 className="text-(--text-app-primary) font-semibold text-lg md:text-xl mb-3 pl-2">
            Previous Attempts
          </h2>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white border border-[#E4E8EC] rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Date/Time</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Score</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attempts.map((attempt) => (
                  <tr
                    key={attempt.attemptId}
                    className="hover:bg-gray-50/80 cursor-pointer transition-colors"
                    onClick={() => {
                      if (attempt.status === 'SUBMITTED') handleAnalysis(attempt.attemptId);
                      else handleMainAction();
                    }}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(attempt.attemptDateAndTime.seconds * 1000).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${attempt.status === 'SUBMITTED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {attempt.status === 'SUBMITTED' ? 'Completed' : 'In Progress'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-gray-900">
                        {attempt.status === 'SUBMITTED' ? `${attempt.score}/${attempt.maxScore}` : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {attempt.status === 'SUBMITTED' ? (
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline">
                          View Analysis
                        </button>
                      ) : (
                        <button className="text-orange-600 hover:text-orange-800 text-sm font-medium hover:underline">
                          Resume Test
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {attempts.map((attempt) => (
              <div
                key={attempt.attemptId}
                className="bg-white border border-[#E4E8EC] rounded-xl p-4 shadow-sm active:bg-gray-50 cursor-pointer"
                onClick={() => {
                  if (attempt.status === 'SUBMITTED') handleAnalysis(attempt.attemptId);
                  else handleMainAction();
                }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(attempt.attemptDateAndTime.seconds * 1000).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(attempt.attemptDateAndTime.seconds * 1000).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${attempt.status === 'SUBMITTED'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {attempt.status === 'SUBMITTED' ? 'Completed' : 'In Progress'}
                  </span>
                </div>

                <div className="flex justify-between items-end border-t border-gray-100 pt-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Score</p>
                    <p className="text-xl font-bold text-gray-900">
                      {attempt.status === 'SUBMITTED' ? `${attempt.score}/${attempt.maxScore}` : '-'}
                    </p>
                  </div>
                  {attempt.status === 'SUBMITTED' ? (
                    <span className="text-blue-600 text-sm font-medium">View Analysis →</span>
                  ) : (
                    <span className="text-orange-600 text-sm font-medium">Resume Test →</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General Instructions Section */}
      <div className="w-full max-w-[800px] lg:max-w-[1200px] mt-2 mb-16">
        <h2 className="text-(--text-app-primary) font-semibold text-lg md:text-2xl mb-2 text-center">
          General Instructions
        </h2>

        <div className="p-6 md:p-8 space-y-6">
          {generalInstructions.map((instruction) => (
            <div key={instruction.id} className="text-left">
              <h3 className="font-medium text-base md:text-[1.25rem] text-(--text-app-primary) mb-3">
                {instruction.id}. {instruction.title}
              </h3>

              {instruction.description && (
                <p className="text-sm md:text-base text-(--text-app-primary) mb-2 ml-4 font-normal">
                  {instruction.description}
                </p>
              )}

              {instruction.points && (
                <ul className="ml-8 space-y-2">
                  {instruction.points.map((point, idx) => (
                    <li key={idx} className="text-sm md:text-base text-(--text-app-primary) list-disc font-normal">
                      {typeof point === 'string' ? (
                        point
                      ) : (
                        <div className="flex items-start gap-2">
                          {point.icon && (
                            <span className={`inline-block w-3 h-3 rounded-full mt-1 ${point.icon === 'blue-circle' ? 'bg-blue-500' :
                              point.icon === 'green-circle' ? 'bg-green-500' :
                                point.icon === 'red-circle' ? 'bg-red-500' :
                                  point.icon === 'gray-circle' ? 'bg-[#EAEDF0]' : ''
                              }`}></span>
                          )}
                          <span>{point.text}</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {instruction.steps && (
                <div className="ml-4 space-y-2">
                  {instruction.steps.map((step, idx) => (
                    <div key={idx} className={`flex gap-2 text-sm md:text-base ${step.isWarning ? 'text-yellow-600 font-medium' : 'text-(--text-app-primary) font-normal'
                      }`}>
                      <span className="font-semibold">{step.label}</span>
                      <span>{step.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {instruction.footer && (
                <div className="ml-4 mt-3">
                  <p className="text-sm md:text-base text-(--text-app-primary) mb-2 font-medium">
                    {instruction.footer}
                  </p>
                  <ul className="ml-4 space-y-1">
                    {instruction.footerPoints?.map((point, idx) => (
                      <li key={idx} className="text-sm md:text-base text-(--text-app-primary) list-disc font-normal">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {instruction.sections && (
                <div className="ml-4 space-y-3">
                  {instruction.sections.map((section, idx) => (
                    <div key={idx}>
                      <p className="font-semibold text-sm md:text-base text-(--text-app-primary) mb-2">
                        {section.subtitle}
                      </p>
                      <ul className="ml-4 space-y-1">
                        {section.points.map((point, pointIdx) => (
                          <li key={pointIdx} className="text-sm md:text-base text-(--text-app-primary) list-disc font-normal">
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 flex
              items-center justify-center w-full bg-white border-t 
              py-2.5 px-5 border-[#D6D6D6] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.15)]
              z-50 rounded-tr-xl rounded-tl-xl"
      >
        <button
          onClick={handleMainAction}
          className="bg-(--btn-primary) w-full md:w-auto md:min-w-[166px] py-2.5 px-6 text-white font-medium text-xs md:text-lg shadow-[0px_2px_4px_0px_#FA660F33] rounded-[12px] md:rounded-2xl cursor-pointer hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          {inProgressAttempt ? "Resume Test" : "Start Test"}
        </button>
      </div>
    </div>
  );
}
