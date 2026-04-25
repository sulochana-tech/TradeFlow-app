import { useEffect, useState } from "react";
import { DollarSign, ShoppingBag, Package, TrendingUp, ArrowUpRight } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const statusStyles: Record<string, string> = {
  shipped: "bg-accent/10 text-accent",
  processing: "bg-warning/10 text-warning",
  delivered: "bg-success/10 text-success",
  pending: "bg-muted text-muted-foreground",
  confirmed: "bg-accent/10 text-accent",
  cancelled: "bg-destructive/10 text-destructive",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [ordersRes, productsRes, profileRes] = await Promise.all([
        supabase.from("orders").select("*").or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`).order("created_at", { ascending: false }).limit(5),
        supabase.from("products").select("id", { count: "exact" }).eq("seller_id", user.id),
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      ]);
      if (ordersRes.data) setOrders(ordersRes.data);
      if (productsRes.count != null) setProductCount(productsRes.count);
      if (profileRes.data) setProfile(profileRes.data);
    };
    fetchData();
  }, [user]);

  const totalRevenue = orders.filter((o) => o.seller_id === user?.id && o.status === "delivered").reduce((s, o) => s + o.total_amount, 0);
  const activeOrders = orders.filter((o) => !["delivered", "cancelled", "refunded"].includes(o.status)).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}! Here's your trade overview.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={`$${totalRevenue.toFixed(0)}`} change="From delivered orders" changeType="neutral" icon={DollarSign} />
        <StatCard title="Active Orders" value={String(activeOrders)} change="In progress" changeType="neutral" icon={Package} />
        <StatCard title="Products Listed" value={String(productCount)} change="Your listings" changeType="neutral" icon={ShoppingBag} />
        <StatCard title="Total Orders" value={String(orders.length)} change="All time" changeType="neutral" icon={TrendingUp} />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No orders yet. Start trading on the marketplace!</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium font-mono">{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()} • {order.buyer_id === user?.id ? "You bought" : "You sold"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold">${order.total_amount.toFixed(2)}</span>
                    <Badge variant="secondary" className={statusStyles[order.status] || ""}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
