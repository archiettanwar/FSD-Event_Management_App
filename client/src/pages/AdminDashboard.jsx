import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { getAdminDashboard, getEvents } from "../services/api";
import Loading from "../components/Loading";

function AdminDashboard() {
  const { user, token, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  });
  const [actionMessage, setActionMessage] = useState("");

  async function loadData() {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const [adminData, eventsData] = await Promise.all([
        getAdminDashboard(token),
        getEvents(),
      ]);
      setStats(adminData.stats);
      setEvents(eventsData);
    } catch (err) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [token]);

  async function handleCreateEvent(e) {
    e.preventDefault();
    setActionMessage("");
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create event");
      setActionMessage(`🎉 Created "${data.event.title}" & sent WebSocket notification!`);
      setNewEvent({ title: "", description: "", date: "", time: "", location: "" });
      loadData();
    } catch (err) {
      setActionMessage(`Error: ${err.message}`);
    }
  }

  async function handleUpdateEvent(eventItem) {
    setActionMessage("");
    try {
      const updatedTitle = eventItem.title.includes("[Updated]")
        ? eventItem.title
        : `${eventItem.title} [Updated]`;
      const res = await fetch(`/api/events/${eventItem._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...eventItem,
          title: updatedTitle,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update event");
      setActionMessage(`✏️ Updated "${data.event.title}" & sent WebSocket notification!`);
      loadData();
    } catch (err) {
      setActionMessage(`Error: ${err.message}`);
    }
  }

  async function handleDeleteEvent(id, title) {
    if (!window.confirm(`Delete event "${title}"?`)) return;
    setActionMessage("");
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete event");
      setActionMessage(`🗑️ Deleted "${title}" & sent WebSocket notification!`);
      loadData();
    } catch (err) {
      setActionMessage(`Error: ${err.message}`);
    }
  }

  // Case 1: Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 px-6 py-20">
        <div className="mx-auto max-w-lg rounded-xl border border-red-200 bg-white p-8 text-center shadow-md">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">
            🔒
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Authentication Required</h1>
          <p className="mt-2 text-sm text-slate-600">
            You must be logged in with an administrator account to view this page.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/login"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Logged in, but NOT an admin (Access Restriction demo for Screenshot 11!)
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-100 px-6 py-20">
        <div className="mx-auto max-w-xl rounded-xl border-2 border-red-300 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600">
            ⛔
          </div>
          <span className="mt-3 inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-700">
            403 Forbidden - Access Restricted
          </span>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">
            Administrator Access Required
          </h1>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Sorry, <strong className="text-slate-800">{user.name}</strong>. Your account has the role{" "}
            <span className="rounded bg-slate-200 px-2 py-0.5 font-mono text-xs font-semibold text-slate-800">
              user
            </span>
            . Only accounts with the{" "}
            <span className="rounded bg-amber-100 px-2 py-0.5 font-mono text-xs font-semibold text-amber-800">
              admin
            </span>{" "}
            role are authorized to view and manage this dashboard.
          </p>

          <div className="mt-6 rounded-lg bg-slate-50 p-4 text-left text-xs text-slate-600 border border-slate-200">
            <p className="font-semibold text-slate-700">RBAC Security Policy:</p>
            <p className="mt-1">Route: <code className="text-indigo-600">/admin (GET /api/auth/admin-dashboard)</code></p>
            <p>Required Role: <code className="text-indigo-600">admin</code> | Current User Role: <code className="text-red-600">{user.role}</code></p>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <Link
              to="/events"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-700"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Logged in AND user is admin!
  return (
    <div className="min-h-screen bg-slate-100 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-slate-900">Admin Control Panel</h1>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold uppercase text-amber-800 border border-amber-200">
                Authorized Admin
              </span>
            </div>
            <p className="mt-1 text-slate-600">
              Logged in as <strong className="text-slate-800">{user.name}</strong> ({user.email})
            </p>
          </div>
          <Link
            to="/events"
            className="self-start rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
          >
            View Public Events
          </Link>
        </div>

        {loading && <Loading />}

        {!loading && error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {!loading && stats && (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Total Registered Users</p>
              <p className="mt-2 text-3xl font-bold text-indigo-600">{stats.totalUsers}</p>
              <p className="mt-1 text-xs text-slate-400">Stored in MongoDB users collection</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Total Live Events</p>
              <p className="mt-2 text-3xl font-bold text-emerald-600">{stats.totalEvents}</p>
              <p className="mt-1 text-xs text-slate-400">Stored in MongoDB events collection</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">JWT Token Status</p>
              <p className="mt-2 text-2xl font-bold text-green-600">Verified & Active</p>
              <p className="mt-1 text-xs text-slate-400">Role: admin (full access)</p>
            </div>
          </div>
        )}

        {/* Action Message Banner */}
        {actionMessage && (
          <div className="mt-6 rounded-lg bg-indigo-50 border border-indigo-200 p-4 text-indigo-900 font-medium">
            {actionMessage}
          </div>
        )}

        {/* Real-Time Event Creation Section (Screenshot 1) */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Create New Event</h2>
              <p className="text-sm text-slate-500">Creating an event automatically triggers a real-time WebSocket notification.</p>
            </div>
            <span className="rounded bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-800">
              ⚡ Live WebSocket Broadcast
            </span>
          </div>

          <form onSubmit={handleCreateEvent} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-slate-700">Event Title</label>
              <input
                type="text"
                placeholder="e.g. Hackathon 2026"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">Date</label>
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">Time</label>
              <input
                type="text"
                placeholder="e.g. 10:00 AM"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700">Location</label>
              <input
                type="text"
                placeholder="e.g. Auditorium Hall A"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700">Description</label>
              <input
                type="text"
                placeholder="Brief description of the event..."
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-700"
              >
                Create Event & Broadcast (POST)
              </button>
            </div>
          </form>
        </div>

        {/* Real-Time Event Management Table (Screenshots 2 & 3) */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Live Events Management</h2>
          <p className="text-sm text-slate-500">Updating or deleting an event broadcasts real-time notifications to all users.</p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-700">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((ev) => (
                  <tr key={ev._id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-medium text-slate-900">{ev.title}</td>
                    <td className="px-4 py-3">{ev.location}</td>
                    <td className="px-4 py-3">{ev.time}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleUpdateEvent(ev)}
                        className="rounded bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 border border-amber-500/20 hover:bg-amber-500/20"
                        title="Broadcasts UPDATE notification via Socket.IO"
                      >
                        Update (PUT)
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(ev._id, ev.title)}
                        className="rounded bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 border border-red-200 hover:bg-red-100"
                        title="Broadcasts DELETE notification via Socket.IO"
                      >
                        Delete (DEL)
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
