import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const reviews = [
  { reviewer: "Tokyo Goods Ltd", flag: "🇯🇵", rating: 5, text: "Excellent quality tea! Packaging was perfect and delivery was on time.", date: "Apr 12, 2026", product: "Organic Darjeeling Tea" },
  { reviewer: "Berlin Trading Co", flag: "🇩🇪", rating: 4, text: "Good textiles, minor delay in shipping but quality was great.", date: "Apr 10, 2026", product: "Handwoven Pashmina" },
  { reviewer: "Dubai Luxe", flag: "🇦🇪", rating: 5, text: "Outstanding craftsmanship. Our customers love the silver work!", date: "Apr 8, 2026", product: "Silver Jewelry Set" },
  { reviewer: "NYC Wholesale", flag: "🇺🇸", rating: 4, text: "Consistent quality across all 200 shawls. Will reorder.", date: "Apr 6, 2026", product: "Pashmina Shawls" },
  { reviewer: "Paris Imports", flag: "🇫🇷", rating: 5, text: "Magnifique! The silk quality exceeded expectations.", date: "Apr 4, 2026", product: "Silk Fabrics" },
];

export default function Reviews() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ratings & Reviews</h1>
        <p className="text-muted-foreground text-sm">Your trust score and trader feedback</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="gradient-primary text-primary-foreground">
          <CardContent className="p-6 text-center">
            <p className="text-primary-foreground/70 text-sm">Trust Score</p>
            <p className="text-5xl font-bold mt-2">94.2</p>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[1,2,3,4,5].map(i => <Star key={i} className="h-5 w-5 fill-warning text-warning" />)}
            </div>
            <p className="text-xs text-primary-foreground/60 mt-2">Based on 347 reviews</p>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <div className="stat-card"><p className="text-sm text-muted-foreground">As Seller</p><p className="text-2xl font-bold">4.8/5</p><p className="text-xs text-muted-foreground">289 reviews</p></div>
          <div className="stat-card"><p className="text-sm text-muted-foreground">As Buyer</p><p className="text-2xl font-bold">4.9/5</p><p className="text-xs text-muted-foreground">58 reviews</p></div>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground mb-3">Rating Breakdown</p>
          {[{stars:5,pct:78},{stars:4,pct:15},{stars:3,pct:5},{stars:2,pct:1},{stars:1,pct:1}].map(r => (
            <div key={r.stars} className="flex items-center gap-2 mb-2">
              <span className="text-xs w-3">{r.stars}</span>
              <Star className="h-3 w-3 fill-warning text-warning" />
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full gradient-accent rounded-full" style={{width:`${r.pct}%`}} />
              </div>
              <span className="text-xs text-muted-foreground w-8">{r.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Recent Reviews</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviews.map((r, i) => (
              <div key={i} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>{r.flag}</span>
                    <span className="text-sm font-medium">{r.reviewer}</span>
                    <Badge variant="secondary" className="text-[10px]">{r.product}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({length:5}).map((_,j) => (
                    <Star key={j} className={`h-3 w-3 ${j < r.rating ? "fill-warning text-warning" : "text-muted"}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
