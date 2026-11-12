import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [activeToast, setActiveToast] = useState(null);

  useEffect(() => {
    // Connect to Socket.IO server on localhost:5000
    const newSocket = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
    });

    setSocket(newSocket);

    // Listen for event notification broadcasts
    newSocket.on("eventNotification", (data) => {
      const newNotification = {
        id: Date.now() + Math.random(),
        ...data,
        read: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);
      setActiveToast(newNotification);

      // Auto dismiss toast after 6 seconds
      setTimeout(() => {
        setActiveToast((current) => (current?.id === newNotification.id ? null : current));
      }, 6000);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function clearNotifications() {
    setNotifications([]);
    setActiveToast(null);
  }

  function dismissToast() {
    setActiveToast(null);
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        unreadCount,
        activeToast,
        markAllAsRead,
        clearNotifications,
        dismissToast,
      }}
    >
      {children}
      {/* Real-Time Toast Notification Popup (Screenshots 1, 2, 3) */}
      {activeToast && (
        <div className="fixed top-20 right-6 z-50 max-w-sm animate-bounce-once rounded-xl border-2 border-indigo-500 bg-white p-4 shadow-2xl transition">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">
                {activeToast.type === "CREATE" ? "🎉" : activeToast.type === "UPDATE" ? "✏️" : "🗑️"}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900">{activeToast.title}</h4>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      activeToast.type === "CREATE"
                        ? "bg-green-100 text-green-700"
                        : activeToast.type === "UPDATE"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {activeToast.type}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">{activeToast.message}</p>
                <span className="mt-2 block text-[10px] text-slate-400">Real-time WebSocket event received</span>
              </div>
            </div>
            <button
              onClick={dismissToast}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}

export default SocketContext;

