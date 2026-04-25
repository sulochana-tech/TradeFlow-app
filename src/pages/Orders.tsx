import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const statusStyles: Record<string, string> = {
  shipped: "bg-accent/10 text-accent",
  processing: "bg-warning/10 text-warning",
  delivered: "bg-success/10 text-success",
  pending: "bg-muted text-muted-foreground",
  confirmed: "bg-accent/10 text-accent",
  cancelled: "bg-destructive/10 text-destructive",
  refunded: "bg-destructive/10 text-destructive",
};

export default function Orders() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("orders")
      .select("*")
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order("created_at", { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [user]);

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Order ${status}` });
      fetchOrders();
    }
  };

  const activeOrders = orders.filter((o) => !["delivered", "cancelled", "refunded"].includes(o.status));
  const completedOrders = orders.filter((o) => ["delivered", "cancelled", "refunded"].includes(o.status));

  const renderOrders = (list: any[]) => (
    <Card>
      <CardContent className="p-0">
        {list.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-xs text-muted-foreground">
                  <th className="text-left p-4 font-medium">Order ID</th>
                  <th className="text-left p-4 font-medium hidden sm:table-cell">Date</th>
                  <th className="text-left p-4 font-medium">Role</th>
                  <th className="text-right p-4 font-medium">Amount</th>
                  <th className="text-center p-4 font-medium">Status</th>
                  <th className="text-center p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((order) => {
                  const isSeller = order.seller_id === user?.id;
                  return (
                    <tr key={order.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4 text-sm font-mono font-medium">{order.order_number}</td>
                      <td className="p-4 text-sm text-muted-foreground hidden sm:table-cell">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm">
                        <Badge variant="outline">{isSeller ? "Seller" : "Buyer"}</Badge>
                      </td>
                      <td className="p-4 text-sm font-semibold text-right">${order.total_amount.toFixed(2)}</td>
                      <td className="p-4 text-center">
                        <Badge variant="secondary" className={statusStyles[order.status]}>{order.status}</Badge>
                      </td>
                      <td className="p-4 text-center">
                        {isSeller && order.status === "pending" && (
                          <div className="flex gap-2 justify-center">
                            <Button size="sm" variant="outline" className="text-xs" onClick={() => updateStatus(order.id, "confirmed")}>Confirm</Button>
                            <Button size="sm" variant="outline" className="text-xs text-destructive" onClick={() => updateStatus(order.id, "cancelled")}>Cancel</Button>
                          </div>
                        )}
                        {isSeller && order.status === "confirmed" && (
                          <Button size="sm" variant="outline" className="text-xs" onClick={() => updateStatus(order.id, "shipped")}>Mark Shipped</Button>
                        )}
                        {!isSeller && order.status === "shipped" && (
                          <Button size="sm" variant="outline" className="text-xs" onClick={() => updateStatus(order.id, "delivered")}>Confirm Delivery</Button>
                        )}
                        {!isSeller && order.status === "pending" && (
                          <Button size="sm" variant="outline" className="text-xs text-destructive" onClick={() => updateStatus(order.id, "cancelled")}>Cancel</Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground text-sm">Manage and track all your trade orders</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: String(orders.length), sub: "All time" },
          { label: "Active", value: String(activeOrders.length), sub: "In progress" },
          { label: "Completed", value: String(completedOrders.length), sub: "Delivered / closed" },
          { label: "Revenue", value: `$${orders.filter((o) => o.seller_id === user?.id && o.status === "delivered").reduce((s, o) => s + o.total_amount, 0).toFixed(0)}`, sub: "From sales" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">{renderOrders(orders)}</TabsContent>
        <TabsContent value="active" className="mt-4">{renderOrders(activeOrders)}</TabsContent>
        <TabsContent value="completed" className="mt-4">{renderOrders(completedOrders)}</TabsContent>
      </Tabs>
    </div>
  );
}
