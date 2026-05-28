import { FaqItem } from "@/components/molecules/faq-item";
import { cn } from "@/lib/utils";

export interface FaqData {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  faqs: FaqData[];
  className?: string;
}

export function FaqSection({ faqs, className }: FaqSectionProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <h2 className="text-xl font-semibold">Preguntas Frecuentes</h2>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <FaqItem 
            key={index} 
            question={faq.question} 
            answer={faq.answer}
            defaultOpen={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
