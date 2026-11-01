import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import Loading from "../components/Loading";

const eventData = [
  { id: 1, title: "Tech Fest 2026", description: "A technology event for students.", date: "20 September 2026", location: "Mumbai" },
  { id: 2, title: "React Workshop", description: "Learn React from basics to advanced.", date: "25 September 2026", location: "Pune" },
  { id: 3, title: "AI Conference", description: "Explore the latest developments in AI.", date: "30 September 2026", location: "Bangalore" },
];

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEvents(eventData);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-slate-900">Upcoming Events</h1>
        <p className="mt-2 text-slate-600">Explore our upcoming events and register for the ones you like.</p>
        
        {loading ? (
          <Loading />
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                description={event.description}
                date={event.date}
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