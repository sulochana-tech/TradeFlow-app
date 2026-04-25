import { Bell, Package, DollarSign, Truck, MessageSquare, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const notifications = [
  { icon: DollarSign, title: "Payment received: $5,200", desc: "From Tokyo Goods Ltd for order TF-2845", time: "5 min ago", read: false, type: "payment" },
  { icon: Package, title: "New order: TF-2848", desc: "Lagos Imports ordered 100kg Organic Tea", time: "15 min ago", read: false, type: "order" },
  { icon: Truck, title: "Shipment delivered", desc: "SHP-4818 successfully delivered to Dubai Luxe", time: "1h ago", read: false, type: "shipping" },
  { icon: MessageSquare, title: "New message from Hans Mueller", desc: "Berlin Trading Co: 'Can you send the invoice?'", time: "2h ago", read: true, type: "chat" },
  { icon: DollarSign, title: "Escrow released: $8,750", desc: "Payment for order TF-2846 released to your wallet", time: "5h ago", read: true, type: "payment" },
  { icon: Package, title: "Order cancelled: TF-2842", desc: "London Crafts cancelled brass statues order", time: "1 day ago", read: true, type: "order" },
  { icon: CheckCircle, title: "KYC verified", desc: "Your business verification is now complete", time: "2 days ago", read: true, type: "system" },
];

const typeColors: Record<string, string> = {
  payment: "text-success bg-success/10",
  order: "text-accent bg-accent/10",
  shipping: "text-warning bg-warning/10",
  chat: "text-primary bg-primary/10",
  system: "text-muted-foreground bg-muted",
};

export default function Notifications() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground text-sm">Stay updated on orders, payments & shipments</p>
        </div>
        <Button variant="outline" size="sm">Mark all read</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {notifications.map((n, i) => (
            <div key={i} className={`flex items-start gap-3 p-4 border-b last:border-0 hover:bg-muted/30 transition-colors ${!n.read ? "bg-accent/5" : ""}`}>
              <div className={`p-2 rounded-full shrink-0 ${typeColors[n.type]}`}>
                <n.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm ${!n.read ? "font-semibold" : "font-medium"}`}>{n.title}</p>
                  {!n.read && <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
