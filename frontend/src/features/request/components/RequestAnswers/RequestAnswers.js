export function RequestAnswers({ answers = [], compact = false }) {
  if (answers.length === 0) return null;

  return (
    <ul className={compact ? "space-y-2" : "space-y-4"}>
      {answers.map((answer) => (
        <li
          key={answer.question}
          className={
            compact
              ? "rounded-xl border border-gray-100 bg-[#FCFBFD] p-4"
              : "flex w-full flex-col items-start justify-between rounded-lg bg-white p-4 shadow md:flex-row md:items-center"
          }
        >
          <div className="flex flex-col">
            <span className="text-sm text-gray-700">{answer.question}</span>
            {answer.options?.length > 0 && (
              <span className="text-xs text-gray-500">Seçenekler: {answer.options.join(", ")}</span>
            )}
          </div>
          <span className="mt-2 text-sm font-medium text-[rgb(78,36,77)] md:mt-0">
            Seçilen: {answer.selected}
          </span>
        </li>
      ))}
    </ul>
  );
}
