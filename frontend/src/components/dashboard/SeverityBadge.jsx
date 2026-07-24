import { SEVERITY_STYLES } from "../../utils/constants.js";

export default function SeverityBadge({ severity }) {
  const style = SEVERITY_STYLES[severity] || SEVERITY_STYLES.LOW;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      <span className={style.text}>{severity}</span>
    </span>
  );
}
