import { useState, useEffect, useRef } from "react";
import Icon from "./Icon";
import { getMessages, sendMessage, getAdminId } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../hooks/useSocket";

// ── Inner component — only mounts for non-admin users ────────
function UserChat({ user }) {
  const [open,     setOpen]    = useState(false);
  const [messages, setMsgs]    = useState([]);
  const [input,    setInput]   = useState("");
  const [adminId,  setAdminId] = useState(null);
  const [unread,   setUnread]  = useState(0);
  const [ping,     setPing]    = useState(null);
  const [cleared,  setCleared] = useState(false);

  const sendingRef  = useRef(false);
  const bottomRef   = useRef(null);
  const openRef     = useRef(false);
  const myIdRef     = useRef(String(user._id));
  const adminIdRef  = useRef(null);

  useEffect(() => { openRef.current   = open;             }, [open]);
  useEffect(() => { myIdRef.current   = String(user._id); }, [user._id]);
  useEffect(() => { adminIdRef.current = adminId;         }, [adminId]);

  // ── Socket ────────────────────────────────────────────────
  useSocket(user._id, {
    onMessage: (msg) => {
      const sid = String(msg.sender?._id   || msg.sender   || "");
      const rid = String(msg.receiver?._id || msg.receiver || "");
      const me  = myIdRef.current;

      console.log("[FloatingChat] newMessage", { sid, rid, me, match: sid===me||rid===me });

      if (sid !== me && rid !== me) return;

      setMsgs((prev) => {
        // Replace my own optimistic with real saved record
        const optIdx = prev.findIndex(
          (m) => m._opt && String(m.sender?._id || m.sender) === me && m.content === msg.content
        );
        if (optIdx !== -1) {
          const next = [...prev]; next[optIdx] = msg; return next;
        }
        if (prev.find((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });

      if (!openRef.current && sid !== me) setUnread((u) => u + 1);
    },

    onPinged: (data) => {
      setPing(data);
      setTimeout(() => setPing(null), 6000);
    },

    onChatCleared: () => {
      console.log("[FloatingChat] chatCleared — wipe only, no re-fetch");
      setMsgs([]);
      setUnread(0);
      setCleared(true);
    },
  });

  // ── Load admin ID once ────────────────────────────────────
  useEffect(() => {
    getAdminId(user.token).then((a) => setAdminId(a._id)).catch(() => {});
  }, [user._id]);

  // ── Load / merge history when chat opens ─────────────────
  useEffect(() => {
    if (!open || !adminId) return;
    if (cleared) { setUnread(0); return; } // admin just cleared — DB is empty, skip fetch
    setUnread(0);
    getMessages(user.token, adminId).then((fetched) => {
      setMsgs((prev) => {
        const ids   = new Set(fetched.map((m) => m._id));
        const extra = prev.filter((m) => !m._opt && !ids.has(m._id));
        return [...fetched, ...extra].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      });
    }).catch(() => {});
  }, [open, adminId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Send ──────────────────────────────────────────────────
  const handleSend = async () => {
    if (!input.trim() || !adminId || sendingRef.current) return;
    sendingRef.current = true;
    setCleared(false);
    const content = input.trim();
    setInput("");

    const opt = {
      _id: "opt-" + Date.now(),
      sender:   { _id: user._id },
      receiver: { _id: adminId },
      content, read: false,
      createdAt: new Date().toISOString(),
      _opt: true,
    };
    setMsgs((p) => [...p, opt]);

    try {
      const saved = await sendMessage(user.token, { receiverId: adminId, content });
      setMsgs((p) => p.map((m) => m._opt ? saved : m));
    } catch {
      setMsgs((p) => p.filter((m) => !m._opt));
    } finally {
      sendingRef.current = false;
    }
  };

  return (
    <>
      {ping && (
        <div className="ping-popup">
          <Icon name="bell" size={14} />
          <span>{ping.message}</span>
        </div>
      )}

      <button className="chat-fab" onClick={() => setOpen((o) => !o)}>
        <Icon name="message-circle" size={22} />
        {unread > 0 && <span className="chat-fab-badge">{unread}</span>}
      </button>

      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">A</div>
              <div>
                <div className="chat-header-name">BHF Support</div>
                <div className="chat-header-status">Admin</div>
              </div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>
              <Icon name="x" size={15} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-empty">
                <Icon name="message-circle" size={28} />
                <p>Send a message to BHF Support</p>
              </div>
            )}
            {messages.map((m) => {
              const mine = String(m.sender?._id || m.sender) === String(user._id);
              return (
                <div key={m._id} className={`chat-msg ${mine ? "mine" : "theirs"}`}>
                  <div className="chat-bubble">{m.content}</div>
                  <div className="chat-time">
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {mine && <span className="chat-read">{m.read ? " ✓✓" : " ✓"}</span>}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <div className="chat-input-row">
            <input
              className="chat-input"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
              }}
              maxLength={500}
            />
            <button className="chat-send" onClick={handleSend} disabled={!input.trim()}>
              <Icon name="send" size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Outer wrapper — returns null for admins without running hooks
export default function FloatingChat() {
  const { user } = useAuth();
  if (!user || user.role === "Administrator") return null;
  return <UserChat user={user} />;
}