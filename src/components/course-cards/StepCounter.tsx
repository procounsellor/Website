
type StepperProps = {
  currentStep: number; // 1, 2, 3
};

export default function Stepper({ currentStep }: StepperProps) {
  const circleClass = (stepId: number) => {
    const isCompleted = stepId < currentStep;
    const isCurrent = stepId === currentStep;

    if (isCompleted) {
      return "bg-[#13097D] border-[#13097D] text-white";
    }
    if (isCurrent) {
      return "border-[#13097D] text-[#13097D] bg-white";
    }
    return "border-gray-300 text-gray-400 bg-gray-100";
  };

  const lineClass = (fromStep: number) => {
    // line from `fromStep` to `fromStep + 1`
    return fromStep < currentStep
      ? "bg-[#13097D]"
      : "bg-gray-300";
  };

  return (
    <div className="w-full max-w-[693px] mx-auto px-2 md:px-0">
      {/* row: circles + connecting lines */}
      <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-center w-full">
        {/* step 1 circle */}
        <div className="flex justify-center">
          <div
            className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center text-xs md:text-sm font-semibold ${circleClass(
              1
            )}`}
          >
            1
          </div>
        </div>

        {/* line 1–2 */}
        <div className="flex items-center">
          <div className={`w-full h-[2px] md:h-[3px] ${lineClass(1)}`} />
        </div>

        {/* step 2 circle */}
        <div className="flex justify-center">
          <div
            className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center text-xs md:text-sm font-semibold ${circleClass(
              2
            )}`}
          >
            2
          </div>
        </div>

        {/* line 2–3 */}
        <div className="flex items-center">
          <div className={`w-full h-[2px] md:h-[3px] ${lineClass(2)}`} />
        </div>

        {/* step 3 circle */}
        <div className="flex justify-center">
          <div
            className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center text-xs md:text-sm font-semibold ${circleClass(
              3
            )}`}
          >
            3
          </div>
        </div>
      </div>

      {/* row: labels centered under each node */}
      <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] mt-2 w-full">
        <p className={`text-[0.625rem] md:text-[1rem] font-medium ${currentStep===1? 'text-[#13097D]':''} text-center justify-self-center col-start-1`}>
          Basic Information
        </p>
        <p className={`text-[0.625rem] md:text-[1rem] font-medium ${currentStep===2? 'text-[#13097D]':''} text-center justify-self-center col-start-3`}>
          Edit Price
        </p>
        <p className={`text-[0.625rem] md:text-[1rem] font-medium ${currentStep===3? 'text-[#13097D]':''} text-center justify-self-center col-start-5`}>
          Add Content
        </p>
      </div>
    </div>
  );
}
