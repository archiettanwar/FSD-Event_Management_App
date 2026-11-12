import { useState } from "react";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function EventCard({ title, description, date, time, location }) {
  const [registered, setRegistered] = useState(false);

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div>
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-100">
            Live
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{description}</p>
        
        <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-sm text-slate-600">
          <p className="flex items-center gap-2">
            <span className="font-medium text-slate-700">📅 Date:</span> {formatDate(date)}
          </p>
          <p className="flex items-center gap-2">
            <span className="font-medium text-slate-700">⏰ Time:</span> {time}
          </p>
          <p className="flex items-center gap-2">
            <span className="font-medium text-slate-700">📍 Location:</span> {location}
          </p>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        {registered ? (
          <p className="font-semibold text-green-600 text-sm flex items-center gap-1">
            ✓ Successfully Registered!
          </p>
        ) : (
          <button
            onClick={() => setRegistered(true)}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 shadow-sm"
          >
            Register Now
          </button>
        )}
      </div>
    </div>
  );
}

export default EventCard;