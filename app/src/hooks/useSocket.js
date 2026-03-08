import { useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL;
let _socket = null;

function getSocket() {
  if (!_socket) {
    _socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 20,
      reconnectionDelay: 1500,
      timeout: 10000,
    });
    _socket.on("connect",       () => console.log("[socket] connected:", _socket.id));
    _socket.on("disconnect",    (r) => console.log("[socket] disconnected:", r));
    _socket.on("connect_error", (e) => console.warn("[socket] connect_error:", e.message));
  }
  return _socket;
}

export function useSocket(userId, callbacks = {}) {
  const cbRef     = useRef(callbacks);
  const idleTimer = useRef(null);

  // Always keep latest callbacks — no stale closures ever
  useEffect(() => { cbRef.current = callbacks; });

  useEffect(() => {
    if (!userId) return;

    const socket = getSocket();

    // ── Join room exactly once per mount ────────────────────
    // "connect" fires once on first connection.
    // "reconnect" (manager event) fires on subsequent reconnections.
    const doJoin = () => {
      socket.emit("join", userId);
      console.log("[socket] join →", userId);
    };

    if (socket.connected) {
      doJoin();                          // already connected — join immediately
    } else {
      socket.once("connect", doJoin);    // wait for first connection
    }

    // Re-join only on REconnects (not the first connect — handled above)
    const onReconnect = () => {
      console.log("[socket] reconnect — re-joining:", userId);
      doJoin();
    };
    socket.io.on("reconnect", onReconnect);   // manager-level event, fires only on re-connects

    // ── Event handlers ──────────────────────────────────────
    const onMessage   = (msg)  => cbRef.current.onMessage?.(msg);
    const onStatus    = (data) => cbRef.current.onStatus?.(data);
    const onPinged    = (data) => { console.log("[socket] pinged:", data); cbRef.current.onPinged?.(data); };
    const onCleared   = ()     => cbRef.current.onChatCleared?.();

    socket.on("newMessage",  onMessage);
    socket.on("userStatus",  onStatus);
    socket.on("pinged",      onPinged);
    socket.on("chatCleared", onCleared);

    // ── Idle detection ──────────────────────────────────────
    const resetIdle = () => {
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => socket.emit("idle", userId), 3 * 60 * 1000);
    };
    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("keydown",   resetIdle);
    resetIdle();

    // ── Cleanup ─────────────────────────────────────────────
    return () => {
      socket.off("connect",     doJoin);
      socket.io.off("reconnect", onReconnect);
      socket.off("newMessage",  onMessage);
      socket.off("userStatus",  onStatus);
      socket.off("pinged",      onPinged);
      socket.off("chatCleared", onCleared);
      clearTimeout(idleTimer.current);
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("keydown",   resetIdle);
    };
  }, [userId]);

  const pingUser = useCallback((targetId, adminName) => {
    console.log("[socket] ping_user → targetId:", targetId);
    getSocket().emit("ping_user", { targetId, adminName });
  }, []);

  return { pingUser };
}