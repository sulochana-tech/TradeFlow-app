import { Globe, ArrowRightLeft, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const rates = [
  { from: "USD", to: "NPR", rate: "134.25", change: "+0.32%", flag: "🇳🇵", trend: "up" },
  { from: "USD", to: "EUR", rate: "0.92", change: "-0.15%", flag: "🇪🇺", trend: "down" },
  { from: "USD", to: "GBP", rate: "0.79", change: "+0.08%", flag: "🇬🇧", trend: "up" },
  { from: "USD", to: "JPY", rate: "149.85", change: "-0.42%", flag: "🇯🇵", trend: "down" },
  { from: "USD", to: "AED", rate: "3.67", change: "0.00%", flag: "🇦🇪", trend: "up" },
  { from: "USD", to: "INR", rate: "83.12", change: "+0.18%", flag: "🇮🇳", trend: "up" },
  { from: "USD", to: "CNY", rate: "7.24", change: "-0.22%", flag: "🇨🇳", trend: "down" },
  { from: "USD", to: "THB", rate: "35.42", change: "+0.45%", flag: "🇹🇭", trend: "up" },
];

export default function Currency() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Currency Converter</h1>
        <p className="text-muted-foreground text-sm">Real-time exchange rates & conversion</p>
      </div>

      <Card className="gradient-primary text-primary-foreground">
        <CardContent className="p-6">
          <p className="text-primary-foreground/70 text-sm mb-4">Quick Convert</p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <label className="text-xs text-primary-foreground/60 mb-1 block">From</label>
              <div className="bg-primary-foreground/10 rounded-lg p-3 flex items-center gap-3">
                <span className="text-lg">🇺🇸</span>
                <div className="flex-1">
                  <p className="text-xs text-primary-foreground/60">USD</p>
                  <p className="text-xl font-bold">1,000.00</p>
                </div>
              </div>
            </div>
            <div className="p-2 rounded-full bg-primary-foreground/10">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
            <div className="flex-1 w-full">
              <label className="text-xs text-primary-foreground/60 mb-1 block">To</label>
              <div className="bg-primary-foreground/10 rounded-lg p-3 flex items-center gap-3">
                <span className="text-lg">🇳🇵</span>
                <div className="flex-1">
                  <p className="text-xs text-primary-foreground/60">NPR</p>
                  <p className="text-xl font-bold">134,250.00</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-primary-foreground/50 mt-3">1 USD = 134.25 NPR • Updated 2 min ago</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Live Exchange Rates (Base: USD)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {rates.map((r, i) => (
              <div key={i} className="p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{r.flag}</span>
                    <span className="text-sm font-medium">{r.to}</span>
                  </div>
                  {r.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <p className="text-xl font-bold">{r.rate}</p>
                <p className={`text-xs ${r.trend === "up" ? "text-success" : "text-destructive"}`}>{r.change}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
