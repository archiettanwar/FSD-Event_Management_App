import { useState, useRef, useEffect } from "react";
import { useSocket } from "../context/SocketContext";

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead, clearNotifications } = useSocket();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleToggle() {
    if (!open && unreadCount > 0) {
      markAllAsRead();
    }
    setOpen(!open);
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button (Screenshot 5) */}
      <button
        onClick={handleToggle}
        className="relative rounded-lg p-2 text-slate-300 transition hover:bg-slate-800 hover:text-white focus:outline-none"
        title="View Real-Time Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread Notification Count Badge (Screenshot 5) */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[11px] font-bold text-white shadow-md animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Menu (Screenshot 6) */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white shadow-2xl z-50 overflow-hidden text-slate-900">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
              <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                {notifications.length}
              </span>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={clearNotifications}
                className="text-xs text-slate-500 hover:text-red-600 transition font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                <p className="text-2xl mb-1">🔕</p>
                <p className="text-sm font-medium">No notifications yet</p>
                <p className="text-xs text-slate-400 mt-1">Real-time alerts from Socket.IO will appear here.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3.5 transition hover:bg-slate-50 ${
                    !n.read ? "bg-indigo-50/40" : ""
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-lg">
                      {n.type === "CREATE" ? "🎉" : n.type === "UPDATE" ? "✏️" : "🗑️"}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            n.type === "CREATE"
                              ? "bg-green-100 text-green-700"
                              : n.type === "UPDATE"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {n.type}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed">{n.message}</p>
                      <span className="mt-1.5 block text-[10px] text-slate-400">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-center text-[10px] text-slate-500">
            ⚡ Connected to Live Socket.IO WebSocket Server
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;

