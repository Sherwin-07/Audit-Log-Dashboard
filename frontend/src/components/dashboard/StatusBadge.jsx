import { STATUS_STYLES } from "../../utils/constants.js";

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Unresolved;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-2 py-0.5 text-[11px] font-medium ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}
