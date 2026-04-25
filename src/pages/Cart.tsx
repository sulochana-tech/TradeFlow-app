import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { items, loading, removeFromCart, updateQuantity, total, itemCount } = useCart();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Your cart is empty</h2>
            <p className="text-muted-foreground mt-2">Browse the marketplace to find products</p>
            <Button className="mt-6 gradient-primary text-primary-foreground" asChild>
              <Link to="/marketplace">Browse Marketplace</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground text-sm">{itemCount} item{itemCount !== 1 ? "s" : ""} in your cart</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-2xl shrink-0">
                  📦
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{item.product?.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.product?.country_of_origin || "International"}</p>
                  <p className="text-sm font-bold mt-1">${item.product?.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm">${((item.product?.price ?? 0) * item.quantity).toFixed(2)}</p>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive mt-1" onClick={() => removeFromCart(item.id)}>
                    <Trash2 className="h-3 w-3 mr-1" /> Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
              <span className="font-medium">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-success font-medium">Calculated at checkout</span>
            </div>
            <div className="border-t pt-4 flex justify-between font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Button className="w-full gradient-primary text-primary-foreground" asChild>
              <Link to="/checkout">Proceed to Checkout <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/marketplace">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
