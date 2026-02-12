export function TestimonialsSection() {
  const testimonials = [
    {
      id: "BW-0088",
      quote:
        "I found a local tutor for my son within hours. No middleman, fair price, and we pay directly. Can see her full work history. Very trustworthy.",
      author: "Priya Sharma",
      role: "PARENT & SERVICE SEEKER",
    },
    {
      id: "BW-2301",
      quote:
        "Finally, I can work on my own terms. No shop needed. I post my availability, clients find me, and I keep 95% of what I earn. True independence.",
      author: "Rajesh Kumar",
      role: "ELECTRICIAN & PROVIDER",
    },
    {
      id: "BW-7725",
      quote:
        "As a student, I can now take small design jobs that match my current skills. Build my portfolio while earning. Love that everything is based on real work.",
      author: "Anita Desai",
      role: "STUDENT & LEARNER",
    },
    {
      id: "BW-0030",
      quote:
        "The ratings system is so transparent. Every task done builds my reputation locally. I don't need a business license—the network knows who I am.",
      author: "Vikram Singh",
      role: "MECHANIC & PROVIDER",
    },
    {
      id: "BW-2134",
      quote:
        "No algorithms deciding who I hire. I see real people, real work history, real ratings. Direct connection is the future.",
      author: "Meera Gupta",
      role: "SMALL BUSINESS OWNER",
    },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex items-start justify-between">
          <div>
            <span className="font-mono text-muted-foreground text-xs tracking-wider">
              COMMUNITY STORIES
            </span>
            <h2 className="mt-4 max-w-md font-serif text-4xl leading-tight md:text-5xl">
              People building local economies
            </h2>
          </div>
          <p className="hidden max-w-xs text-muted-foreground text-sm md:block">
            Real voices from India's informal workforce.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial) => (
            <div
              className="rounded-2xl border border-border bg-card p-6"
              key={testimonial.id}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-muted-foreground text-xs">
                  REF
                </span>
                <span className="font-mono text-primary text-xs">
                  {testimonial.id}
                </span>
                <div className="h-12 w-12 rounded-lg bg-secondary" />
              </div>
              <p className="mb-6 text-sm leading-relaxed">
                {testimonial.quote}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{testimonial.author}</p>
                  <p className="font-mono text-muted-foreground text-xs">
                    {testimonial.role}
                  </p>
                </div>
                <div className="flex h-4 w-4 items-center justify-center rounded border border-border">
                  <span className="text-[8px]">↗</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {testimonials.slice(3, 4).map((testimonial) => (
            <div
              className="rounded-2xl border border-border bg-card p-6"
              key={testimonial.id}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-muted-foreground text-xs">
                  REF
                </span>
                <span className="font-mono text-primary text-xs">
                  {testimonial.id}
                </span>
                <div className="h-12 w-12 rounded-lg bg-secondary" />
              </div>
              <p className="mb-6 text-sm leading-relaxed">
                {testimonial.quote}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{testimonial.author}</p>
                  <p className="font-mono text-muted-foreground text-xs">
                    {testimonial.role}
                  </p>
                </div>
                <div className="flex h-4 w-4 items-center justify-center rounded border border-border">
                  <span className="text-[8px]">↗</span>
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-col items-center justify-center rounded-2xl border border-border border-dashed bg-secondary/50 p-6 text-center">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full border border-border">
              <span className="text-lg">+</span>
            </div>
            <span className="font-mono text-muted-foreground text-sm">
              YOUR STORY HERE
            </span>
            <p className="mt-1 text-muted-foreground text-sm">
              Join the archive.
            </p>
          </div>

          {testimonials.slice(4).map((testimonial) => (
            <div
              className="rounded-2xl border border-border bg-card p-6"
              key={testimonial.id}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-muted-foreground text-xs">
                  REF
                </span>
                <span className="font-mono text-primary text-xs">
                  {testimonial.id}
                </span>
                <div className="h-12 w-12 rounded-lg bg-secondary" />
              </div>
              <p className="mb-6 text-sm leading-relaxed">
                {testimonial.quote}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{testimonial.author}</p>
                  <p className="font-mono text-muted-foreground text-xs">
                    {testimonial.role}
                  </p>
                </div>
                <div className="flex h-4 w-4 items-center justify-center rounded border border-border">
                  <span className="text-[8px]">↗</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
