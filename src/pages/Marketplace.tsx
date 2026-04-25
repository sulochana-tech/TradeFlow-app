import { useState, useEffect } from "react";
import { Search, Filter, Star, MapPin, ShoppingCart, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const categories = ["All", "Agriculture", "Textiles", "Handicrafts", "Spices", "Jewelry", "Electronics", "Food & Beverage"];

const categoryEmojis: Record<string, string> = {
  "Agriculture": "🌾",
  "Textiles": "🧵",
  "Handicrafts": "🎨",
  "Spices": "🌶️",
  "Jewelry": "💎",
  "Electronics": "📱",
  "Food & Beverage": "☕",
};

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string | null;
  category: string | null;
  image_url: string | null;
  stock_quantity: number | null;
  country_of_origin: string | null;
  min_order_quantity: number | null;
  seller_id: string;
}

export default function Marketplace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const [newProduct, setNewProduct] = useState({
    title: "", description: "", price: "", category: "Agriculture", country_of_origin: "", stock_quantity: "1", min_order_quantity: "1",
  });

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").eq("is_active", true);
    if (!error && data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const handleAddProduct = async () => {
    if (!user) return;
    if (!newProduct.title || !newProduct.price) {
      toast({ title: "Missing fields", description: "Title and price are required", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("products").insert({
      seller_id: user.id,
      title: newProduct.title,
      description: newProduct.description || null,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      country_of_origin: newProduct.country_of_origin || null,
      stock_quantity: parseInt(newProduct.stock_quantity) || 1,
      min_order_quantity: parseInt(newProduct.min_order_quantity) || 1,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Product listed!" });
      setShowAddDialog(false);
      setNewProduct({ title: "", description: "", price: "", category: "Agriculture", country_of_origin: "", stock_quantity: "1", min_order_quantity: "1" });
      fetchProducts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Global Marketplace</h1>
          <p className="text-muted-foreground text-sm">Discover products from verified traders worldwide</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" /> List Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>List a New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Product Title *</Label>
                <Input placeholder="e.g. Organic Green Tea" value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea placeholder="Describe your product..." value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (USD) *</Label>
                  <Input type="number" placeholder="49.99" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select className="w-full h-10 rounded-md border bg-background px-3 text-sm" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                    {categories.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country of Origin</Label>
                  <Input placeholder="e.g. Japan" value={newProduct.country_of_origin} onChange={(e) => setNewProduct({ ...newProduct, country_of_origin: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Stock Quantity</Label>
                  <Input type="number" placeholder="100" value={newProduct.stock_quantity} onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })} />
                </div>
              </div>
              <Button className="w-full gradient-primary text-primary-foreground" onClick={handleAddProduct}>List Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-card border rounded-lg px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Search products, categories, sellers..." className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={activeCategory === cat ? "default" : "secondary"}
            className={`cursor-pointer shrink-0 ${activeCategory === cat ? "gradient-primary text-primary-foreground" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold">No products found</h2>
            <p className="text-muted-foreground mt-1">
              {products.length === 0 ? "Be the first to list a product!" : "Try adjusting your search or filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <Card key={product.id} className="group hover:shadow-md transition-all overflow-hidden">
              <div className="h-36 bg-muted flex items-center justify-center text-5xl relative">
                {categoryEmojis[product.category || ""] || "📦"}
                {product.stock_quantity && product.stock_quantity < 10 && (
                  <Badge className="absolute top-2 left-2 bg-warning/90 text-warning-foreground text-[10px]">Low Stock</Badge>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm truncate">{product.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description || "No description"}</p>
                {product.country_of_origin && (
                  <div className="flex items-center gap-1 mt-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{product.country_of_origin}</span>
                  </div>
                )}
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-sm">${product.price.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">Min: {product.min_order_quantity || 1}</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-3 text-xs h-8"
                  onClick={() => addToCart(product.id)}
                  disabled={product.seller_id === user?.id}
                >
                  {product.seller_id === user?.id ? "Your Product" : "Add to Cart"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
