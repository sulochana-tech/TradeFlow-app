import { ShieldCheck, AlertTriangle, Key, Smartphone, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const activityLog = [
  { action: "Login from new device", location: "Kathmandu, Nepal", time: "2 min ago", risk: "low" },
  { action: "Password changed", location: "Kathmandu, Nepal", time: "2 days ago", risk: "none" },
  { action: "Large transaction ($22,100)", location: "System", time: "3 days ago", risk: "medium" },
  { action: "API key generated", location: "Kathmandu, Nepal", time: "1 week ago", risk: "low" },
  { action: "Failed login attempt", location: "Unknown, China", time: "1 week ago", risk: "high" },
];

const riskColors: Record<string, string> = {
  none: "bg-muted text-muted-foreground",
  low: "bg-success/10 text-success",
  medium: "bg-warning/10 text-warning",
  high: "bg-destructive/10 text-destructive",
};

export default function Security() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Security Center</h1>
        <p className="text-muted-foreground text-sm">Protect your account and detect threats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="gradient-primary text-primary-foreground">
          <CardContent className="p-6 text-center">
            <ShieldCheck className="h-12 w-12 mx-auto mb-2" />
            <p className="text-3xl font-bold">Secure</p>
            <p className="text-sm text-primary-foreground/70 mt-1">Your account is well protected</p>
          </CardContent>
        </Card>
        <div className="space-y-3">
          {[
            { label: "Two-Factor Auth", status: "Enabled", icon: Smartphone, ok: true },
            { label: "KYC Verification", status: "Verified", icon: CheckCircle, ok: true },
            { label: "API Keys", status: "2 active", icon: Key, ok: true },
          ].map((s, i) => (
            <div key={i} className="stat-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <s.icon className="h-4 w-4 text-accent" />
                <span className="text-sm">{s.label}</span>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success">{s.status}</Badge>
            </div>
          ))}
        </div>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-3">Security Checklist</p>
            {["Strong password", "2FA enabled", "Email verified", "KYC completed", "Recovery email set"].map((item, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activityLog.map((a, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div>
                  <p className="text-sm font-medium">{a.action}</p>
                  <p className="text-xs text-muted-foreground">{a.location} • {a.time}</p>
                </div>
                <Badge variant="secondary" className={riskColors[a.risk]}>{a.risk} risk</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
