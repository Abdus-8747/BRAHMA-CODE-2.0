import { Brain, Zap, Shield, Sparkles, Layers, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Brain,
    color: "text-violet-600",
    bg: "bg-violet-100",
    border: "border-violet-200",
    title: "AI-Powered Insights",
    description: "Intelligent suggestions that help you connect the dots between scattered thoughts.",
  },
  {
    icon: Zap,
    color: "text-amber-600",
    bg: "bg-amber-100",
    border: "border-amber-200",
    title: "Lightning Fast",
    description: "Built for speed. Zero latency interactions so your flow state is never interrupted.",
  },
  {
    icon: Layers,
    color: "text-blue-600",
    bg: "bg-blue-100",
    border: "border-blue-200",
    title: "Structured Workflows",
    description: "Turn chaos into order with flexible workspaces adapted to your thinking style.",
  },
  {
    icon: Shield,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    border: "border-emerald-200",
    title: "Private & Secure",
    description: "Enterprise-grade encryption ensures your thoughts remain strictly yours.",
  },
  {
    icon: BarChart3,
    color: "text-pink-600",
    bg: "bg-pink-100",
    border: "border-pink-200",
    title: "Progress Analytics",
    description: "Visual insights into your productivity patterns and focus time.",
  },
  {
    icon: Sparkles,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    title: "Smart Automation",
    description: "Automate the mundane. Let AI handle tagging, sorting, and reminders.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="container mx-auto px-6 py-24">
      <div className="mb-20 text-center">
        <h2 className="text-3xl font-black tracking-tight text-foreground sm:text-5xl">
          Everything you need to <span className="text-primary">excel</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-muted-foreground">
          Powerful tools wrapped in a clean, distraction-free interface.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`group relative rounded-[2rem] border-2 ${feature.border} bg-white p-8 transition-all hover:shadow-lg hover:shadow-slate-200`}
          >
            <div className={`mb-6 inline-flex size-14 items-center justify-center rounded-2xl ${feature.bg} ${feature.color}`}>
              <feature.icon className="size-7" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-slate-900">{feature.title}</h3>
            <p className="font-medium leading-relaxed text-slate-500">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}