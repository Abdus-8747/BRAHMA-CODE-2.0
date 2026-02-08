import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="container mx-auto px-6 py-24">
      <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 px-6 py-20 text-center text-white shadow-2xl sm:px-12 sm:py-28">
        
        {/* Solid Color Decorative Circles (Instead of Blurs) */}
        <div className="absolute -left-10 -top-10 size-64 rounded-full bg-primary/10" />
        <div className="absolute -right-10 -bottom-10 size-64 rounded-full bg-blue-500/10" />

        <div className="relative z-10 mx-auto max-w-3xl space-y-8">
          <h2 className="text-4xl font-black tracking-tight sm:text-6xl">
            Ready to clarify <br/> your mind?
          </h2>
          <p className="text-xl font-medium text-slate-300">
            Join thousands of creators who trust Examy.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Link href="/auth/signup">
              <Button size="lg" className="h-14 min-w-[200px] rounded-2xl bg-white text-lg font-bold text-slate-900 hover:bg-slate-100 transition-transform active:scale-95">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="h-14 min-w-[200px] rounded-2xl border-2 border-white/20 bg-transparent text-lg font-bold text-white hover:bg-white/10">
                Contact Sales
              </Button>
            </Link>
          </div>

          <p className="text-xs font-black uppercase tracking-widest text-slate-500">
            No credit card needed • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}