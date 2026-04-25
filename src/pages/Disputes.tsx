import { Gavel, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/StatCard";

const disputes = [
  { id: "DSP-142", buyer: "London Crafts", issue: "Product quality doesn't match description", amount: "$7,250", status: "under_review", date: "Apr 10, 2026", flag: "🇬🇧" },
  { id: "DSP-141", buyer: "Seoul Imports", issue: "Late delivery - 12 days past ETA", amount: "$3,400", status: "resolved", date: "Apr 5, 2026", flag: "🇰🇷" },
  { id: "DSP-140", buyer: "Sydney Trade Co", issue: "Damaged packaging during transit", amount: "$5,100", status: "resolved", date: "Mar 28, 2026", flag: "🇦🇺" },
];

const statusStyles: Record<string, string> = {
  under_review: "bg-warning/10 text-warning",
  resolved: "bg-success/10 text-success",
  escalated: "bg-destructive/10 text-destructive",
};

export default function Disputes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dispute Resolution</h1>
        <p className="text-muted-foreground text-sm">Manage complaints and resolve disputes</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Disputes" value="12" change="All time" changeType="neutral" icon={Gavel} />
        <StatCard title="Open" value="1" change="Under review" changeType="negative" icon={AlertTriangle} />
        <StatCard title="Resolved" value="11" change="92% resolution rate" changeType="positive" icon={CheckCircle} />
        <StatCard title="Avg Resolution" value="3.2 days" change="-0.5 days" changeType="positive" icon={Clock} />
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Dispute Cases</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {disputes.map((d, i) => (
              <div key={i} className="p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-medium">{d.id}</span>
                    <Badge variant="secondary" className={statusStyles[d.status]}>{d.status.replace("_"," ")}</Badge>
                  </div>
                  <span className="text-sm font-semibold">{d.amount}</span>
                </div>
                <p className="text-sm"><span className="mr-1">{d.flag}</span>{d.buyer}</p>
                <p className="text-sm text-muted-foreground mt-1">{d.issue}</p>
                <p className="text-xs text-muted-foreground mt-2">Filed: {d.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
