import { cn } from "@/lib/utils";

export function FlowDiagram({
  steps,
  className,
}: {
  steps: string[];
  className?: string;
}) {
  return (
    <ol className={cn("flex flex-col items-center gap-0", className)} role="list">
      {steps.map((step, i) => (
        <li key={step} className="flex w-full flex-col items-center">
          <div className="panel w-full max-w-sm px-5 py-3.5 text-center text-sm font-semibold tracking-[0.16em] text-foreground uppercase">
            {step}
          </div>
          {i < steps.length - 1 && (
            <span aria-hidden="true" className="flow-line my-2 block h-8 w-0.5" />
          )}
        </li>
      ))}
    </ol>
  );
}
