export function WorkflowSection() {
  const steps = [
    {
      number: "01",
      title: "Post a Task",
      description: "Describe what you need - plumbing, tutoring, design, etc.",
      visual: "note",
    },
    {
      number: "02",
      title: "Browse Providers",
      description: "See verified workers nearby with ratings and work history.",
      visual: "scan",
    },
    {
      number: "03",
      title: "Connect & Agree",
      description: "Chat directly. Fix price, duration, and skills needed.",
      visual: "draft",
    },
    {
      number: "04",
      title: "Work & Verify",
      description: "Task completed. Leave rating. Build trusted reputation.",
      visual: "send",
    },
  ];

  return (
    <section className="bg-secondary/30 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex items-start justify-between">
          <div>
            <span className="font-mono text-muted-foreground text-xs tracking-wider">
              TASK WORKFLOW
            </span>
            <h2 className="mt-4 max-w-md font-serif text-4xl leading-tight md:text-5xl">
              From task to done in four steps.
            </h2>
          </div>
          <p className="hidden max-w-xs text-muted-foreground text-sm md:block">
            Simple, transparent, local. No middlemen, just skill exchange.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {steps.map((step, index) => (
            <div className="relative" key={step.number}>
              <div className="h-full rounded-2xl border border-border bg-card p-6">
                <div className="relative mb-6 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-secondary/50">
                  {step.visual === "note" && (
                    <div className="-rotate-2 rounded border border-amber-100 bg-[#fffef0] p-4 shadow-sm">
                      <p className="font-mono text-muted-foreground text-xs">
                        TASK_POST
                      </p>
                      <p className="mt-1 font-serif text-sm italic">
                        "Fix leaking tap - 30 mins"
                      </p>
                    </div>
                  )}
                  {step.visual === "scan" && (
                    <div className="w-full space-y-2 px-4">
                      <div className="h-2 w-3/4 rounded bg-border" />
                      <div className="h-2 w-full rounded bg-border" />
                      <div className="h-2 w-2/3 rounded bg-border" />
                      <div className="mt-4 flex gap-1">
                        <div className="h-3 w-3 rounded-full bg-accent" />
                        <div className="h-3 flex-1 rounded bg-border" />
                      </div>
                    </div>
                  )}
                  {step.visual === "draft" && (
                    <div className="w-4/5 rounded-lg border border-border bg-card p-3 shadow-sm">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-muted-foreground">
                          CHAT
                        </span>
                        <span className="font-mono text-[10px] text-green-600">
                          AGREED
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="h-1.5 w-full rounded bg-border" />
                        <div className="h-1.5 w-4/5 rounded bg-border" />
                        <div className="h-1.5 w-3/4 rounded bg-border" />
                      </div>
                    </div>
                  )}
                  {step.visual === "send" && (
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 rounded-full bg-accent/50 px-4 py-2">
                        <span className="font-mono text-xs">COMPLETED</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-2 flex items-start justify-between">
                  <span className="font-mono text-muted-foreground text-xs">
                    {step.number}
                  </span>
                </div>
                <h3 className="mb-2 font-medium text-lg">{step.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="absolute top-1/2 -right-3 hidden w-6 border-border border-t border-dashed md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
