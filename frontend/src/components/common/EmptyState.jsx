export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-raised border border-border">
          <Icon size={22} className="text-ink-faint" strokeWidth={1.5} />
        </div>
      )}
      <p className="font-display font-medium text-ink">{title}</p>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-ink-muted">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
