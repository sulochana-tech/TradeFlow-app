import { BarChart3, TrendingUp, Globe, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";

const trendingProducts = [
  { name: "Organic Turmeric", demand: 92, growth: "+34%", countries: 12 },
  { name: "Handwoven Silk", demand: 87, growth: "+28%", countries: 8 },
  { name: "Himalayan Salt", demand: 85, growth: "+22%", countries: 15 },
  { name: "Cashew Nuts", demand: 78, growth: "+19%", countries: 10 },
  { name: "Brass Crafts", demand: 72, growth: "+15%", countries: 6 },
];

const topCountries = [
  { name: "🇺🇸 United States", trades: 1240, volume: "$2.4M", growth: "+18%" },
  { name: "🇩🇪 Germany", trades: 890, volume: "$1.8M", growth: "+12%" },
  { name: "🇯🇵 Japan", trades: 756, volume: "$1.5M", growth: "+22%" },
  { name: "🇦🇪 UAE", trades: 620, volume: "$1.2M", growth: "+15%" },
  { name: "🇬🇧 United Kingdom", trades: 540, volume: "$980K", growth: "+8%" },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Market Insights</h1>
        <p className="text-muted-foreground text-sm">Analytics, trends, and competition analysis</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Trades" value="4,046" change="+15% this month" changeType="positive" icon={BarChart3} />
        <StatCard title="Active Markets" value="42" change="3 new countries" changeType="positive" icon={Globe} />
        <StatCard title="Total Traders" value="12,847" change="+284 this week" changeType="positive" icon={Users} />
        <StatCard title="Avg Growth" value="+18.2%" change="vs last quarter" changeType="positive" icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Trending Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendingProducts.map((p, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-success text-xs">{p.growth} • {p.countries} countries</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full gradient-accent rounded-full" style={{ width: `${p.demand}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top Trading Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCountries.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.trades} trades</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{c.volume}</p>
                    <p className="text-xs text-success">{c.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
