import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell, Search, ShoppingCart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).single().then(({ data }) => {
      if (data) setProfile(data);
    });
  }, [user]);

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || "TF";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border bg-background px-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="hidden sm:flex items-center gap-2 bg-secondary rounded-lg px-3 py-1.5">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search products, orders, traders..."
                  className="bg-transparent text-sm outline-none w-48 lg:w-64 placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/cart" className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 gradient-accent rounded-full flex items-center justify-center text-[10px] font-bold text-accent-foreground">
                    {itemCount}
                  </span>
                )}
              </Link>
              <Link to="/notifications" className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
                <Bell className="h-4 w-4 text-muted-foreground" />
              </Link>
              <Link to="/settings" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-semibold text-primary-foreground">
                  {initials}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-foreground">{profile?.full_name || "Trader"}</p>
                  <p className="text-xs text-muted-foreground">{profile?.business_type || "Member"}</p>
                </div>
              </Link>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
