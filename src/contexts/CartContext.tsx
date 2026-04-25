import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product?: {
    id: string;
    title: string;
    price: number;
    currency: string | null;
    image_url: string | null;
    seller_id: string;
    country_of_origin: string | null;
  };
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const refreshCart = async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select("*, product:products(id, title, price, currency, image_url, seller_id, country_of_origin)")
      .eq("user_id", user.id);
    setLoading(false);
    if (!error && data) {
      setItems(data.map((item: any) => ({ ...item, product: item.product })));
    }
  };

  useEffect(() => {
    refreshCart();
  }, [user]);

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to add items to cart", variant: "destructive" });
      return;
    }
    const existing = items.find((i) => i.product_id === productId);
    if (existing) {
      await updateQuantity(existing.id, existing.quantity + quantity);
      return;
    }
    const { error } = await supabase.from("cart_items").insert({ user_id: user.id, product_id: productId, quantity });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Added to cart!" });
      await refreshCart();
    }
  };

  const removeFromCart = async (itemId: string) => {
    const { error } = await supabase.from("cart_items").delete().eq("id", itemId);
    if (!error) await refreshCart();
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }
    const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", itemId);
    if (!error) await refreshCart();
  };

  const clearCart = async () => {
    if (!user) return;
    await supabase.from("cart_items").delete().eq("user_id", user.id);
    setItems([]);
  };

  const total = items.reduce((sum, i) => sum + (i.product?.price ?? 0) * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, loading, addToCart, removeFromCart, updateQuantity, clearCart, refreshCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
