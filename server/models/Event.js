const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: [true, "Title is required"] },
        description: { type: String, required: [true, "Description is required"] },
        date: { type: Date, required: [true, "Date is required"] },
        time: { type: String, required: [true, "Time is required"] },
        location: { type: String, required: [true, "Location is required"] },
    },
    { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
