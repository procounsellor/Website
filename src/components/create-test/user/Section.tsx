interface SectionProps {
    sectionName: string;
    questions: Array<{
        questionNumber: number;
        status: "NOT_VISITED" | "ATTEMPTED" | "MARKED_FOR_REVIEW" | "CURRENT";
    }>;
    onQuestionClick?: (questionIndex: number) => void;
}

const bgMap = {
    CURRENT: "bg-[#1980E5]",
    ATTEMPTED: "bg-[#21C55D]",
    MARKED_FOR_REVIEW: "bg-[#F69E23]",
    NOT_VISITED: "bg-[#EAEDF0]",
};

export function Section({ sectionName, questions, onQuestionClick }: SectionProps) {
    return (
        <div className="border border-[#D8D8D8] max-w-[314px] rounded-2xl overflow-hidden">
            <h1 className="flex items-center justify-center bg-[#EAEDF0] border-b border-[#D8D8D8] py-2 font-medium text-(--text-app-primary)">
                {sectionName}
            </h1>
            <div className="grid grid-cols-6 p-3 gap-3 bg-white">
                {questions.map((q, i) => {
                    const isCurrent = q.status === "CURRENT";
                    return (
                        <div
                            key={i}
                            onClick={() => onQuestionClick?.(i)}
                            className={`flex items-center justify-center h-8 w-8 ${
                                isCurrent || q.status === "ATTEMPTED"
                                    ? "text-white"
                                    : "text-(--text-muted)"
                            } text-sm font-medium rounded-[8px] ${bgMap[q.status]} cursor-pointer hover:opacity-80 transition-opacity`}
                        >
                            {q.questionNumber}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}