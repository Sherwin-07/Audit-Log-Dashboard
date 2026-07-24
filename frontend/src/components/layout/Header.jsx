import { ShieldHalf, UploadCloud } from "lucide-react";
import Button from "../common/Button.jsx";

export default function Header({ onUploadClick, total }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-muted">
            <ShieldHalf size={17} className="text-accent" strokeWidth={2} />
          </div>
          <div>
            <h1 className="font-display text-[15px] font-semibold leading-none text-ink">
              Audit Log Dashboard
            </h1>
            <p className="mt-1 text-xs text-ink-muted">
              {typeof total === "number"
                ? `${total.toLocaleString()} records tracked`
                : "System activity & security events"}
            </p>
          </div>
        </div>
        <Button icon={UploadCloud} onClick={onUploadClick}>
          Upload logs
        </Button>
      </div>
    </header>
  );
}
