const Event = require("../models/Event");

async function getEvents(req, res) {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function getEventById(req, res) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).json({ message: "Invalid event ID" });
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function createEvent(req, res) {
  try {
    const { title, description, date, time, location } = req.body;
    if (
      !title || !String(title).trim() ||
      !description || !String(description).trim() ||
      !date ||
      !time || !String(time).trim() ||
      !location || !String(location).trim()
    ) {
      return res.status(400).json({ message: "All event fields (title, description, date, time, location) are required" });
    }
    const event = await Event.create({
      title: String(title).trim(),
      description: String(description).trim(),
      date,
      time: String(time).trim(),
      location: String(location).trim(),
    });

    // Broadcast real-time Socket.IO notification to all connected clients (Screenshot 1)
    const io = req.app.get("io");
    if (io) {
      io.emit("eventNotification", {
        type: "CREATE",
        title: "New Event Created!",
        message: `Admin created event: "${event.title}" scheduled for ${new Date(event.date).toLocaleDateString()}.`,
        event,
        timestamp: new Date().toISOString(),
      });
    }

    res.status(201).json({ message: "Event created successfully", event });
  } catch (err) {
    if (err.name === "ValidationError")
      return res.status(400).json({ message: err.message });
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function updateEvent(req, res) {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body cannot be empty" });
    }
    const { title, description, date, time, location } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = String(title).trim();
    if (description !== undefined) updateData.description = String(description).trim();
    if (date !== undefined) updateData.date = date;
    if (time !== undefined) updateData.time = String(time).trim();
    if (location !== undefined) updateData.location = String(location).trim();

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Broadcast real-time Socket.IO notification to all connected clients (Screenshot 2)
    const io = req.app.get("io");
    if (io) {
      io.emit("eventNotification", {
        type: "UPDATE",
        title: "Event Updated!",
        message: `Admin updated event details for: "${event.title}".`,
        event,
        timestamp: new Date().toISOString(),
      });
    }

    res.status(200).json({ message: "Event updated successfully", event });
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).json({ message: "Invalid event ID" });
    if (err.name === "ValidationError")
      return res.status(400).json({ message: err.message });
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function deleteEvent(req, res) {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Broadcast real-time Socket.IO notification to all connected clients (Screenshot 3)
    const io = req.app.get("io");
    if (io) {
      io.emit("eventNotification", {
        type: "DELETE",
        title: "Event Deleted / Cancelled",
        message: `Admin deleted event: "${event.title}".`,
        eventId: req.params.id,
        timestamp: new Date().toISOString(),
      });
    }

    res.status(200).json({ message: "Event deleted successfully", event });
  } catch (err) {
    if (err.name === "CastError")
      return res.status(400).json({ message: "Invalid event ID" });
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

module.exports = { getEvents, getEventById, createEvent, updateEvent, deleteEvent };