import { FileText, Download, Plus, Eye, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const documents = [
  { name: "Invoice #INV-2847", type: "Invoice", order: "TF-2847", date: "Apr 12, 2026", status: "generated" },
  { name: "Customs Declaration - USA", type: "Customs", order: "TF-2847", date: "Apr 12, 2026", status: "pending" },
  { name: "Certificate of Origin", type: "Export", order: "TF-2846", date: "Apr 11, 2026", status: "generated" },
  { name: "Packing List - Berlin Order", type: "Shipping", order: "TF-2846", date: "Apr 11, 2026", status: "generated" },
  { name: "Commercial Invoice #CI-2845", type: "Invoice", order: "TF-2845", date: "Apr 10, 2026", status: "generated" },
  { name: "Phytosanitary Certificate", type: "Export", order: "TF-2845", date: "Apr 10, 2026", status: "approved" },
];

const typeStyles: Record<string, string> = {
  Invoice: "bg-accent/10 text-accent",
  Customs: "bg-warning/10 text-warning",
  Export: "bg-success/10 text-success",
  Shipping: "bg-primary/10 text-primary",
};

export default function Documents() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground text-sm">Auto-generate invoices, customs forms & export docs</p>
        </div>
        <Button className="gradient-primary text-primary-foreground gap-2">
          <Plus className="h-4 w-4" /> Generate Document
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Documents", value: "156", icon: FileText },
          { label: "This Month", value: "24", icon: Clock },
          { label: "Pending Review", value: "3", icon: Eye },
          { label: "Downloads", value: "89", icon: Download },
        ].map((s, i) => (
          <div key={i} className="stat-card flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <s.icon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">Order: {doc.order} • {doc.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={typeStyles[doc.type]}>{doc.type}</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
