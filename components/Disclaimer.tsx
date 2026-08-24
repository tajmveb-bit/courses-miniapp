import { AlertTriangle } from "lucide-react";

interface DisclaimerProps {
  text: string;
}

export default function Disclaimer({ text }: DisclaimerProps) {
  return (
    <div className="flex items-start gap-2.5 rounded-3xl bg-beige-light/70 p-3.5">
      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-beige-dark" strokeWidth={1.8} />
      <p className="text-[13px] leading-relaxed text-ink-soft">{text}</p>
    </div>
  );
}
