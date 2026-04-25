import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface Contact {
  user_id: string;
  full_name: string | null;
  business_name: string | null;
  country: string | null;
  lastMessage: string;
  lastTime: string;
  unread: number;
}

export default function Chat() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchUsers, setSearchUsers] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load contacts from existing conversations
  const loadContacts = useCallback(async () => {
    if (!user) return;

    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });

    if (!msgs || msgs.length === 0) {
      setContacts([]);
      return;
    }

    // Get unique contact IDs
    const contactIds = new Set<string>();
    msgs.forEach((m) => {
      if (m.sender_id !== user.id) contactIds.add(m.sender_id);
      if (m.receiver_id !== user.id) contactIds.add(m.receiver_id);
    });

    if (contactIds.size === 0) return;

    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, business_name, country")
      .in("user_id", Array.from(contactIds));

    const contactList: Contact[] = Array.from(contactIds).map((cId) => {
      const profile = profiles?.find((p) => p.user_id === cId);
      const lastMsg = msgs.find(
        (m) => m.sender_id === cId || m.receiver_id === cId
      );
      const unreadCount = msgs.filter(
        (m) => m.sender_id === cId && m.receiver_id === user.id && !m.is_read
      ).length;

      return {
        user_id: cId,
        full_name: profile?.full_name || "Unknown User",
        business_name: profile?.business_name || null,
        country: profile?.country || null,
        lastMessage: lastMsg?.content || "",
        lastTime: lastMsg?.created_at || "",
        unread: unreadCount,
      };
    });

    contactList.sort(
      (a, b) => new Date(b.lastTime).getTime() - new Date(a.lastTime).getTime()
    );
    setContacts(contactList);
  }, [user]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  // Load messages for selected contact
  useEffect(() => {
    if (!user || !selectedContact) return;

    const loadMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${selectedContact.user_id}),and(sender_id.eq.${selectedContact.user_id},receiver_id.eq.${user.id})`
        )
        .order("created_at", { ascending: true });

      if (data) setMessages(data);

      // Mark as read
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("sender_id", selectedContact.user_id)
        .eq("receiver_id", user.id)
        .eq("is_read", false);
    };

    loadMessages();
  }, [user, selectedContact]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as Message;
          if (
            msg.sender_id === user.id ||
            msg.receiver_id === user.id
          ) {
            if (
              selectedContact &&
              (msg.sender_id === selectedContact.user_id ||
                msg.receiver_id === selectedContact.user_id)
            ) {
              setMessages((prev) => [...prev, msg]);
              // Mark as read if from the selected contact
              if (msg.sender_id === selectedContact.user_id) {
                supabase
                  .from("messages")
                  .update({ is_read: true })
                  .eq("id", msg.id)
                  .then();
              }
            }
            loadContacts();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedContact, loadContacts]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Search users to start new conversation
  useEffect(() => {
    if (!searchQuery.trim() || !user) {
      setSearchUsers([]);
      return;
    }
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, full_name, business_name, country")
        .neq("user_id", user.id)
        .or(`full_name.ilike.%${searchQuery}%,business_name.ilike.%${searchQuery}%`)
        .limit(5);
      setSearchUsers(data || []);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, user]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !selectedContact) return;

    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: selectedContact.user_id,
      content: newMessage.trim(),
    });

    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startChat = (profile: any) => {
    const existing = contacts.find((c) => c.user_id === profile.user_id);
    if (existing) {
      setSelectedContact(existing);
    } else {
      const newContact: Contact = {
        user_id: profile.user_id,
        full_name: profile.full_name,
        business_name: profile.business_name,
        country: profile.country,
        lastMessage: "",
        lastTime: new Date().toISOString(),
        unread: 0,
      };
      setContacts((prev) => [newContact, ...prev]);
      setSelectedContact(newContact);
    }
    setSearchQuery("");
    setSearchUsers([]);
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return "now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="h-[calc(100vh-7rem)]">
      <div className="flex h-full gap-4">
        {/* Contacts Sidebar */}
        <Card className="w-80 shrink-0 hidden md:flex flex-col">
          <div className="p-3 border-b relative">
            <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search users to chat..."
                className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {searchUsers.length > 0 && (
              <div className="absolute left-3 right-3 top-full mt-1 bg-card border rounded-lg shadow-lg z-10">
                {searchUsers.map((u) => (
                  <button
                    key={u.user_id}
                    className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 text-left transition-colors"
                    onClick={() => startChat(u)}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      {getInitials(u.full_name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{u.full_name || "Unknown"}</p>
                      {u.business_name && (
                        <p className="text-xs text-muted-foreground">{u.business_name}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex-1 overflow-auto">
            {contacts.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                <p>No conversations yet.</p>
                <p className="mt-1">Search for a user above to start chatting!</p>
              </div>
            ) : (
              contacts.map((c) => (
                <button
                  key={c.user_id}
                  className={`w-full flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors text-left ${
                    selectedContact?.user_id === c.user_id ? "bg-muted/50" : ""
                  }`}
                  onClick={() => setSelectedContact(c)}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {getInitials(c.full_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium truncate">{c.full_name}</p>
                      {c.lastTime && (
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {formatTime(c.lastTime)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {c.business_name || c.lastMessage || "Start a conversation"}
                    </p>
                  </div>
                  {c.unread > 0 && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-[10px] font-bold text-primary-foreground">{c.unread}</span>
                    </div>
                  )}
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              <div className="p-3 border-b flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                  {getInitials(selectedContact.full_name)}
                </div>
                <div>
                  <p className="text-sm font-medium">{selectedContact.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {[selectedContact.business_name, selectedContact.country]
                      .filter(Boolean)
                      .join(" • ") || "TradeFlow User"}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    No messages yet. Say hello! 👋
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                          msg.sender_id === user?.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={`text-[10px] mt-1 ${
                            msg.sender_id === user?.id
                              ? "text-primary-foreground/50"
                              : "text-muted-foreground"
                          }`}
                        >
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t">
                <div className="flex items-center gap-2">
                  <input
                    placeholder="Type a message..."
                    className="flex-1 bg-muted rounded-full px-4 py-2 text-sm outline-none placeholder:text-muted-foreground"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    size="icon"
                    className="bg-primary text-primary-foreground rounded-full shrink-0"
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Send className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <h2 className="text-lg font-semibold">Select a conversation</h2>
                <p className="text-sm mt-1">Search for a user or pick an existing chat</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
