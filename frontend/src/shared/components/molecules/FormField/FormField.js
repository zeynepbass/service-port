export function FormField({ id, label, error, hint, children, className = "" }) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": errorId })}
      {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
