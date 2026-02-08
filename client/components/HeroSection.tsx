import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center bg-background px-6 pt-16 text-center">
      <div className="z-10 max-w-5xl space-y-8">
        
        {/* Pill Badge - Solid Blue Border */}
        <div className="inline-flex items-center rounded-full border-2 border-blue-600/20 bg-white px-4 py-1.5 text-sm font-bold text-blue-600 shadow-sm">
          <Sparkles className="mr-2 size-4" />
          <span>The Future of Thought Productivity</span>
        </div>

        {/* Main Headline - Manual Deep Navy-Blue */}
        <h1 className="text-5xl font-black tracking-tighter text-[#0f172a] sm:text-7xl md:text-8xl">
          Clarity for your <br />
          <span className="text-blue-600">Chaotic Mind</span>
        </h1>

        {/* Subheadline - Manual Muted Blue-Gray */}
        <p className="mx-auto max-w-2xl text-lg font-medium text-[#475569] sm:text-xl md:text-2xl">
          Organize ideas, manage tasks, and achieve flow state with an intelligent minimalist workspace.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/auth/signup">
            <Button size="lg" className="h-14 min-w-[220px] rounded-2xl bg-blue-600 text-white text-lg font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-transform active:scale-95">
              Get Started Free
              <ArrowRight className="ml-2 size-5" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="h-14 min-w-[220px] rounded-2xl border-2 border-blue-100 text-[#1e293b] text-lg font-bold hover:bg-blue-50 transition-all">
              See How It Works
            </Button>
          </Link>
        </div>

        {/* Social Proof - Manual Steel Blue */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-[#64748b]">
          <div className="flex items-center gap-2">
            <CheckCircle className="size-4 text-emerald-500" />
            <span>NO CREDIT CARD</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="size-4 text-emerald-500" />
            <span>14-DAY TRIAL</span>
          </div>
        </div>
      </div>
    </section>
  );
}