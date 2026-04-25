import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const [address, setAddress] = useState({
    fullName: "",
    street: "",
    city: "",
    country: "",
    postalCode: "",
    phone: "",
  });
  const [notes, setNotes] = useState("");

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 space-y-6">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>
        <h1 className="text-2xl font-bold">Order Placed Successfully!</h1>
        <p className="text-muted-foreground">Your order <strong>{success}</strong> has been placed. The seller will be notified and you'll receive updates on your order status.</p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate("/orders")} className="gradient-primary text-primary-foreground">View Orders</Button>
          <Button variant="outline" onClick={() => navigate("/marketplace")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handlePlaceOrder = async () => {
    if (!user) return;
    if (!address.fullName || !address.street || !address.city || !address.country) {
      toast({ title: "Missing address", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setLoading(true);

    // Group items by seller
    const sellerGroups: Record<string, typeof items> = {};
    items.forEach((item) => {
      const sellerId = item.product?.seller_id || "unknown";
      if (!sellerGroups[sellerId]) sellerGroups[sellerId] = [];
      sellerGroups[sellerId].push(item);
    });

    let lastOrderNumber = "";

    for (const [sellerId, sellerItems] of Object.entries(sellerGroups)) {
      const orderTotal = sellerItems.reduce((s, i) => s + (i.product?.price ?? 0) * i.quantity, 0);

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          buyer_id: user.id,
          seller_id: sellerId,
          total_amount: orderTotal,
          shipping_address: address,
          notes,
          order_number: "temp", // Will be overwritten by trigger
        })
        .select()
        .single();

      if (orderError || !order) {
        toast({ title: "Order failed", description: orderError?.message || "Unknown error", variant: "destructive" });
        setLoading(false);
        return;
      }

      lastOrderNumber = order.order_number;

      const orderItems = sellerItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.product?.price ?? 0,
        total_price: (item.product?.price ?? 0) * item.quantity,
      }));

      await supabase.from("order_items").insert(orderItems);
    }

    await clearCart();
    setLoading(false);
    setSuccess(lastOrderNumber);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input placeholder="John Smith" value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input placeholder="+1 234 567 8900" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Street Address *</Label>
                <Input placeholder="123 Trade Street" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} required />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>City *</Label>
                  <Input placeholder="New York" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Country *</Label>
                  <Input placeholder="United States" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Postal Code</Label>
                  <Input placeholder="10001" value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Order Notes (optional)</Label>
                <Textarea placeholder="Special instructions for the seller..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground truncate mr-2">
                  {item.product?.title} × {item.quantity}
                </span>
                <span className="font-medium shrink-0">
                  ${((item.product?.price ?? 0) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Button className="w-full gradient-primary text-primary-foreground" onClick={handlePlaceOrder} disabled={loading}>
              {loading ? "Placing Order..." : `Place Order — $${total.toFixed(2)}`}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Payment is held in escrow until delivery is confirmed
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
