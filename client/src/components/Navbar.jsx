import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenu();
    navigate("/login");
  }

  return (
    <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2 text-2xl font-bold">
          <span className="text-indigo-400">⚡</span> EventHub
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-5 md:flex">
          <Link to="/" className="transition hover:text-indigo-400">Home</Link>
          <Link to="/events" className="transition hover:text-indigo-400">Events</Link>

          {/* Real-Time WebSocket Notification Bell (Screenshot 5 & 6) */}
          <NotificationBell />

          {user ? (
            <>
              <Link to="/my-registrations" className="transition hover:text-indigo-400">My Registrations</Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 border border-amber-500/30 transition hover:bg-amber-500/30"
                >
                  Admin Panel
                </Link>
              )}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
                <span className="text-sm font-medium text-slate-200">{user.name}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                    user.role === "admin"
                      ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                      : "bg-indigo-400/20 text-indigo-300 border border-indigo-400/30"
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-3 py-2 text-sm font-medium transition hover:text-indigo-400">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-700"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Notification & Menu Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <NotificationBell />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="border-t border-slate-800 bg-slate-900 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link to="/" onClick={closeMenu} className="hover:text-indigo-400">Home</Link>
            <Link to="/events" onClick={closeMenu} className="hover:text-indigo-400">Events</Link>
            {user ? (
              <>
                <Link to="/my-registrations" onClick={closeMenu} className="hover:text-indigo-400">My Registrations</Link>
                {isAdmin && (
                  <Link to="/admin" onClick={closeMenu} className="text-amber-300 font-semibold">Admin Panel</Link>
                )}
                <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                  <span className="text-sm text-slate-300">{user.name} ({user.role})</span>
                  <button onClick={handleLogout} className="rounded bg-red-600 px-3 py-1 text-xs">Logout</button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-2 border-t border-slate-800 pt-3">
                <Link to="/login" onClick={closeMenu} className="hover:text-indigo-400">Login</Link>
                <Link to="/register" onClick={closeMenu} className="text-indigo-400 font-semibold">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;