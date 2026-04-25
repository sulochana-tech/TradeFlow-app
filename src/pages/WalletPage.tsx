import { Wallet, ArrowUpRight, ArrowDownRight, Plus, Send, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const transactions = [
  { type: "incoming", desc: "Payment from Tokyo Goods Ltd", amount: "+$5,200.00", date: "Apr 12, 2026", status: "completed", flag: "🇯🇵" },
  { type: "outgoing", desc: "Shipping fee - DHL Express", amount: "-$340.00", date: "Apr 11, 2026", status: "completed", flag: "🚚" },
  { type: "incoming", desc: "Payment from Dubai Luxe", amount: "+$22,100.00", date: "Apr 10, 2026", status: "completed", flag: "🇦🇪" },
  { type: "escrow", desc: "Escrow hold - NYC Wholesale", amount: "$15,800.00", date: "Apr 9, 2026", status: "held", flag: "🇺🇸" },
  { type: "outgoing", desc: "Withdrawal to bank", amount: "-$10,000.00", date: "Apr 8, 2026", status: "completed", flag: "🏦" },
  { type: "incoming", desc: "Payment from Berlin Trading Co", amount: "+$8,750.00", date: "Apr 7, 2026", status: "pending", flag: "🇩🇪" },
];

export default function WalletPage() {
  const { toast } = useToast();
  const handleAction = (action: string) => {
    toast({ title: `${action}`, description: "This feature will be available soon with payment integration." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Wallet</h1>
        <p className="text-muted-foreground text-sm">Manage your multi-currency wallet & escrow</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="gradient-primary text-primary-foreground md:col-span-2">
          <CardContent className="p-6">
            <p className="text-primary-foreground/70 text-sm">Available Balance</p>
            <p className="text-4xl font-bold mt-2">$127,450.00</p>
            <p className="text-primary-foreground/60 text-sm mt-1">Multi-currency supported</p>
            <div className="flex gap-3 mt-6">
              <Button variant="secondary" size="sm" className="gap-1" onClick={() => handleAction("Add Funds")}><Plus className="h-3 w-3" /> Add Funds</Button>
              <Button variant="secondary" size="sm" className="gap-1" onClick={() => handleAction("Send Money")}><Send className="h-3 w-3" /> Send</Button>
              <Button variant="secondary" size="sm" className="gap-1" onClick={() => handleAction("Withdraw")}><CreditCard className="h-3 w-3" /> Withdraw</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">In Escrow</p>
            <p className="text-xl font-bold text-warning">$15,800.00</p>
            <p className="text-xs text-muted-foreground mt-1">1 pending release</p>
          </div>
          <div className="stat-card">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-xl font-bold text-success">+$36,050.00</p>
            <p className="text-xs text-success">↑ 18% vs last month</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.map((tx, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === "incoming" ? "bg-success/10" : tx.type === "outgoing" ? "bg-destructive/10" : "bg-warning/10"
                  }`}>
                    {tx.type === "incoming" ? <ArrowDownRight className="h-4 w-4 text-success" /> :
                     tx.type === "outgoing" ? <ArrowUpRight className="h-4 w-4 text-destructive" /> :
                     <Wallet className="h-4 w-4 text-warning" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tx.desc}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${
                    tx.type === "incoming" ? "text-success" : tx.type === "outgoing" ? "text-destructive" : "text-warning"
                  }`}>{tx.amount}</p>
                  <Badge variant="secondary" className="text-[10px]">{tx.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
