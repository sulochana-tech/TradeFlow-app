import { Truck, Package, MapPin, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/StatCard";

const shipments = [
  { id: "SHP-4821", route: "Shanghai → New York", carrier: "DHL Express", eta: "Apr 18", status: "in_transit", progress: 65 },
  { id: "SHP-4820", route: "São Paulo → Berlin", carrier: "FedEx", eta: "Apr 16", status: "in_transit", progress: 80 },
  { id: "SHP-4819", route: "Bangkok → Tokyo", carrier: "UPS", eta: "Apr 15", status: "customs", progress: 50 },
  { id: "SHP-4818", route: "Istanbul → Dubai", carrier: "Aramex", eta: "Apr 14", status: "delivered", progress: 100 },
  { id: "SHP-4817", route: "Milan → Paris", carrier: "DHL Express", eta: "Apr 20", status: "processing", progress: 15 },
];

const statusStyles: Record<string, string> = {
  in_transit: "bg-accent/10 text-accent",
  customs: "bg-warning/10 text-warning",
  delivered: "bg-success/10 text-success",
  processing: "bg-muted text-muted-foreground",
};

const shippingRules = [
  { country: "🇺🇸 USA", restricted: "Certain spices, animal products", tax: "2.5-25%", docs: "FDA certificate, USDA permit" },
  { country: "🇩🇪 Germany", restricted: "Leather goods, some textiles", tax: "0-19%", docs: "CE marking, EUR.1" },
  { country: "🇯🇵 Japan", restricted: "Rice, dairy products", tax: "0-30%", docs: "JAS certification" },
  { country: "🇦🇪 UAE", restricted: "Alcohol, pork products", tax: "5% VAT", docs: "Halal certificate" },
];

export default function Shipping() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Shipping & Logistics</h1>
        <p className="text-muted-foreground text-sm">Track shipments and manage logistics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Shipments" value="12" change="3 arriving today" changeType="positive" icon={Truck} />
        <StatCard title="In Customs" value="2" change="Awaiting clearance" changeType="neutral" icon={Package} />
        <StatCard title="Avg Delivery" value="5.2 days" change="-0.8 days improvement" changeType="positive" icon={Clock} />
        <StatCard title="Issues" value="1" change="Customs hold" changeType="negative" icon={AlertTriangle} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Shipment Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shipments.map((s) => (
              <div key={s.id} className="p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-medium">{s.id}</span>
                      <Badge variant="secondary" className={statusStyles[s.status]}>{s.status.replace("_", " ")}</Badge>
                    </div>
                    <p className="text-sm mt-1">{s.route}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">{s.carrier}</span> • ETA: {s.eta}
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gradient-accent rounded-full transition-all" style={{ width: `${s.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" /> Country Shipping Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="text-left p-3 font-medium">Country</th>
                  <th className="text-left p-3 font-medium">Restricted Items</th>
                  <th className="text-left p-3 font-medium">Import Tax</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Required Docs</th>
                </tr>
              </thead>
              <tbody>
                {shippingRules.map((r, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="p-3 text-sm font-medium">{r.country}</td>
                    <td className="p-3 text-sm text-muted-foreground">{r.restricted}</td>
                    <td className="p-3 text-sm">{r.tax}</td>
                    <td className="p-3 text-sm text-muted-foreground hidden md:table-cell">{r.docs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
