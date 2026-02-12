import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-background pb-0">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-linear-to-t from-primary/30 via-primary/10 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 pt-12 sm:px-6">
        <div className="mb-10 flex flex-col items-center gap-4 sm:mb-16 sm:flex-row sm:justify-between">
          <Link
            className="font-mono text-muted-foreground text-xs uppercase tracking-widest transition-colors hover:text-foreground"
            href="/about"
          >
            About
          </Link>

          <p className="font-mono text-[10px] text-muted-foreground/50 uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} Bitwork Network
          </p>

          <Link
            className="font-mono text-muted-foreground text-xs uppercase tracking-widest transition-colors hover:text-foreground"
            href="/contact"
          >
            Contact
          </Link>
        </div>

        <h2 className="pb-1 text-center font-serif text-[14vw] text-foreground/80 leading-[0.85] tracking-tight sm:text-[12vw]">
          BITWORK
        </h2>
      </div>
    </footer>
  );
}
