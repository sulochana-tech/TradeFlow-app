import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    business_name: "",
    business_type: "both",
    country: "",
  });

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).single().then(({ data }) => {
      if (data) {
        setProfile({
          full_name: data.full_name || "",
          business_name: data.business_name || "",
          business_type: data.business_type || "both",
          country: data.country || "",
        });
      }
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("profiles").update(profile).eq("user_id", user.id);
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your profile and preferences</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><User className="h-4 w-4" /> Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email || ""} disabled />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} placeholder="Your full name" />
            </div>
            <div className="space-y-2">
              <Label>Business Name</Label>
              <Input value={profile.business_name} onChange={(e) => setProfile({ ...profile, business_name: e.target.value })} placeholder="Company name" />
            </div>
            <div className="space-y-2">
              <Label>Account Type</Label>
              <select className="w-full h-10 rounded-md border bg-background px-3 text-sm" value={profile.business_type} onChange={(e) => setProfile({ ...profile, business_type: e.target.value })}>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="both">Buyer & Seller</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} placeholder="Your country" />
            </div>
          </div>
          <Button className="gradient-primary text-primary-foreground" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Bell className="h-4 w-4" /> Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: "Order updates", desc: "Receive notifications for new orders and status changes", on: true },
              { label: "Payment alerts", desc: "Get notified about incoming payments and escrow releases", on: true },
              { label: "Chat messages", desc: "Real-time alerts for new messages", on: true },
              { label: "Marketing emails", desc: "Product recommendations and trade insights", on: false },
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <Switch defaultChecked={n.on} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4" /> Language & Region</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Language</label>
              <div className="bg-muted rounded-lg px-3 py-2 text-sm mt-1">English (US)</div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Default Currency</label>
              <div className="bg-muted rounded-lg px-3 py-2 text-sm mt-1">USD ($)</div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Timezone</label>
              <div className="bg-muted rounded-lg px-3 py-2 text-sm mt-1">Auto-detected</div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Date Format</label>
              <div className="bg-muted rounded-lg px-3 py-2 text-sm mt-1">MMM DD, YYYY</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
