interface EmptyStateProps {
  title: string;
  description?: string;
}

function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="py-16 text-center">
      <h2 className="text-2xl font-semibold">
        {title}
      </h2>

      {description && (
        <p className="mt-2 text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

export default EmptyState;