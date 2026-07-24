const VARIANTS = {
  primary:
    "bg-accent text-white hover:bg-accent-hover focus-visible:outline-accent",
  secondary:
    "bg-surface-raised text-ink border border-border hover:bg-surface-hover",
  ghost: "text-ink-muted hover:text-ink hover:bg-surface-hover",
  danger: "bg-severity-critical/10 text-severity-critical hover:bg-severity-critical/20 border border-severity-critical/30",
};

const SIZES = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  className = "",
  disabled = false,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 16} strokeWidth={2} />}
      {children}
    </button>
  );
}
