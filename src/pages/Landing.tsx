import { ArrowRight, ShieldCheck, Truck, BarChart3, Zap, Users, Globe, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

const features = [
  { icon: Globe, title: "Global Marketplace", desc: "Connect with verified traders from 190+ countries. Buy and sell products worldwide." },
  { icon: ShieldCheck, title: "Secure Escrow Payments", desc: "Your money is protected until delivery is confirmed. Multi-currency support included." },
  { icon: Truck, title: "Smart Logistics", desc: "Track shipments in real-time with integrated logistics partners worldwide." },
  { icon: BarChart3, title: "AI-Powered Insights", desc: "Get market trends, pricing recommendations, and demand forecasts powered by AI." },
  { icon: Zap, title: "Instant Communication", desc: "Real-time chat with auto-translation. Break language barriers in international trade." },
  { icon: Users, title: "Trusted Network", desc: "Verified businesses with ratings, reviews, and trust scores for safe trading." },
];

const stats = [
  { value: "190+", label: "Countries" },
  { value: "$2.4B", label: "Trade Volume" },
  { value: "50K+", label: "Traders" },
  { value: "99.9%", label: "Uptime" },
];

const steps = [
  { n: "01", title: "Create your profile", desc: "Sign up free, verify your business, and set up your storefront in minutes." },
  { n: "02", title: "List or discover products", desc: "Publish your catalogue or browse 50,000+ verified products from across the globe." },
  { n: "03", title: "Trade with confidence", desc: "Pay through secure escrow, ship via integrated carriers, and grow with AI insights." },
];

const testimonials = [
  { name: "Amara O.", role: "Textile Exporter, Lagos", quote: "TradeFlow opened doors to 12 new markets in 6 months. The AI assistant is a game-changer." },
  { name: "Liu W.", role: "Electronics Wholesaler, Shenzhen", quote: "Escrow payments removed all the friction. I trust every order, every time." },
  { name: "Sofia M.", role: "Specialty Coffee, Bogotá", quote: "The shipping suggestions saved us 23% on logistics in the first quarter alone." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar — 60% white */}
      <nav className="border-b border-border bg-background/85 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="lg" />
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/auth/signin">Sign In</Link>
            </Button>
            <Button className="gradient-primary text-primary-foreground" asChild>
              <Link to="/auth/signup">Get Started <ArrowRight className="h-4 w-4 ml-1" /></Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero — soft blue/violet wash on white */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-6">
              <Zap className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent-foreground/90">The Future of Global Trade</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              Trade Globally,{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Grow Fearlessly
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              TradeFlow connects buyers and sellers worldwide with secure escrow payments,
              AI-powered insights, and integrated logistics — all in one platform.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="gradient-primary text-primary-foreground text-base px-8 shadow-lg shadow-primary/20" asChild>
                <Link to="/auth/signup">Start Trading Free <ArrowRight className="h-5 w-5 ml-2" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 border-primary/30 hover:bg-primary/5" asChild>
                <Link to="/auth/signin">Sign In</Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> No credit card</span>
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> Free forever plan</span>
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> 2-min setup</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats — light blue strip (30%) */}
      <section className="bg-secondary border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — white (60%) */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">Features</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">Everything You Need to Trade Globally</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">One platform for marketplace, payments, logistics, and analytics.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group relative bg-card rounded-2xl border border-border p-6 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                    i % 3 === 2 ? "gradient-accent" : "gradient-primary"
                  }`}
                >
                  <f.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — soft blue (30%) */}
      <section id="how" className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-wider text-accent uppercase">How it works</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">From signup to global trade in 3 steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="bg-background rounded-2xl border border-border p-8 relative overflow-hidden">
                <span className="absolute -top-4 -right-2 text-7xl font-extrabold text-primary/5 select-none">{s.n}</span>
                <div className="relative">
                  <span className="text-sm font-bold text-primary">{s.n}</span>
                  <h3 className="mt-3 text-xl font-semibold text-foreground">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — white */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">Loved by traders</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-foreground">Trusted across continents</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed">"{t.quote}"</p>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — violet accent (10%) */}
      <section id="pricing" className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl gradient-primary p-12 md:p-16 text-center shadow-2xl shadow-primary/20">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/30 rounded-full blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">Ready to Go Global?</h2>
              <p className="mt-4 text-primary-foreground/85 text-lg max-w-2xl mx-auto">
                Join thousands of traders already growing their international business with TradeFlow.
              </p>
              <Button size="lg" variant="secondary" className="mt-8 text-base px-8 bg-background text-primary hover:bg-background/90" asChild>
                <Link to="/auth/signup">Create Free Account <ArrowRight className="h-5 w-5 ml-2" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo size="md" />
            <p className="text-sm text-muted-foreground">© 2026 TradeFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
