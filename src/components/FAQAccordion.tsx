import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export interface FAQItem {
  question: string;
  answer: string | ReactNode;
}

interface Props {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="bg-white rounded-xl border border-[#E2E6ED] overflow-hidden">
          <button onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F4F6F9] transition-colors"
            aria-expanded={open === i}>
            <span className="font-semibold text-[#1A1A2E] text-sm sm:text-base pr-4">{item.question}</span>
            <ChevronDown className={`w-4 h-4 text-[#6B7280] flex-shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && (
            <div className="px-5 pb-4">
              {typeof item.answer === "string" ? (
                <p className="text-[#6B7280] text-sm leading-relaxed">{item.answer}</p>
              ) : (
                <div className="text-[#6B7280] text-sm leading-relaxed">{item.answer}</div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
