import { cn } from "@/lib/utils";

interface CheckoutLayoutProps {
  form: React.ReactNode;
  summary: React.ReactNode;
  className?: string;
}

export default function CheckoutLayout({ form, summary, className }: CheckoutLayoutProps) {
  return (
    <div className={cn("max-w-7xl mx-auto px-6 md:px-12 py-12 mt-24", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        <div className="flex flex-col gap-6">{form}</div>
        <aside className="lg:sticky lg:top-28 flex flex-col gap-4">{summary}</aside>
      </div>
    </div>
  );
}
