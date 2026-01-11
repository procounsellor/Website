interface QuestionTableProps {
  data: any[];
  onView?: (questionId: string) => void;
  onEdit?: (questionId: string, sectionName: string) => void;
  onDelete?: (questionId: string, sectionName: string) => void;
}

export function QuestionTable({ data, onView, onEdit, onDelete }: QuestionTableProps) {
  return (
    <div className="w-full">
      <table className="w-full border-collapse">
        {/* HEADER */}
        <thead>
          <tr className="bg-(--btn-primary)/10">
            <th className="px-4 py-3 text-left font-medium text-sm text-(--btn-primary) w-[50%]">
              Question
            </th>
            <th className="px-4 py-3 text-left font-medium text-sm text-(--btn-primary) w-[15%]">
              Type
            </th>
            <th className="px-4 py-3 text-left font-medium text-sm text-(--btn-primary) w-[15%]">
              Category
            </th>
            <th className="px-4 py-3 text-left font-medium text-sm text-(--btn-primary) w-[20%]">
              Actions
            </th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-sm text-(--text-muted)">
                No questions added yet. Create your first question above.
              </td>
            </tr>
          ) : (
            data.map((q: any) => (
              <tr
                key={q.questionId}
                className="border-b border-[#E8EAED] hover:bg-gray-50"
              >
                {/* Question */}
                <td className="px-3 py-3 text-sm font-medium text-(--text-app-primary)">
                  {q.questionText}
                </td>

                {/* Type */}
                <td className="px-3 py-3 text-sm font-medium text-(--text-app-primary)">
                  {q.type}
                </td>

                {/* Category */}
                <td className="px-3 py-3 text-sm font-medium text-(--text-app-primary) capitalize">
                  {q.sectionName}
                </td>

                {/* Actions */}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => onView?.(q.questionId)}
                      className="hover:opacity-80 cursor-pointer"
                    >
                      <img src="/eye.svg" alt="View" className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onEdit?.(q.questionId, q.sectionName)}
                      className="hover:opacity-80 cursor-pointer"
                    >
                      <img src="/pencil.svg" alt="Edit" className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onDelete?.(q.questionId, q.sectionName)}
                      className="hover:opacity-80 cursor-pointer"
                    >
                      <img src="/delete.svg" alt="Delete" className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
