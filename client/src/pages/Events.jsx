import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import Loading from "../components/Loading";
import { getEvents } from "../services/api";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadEvents() {
    setLoading(true);
    setError("");
    try {
      const data = await getEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load events");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Upcoming Events</h1>
            <p className="mt-2 text-slate-600">Explore events retrieved live from MongoDB database.</p>
          </div>
          {!loading && !error && events.length > 0 && (
            <span className="self-start rounded-full bg-indigo-100 px-3.5 py-1 text-sm font-semibold text-indigo-800">
              {events.length} {events.length === 1 ? "Event Found" : "Events Found"}
            </span>
          )}
        </div>

        {loading && <Loading />}

        {!loading && error && (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6 text-red-800">
            <h3 className="font-semibold text-red-900">Failed to load events</h3>
            <p className="mt-1 text-sm">{error}</p>
            <button
              onClick={loadEvents}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-lg font-medium text-slate-700">No events found in the database.</p>
            <p className="mt-1 text-sm text-slate-500">Create an event using Postman to see it displayed here!</p>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event._id}
                title={event.title}
                description={event.description}
                date={event.date}
                time={event.time}
                location={event.location}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;