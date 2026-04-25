import {
  LayoutDashboard, ShoppingBag, MessageSquare, Wallet, Package,
  Truck, BarChart3, Globe, ShieldCheck, Bell, Settings, Bot,
  FileText, Star, Gavel, ShoppingCart, LogOut
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Marketplace", url: "/marketplace", icon: ShoppingBag },
  { title: "Orders", url: "/orders", icon: Package },
  { title: "Cart", url: "/cart", icon: ShoppingCart },
  { title: "Chat", url: "/chat", icon: MessageSquare },
  { title: "Wallet", url: "/wallet", icon: Wallet },
];

const tradeItems = [
  { title: "Shipping", url: "/shipping", icon: Truck },
  { title: "Currency", url: "/currency", icon: Globe },
  { title: "Documents", url: "/documents", icon: FileText },
  { title: "AI Assistant", url: "/ai-assistant", icon: Bot },
];

const insightItems = [
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Reviews", url: "/reviews", icon: Star },
  { title: "Disputes", url: "/disputes", icon: Gavel },
];

const systemItems = [
  { title: "Security", url: "/security", icon: ShieldCheck },
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Settings", url: "/settings", icon: Settings },
];

function MenuGroup({ label, items }: { label: string; items: typeof mainItems }) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { itemCount } = useCart();

  return (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/55 text-[11px] uppercase tracking-wider font-semibold">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/75 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 transition-colors"
                  activeClassName="bg-primary/10 text-primary font-semibold"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && (
                    <span className="text-sm flex-1">{item.title}</span>
                  )}
                  {!collapsed && item.title === "Cart" && itemCount > 0 && (
                    <Badge className="gradient-accent text-accent-foreground text-[10px] h-5 min-w-[20px] flex items-center justify-center">
                      {itemCount}
                    </Badge>
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <div className="p-4 flex items-center gap-2">
        {collapsed ? (
          <Logo showText={false} size="sm" />
        ) : (
          <div>
            <Logo size="md" textClassName="text-sidebar-foreground" />
            <p className="text-[10px] text-sidebar-foreground/60 mt-0.5 ml-16">Global Trade Platform</p>
          </div>
        )}
      </div>
      <SidebarContent className="px-2">
        <MenuGroup label="Main" items={mainItems} />
        <MenuGroup label="Trade" items={tradeItems} />
        <MenuGroup label="Insights" items={insightItems} />
        <MenuGroup label="System" items={systemItems} />
      </SidebarContent>
      <div className="p-2 mt-auto border-t border-sidebar-border">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/75 hover:text-destructive hover:bg-accent/15 transition-colors w-full"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="text-sm">Sign Out</span>}
        </button>
      </div>
    </Sidebar>
  );
}
