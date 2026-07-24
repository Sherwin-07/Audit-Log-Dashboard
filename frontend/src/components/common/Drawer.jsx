import { useEffect } from "react";
import { X } from "lucide-react";

export default function Drawer({ open, onClose, title, subtitle, children }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute right-0 top-0 h-full w-full max-w-md border-l border-border bg-surface shadow-panel
          transition-transform duration-200 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-start justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-base font-semibold text-ink">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-ink-muted">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="rounded-md p-1 text-ink-muted hover:bg-surface-hover hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>
        <div className="h-[calc(100%-65px)] overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
