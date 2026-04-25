import { useState, useRef, useEffect } from "react";
import { Bot, Send, Lightbulb, TrendingUp, Truck, DollarSign, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string };

const suggestions = [
  {
    icon: TrendingUp,
    title: "Top markets for textiles",
    desc: "Discover top-demand countries for textile exports",
    prompt: "What are the current top-demand countries for textile and apparel exports? Include import volumes, YoY growth, and key buyer regions.",
  },
  {
    icon: DollarSign,
    title: "Optimize pricing",
    desc: "Get AI-recommended pricing for your products",
    prompt: "Help me optimize export pricing. Walk me through how to benchmark competitive B2B prices, factor in currency and margins, and recommend a pricing strategy for a typical mid-volume export product.",
  },
  {
    icon: Truck,
    title: "Shipping recommendations",
    desc: "Find the best shipping routes and carriers",
    prompt: "Recommend the best shipping routes and carriers for international B2B trade. Compare DHL, FedEx, UPS, Maersk and others by cost, transit time, and reliability for both small parcels and bulk freight.",
  },
  {
    icon: Lightbulb,
    title: "Demand prediction",
    desc: "Predict seasonal demand for your product category",
    prompt: "Predict upcoming seasonal demand patterns across major product categories (textiles, tea, spices, electronics, handicrafts). Highlight peak buying months and key buyer regions.",
  },
];

const INITIAL_MESSAGE: Msg = {
  role: "assistant",
  content:
    "👋 Hello! I'm your **AI Trade Assistant**.\n\nI can help you with:\n- 🌍 **Market discovery** — top-demand countries for your products\n- 💰 **Pricing optimization** — competitive export prices\n- 🚢 **Shipping intelligence** — best routes & carriers\n- 📈 **Demand forecasting** — seasonal trends & predictions\n\nPick a suggestion above or ask me anything!",
};

export default function AIAssistant() {
  const [messages, setMessages] = useState<Msg[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Msg = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setIsLoading(true);

    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-trade-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: next.map(({ role, content }) => ({ role, content })),
          }),
        }
      );

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) {
          toast({ title: "Rate limit reached", description: "Please wait a moment and try again.", variant: "destructive" });
        } else if (resp.status === 402) {
          toast({ title: "AI credits exhausted", description: "Add funds to continue using the AI assistant.", variant: "destructive" });
        } else {
          toast({ title: "AI error", description: "Something went wrong. Please try again.", variant: "destructive" });
        }
        setIsLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";
      let done = false;

      // Add empty assistant message that we'll fill in
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (!done) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        buffer += decoder.decode(value, { stream: true });

        let nlIndex: number;
        while ((nlIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nlIndex);
          buffer = buffer.slice(nlIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (delta) {
              assistantText += delta;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: assistantText };
                return copy;
              });
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast({ title: "Connection error", description: "Failed to reach AI service.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Trade Assistant</h1>
        <p className="text-muted-foreground text-sm">Your intelligent global trade advisor powered by AI</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => send(s.prompt)}
            disabled={isLoading}
            className="text-left disabled:opacity-50"
          >
            <Card className="cursor-pointer hover:shadow-md hover:border-accent/50 transition-all h-full">
              <CardContent className="p-4">
                <div className="p-2 rounded-lg bg-accent/10 w-fit mb-3">
                  <s.icon className="h-4 w-4 text-accent" />
                </div>
                <h3 className="text-sm font-medium">{s.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <Card className="flex flex-col h-[560px]">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-base flex items-center gap-2">
            <Bot className="h-5 w-5 text-accent" /> AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-headings:my-2 text-sm">
                    <ReactMarkdown>{msg.content || "…"}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Thinking…</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </CardContent>
        <div className="p-3 border-t">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={isLoading}
              placeholder="Ask about markets, pricing, shipping, demand…"
              className="flex-1 bg-muted rounded-full px-4 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
            />
            <Button
              size="icon"
              onClick={() => send(input)}
              disabled={isLoading || !input.trim()}
              className="bg-primary text-primary-foreground rounded-full"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
