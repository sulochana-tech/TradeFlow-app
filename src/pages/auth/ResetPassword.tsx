import { useState } from "react";
import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Globe className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">TradeFlow</span>
        </div>

        {sent ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Check your email</h2>
            <p className="text-muted-foreground">We've sent a password reset link to <strong>{email}</strong>.</p>
            <Button variant="outline" asChild className="w-full">
              <Link to="/auth/signin">Back to Sign In</Link>
            </Button>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Reset password</h2>
              <p className="text-muted-foreground mt-1">Enter your email and we'll send you a reset link</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full gradient-primary text-primary-foreground" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
            <p className="text-sm text-center text-muted-foreground">
              Remember your password?{" "}
              <Link to="/auth/signin" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
