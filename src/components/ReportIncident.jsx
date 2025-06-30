import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../utils/api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ReportIncident = () => {
    const { id: sessionId } = useParams();
    const { user } = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [events, setEvent] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState("");

    useEffect(() => {
        const fetchEvent = async () => {
            if (!user) {
                setError("Please log in to view events");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await api.events.getActiveEvents();
                if (data.active_events) {
                    setEvent(data.active_events);
                } else if (data.data) {
                    setEvent(data.data);
                } else {
                    setEvent(data);
                }
                setError(null);
            } catch (err) {
                setError(err.message || "Failed to load event");
                setEvent(null);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [user, sessionId]);

    // Handler for select change
    const handleSelectChange = async (e) => {
        const eventId = e.target.value;
        console.log("Selected event ID:", eventId);
        setSelectedEvent(eventId);
        try {
            setLoading(true);
            // Call your API and pass the session id (sessionId) and eventId
            await api.events.handleEventSelection(eventId);
            // Handle response as needed
        } catch (err) {
            console.error("Error handling event selection:", err);
            setError(err.message || "Failed to process event selection");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4 font-montserrat rounded-lg shadow-lg">
            <h1 className="text-4xl text-center font-bold text-orange mb-6 drop-shadow-md uppercase">Report an incident</h1>

            {loading && <p className="text-orange text-3xl">Loading...</p>}
            {error && <p className="text-red-500 text-lg">{error}</p>}
            {events && (
                <select
                    className="mb-4 p-2 rounded border border-orange"
                    value={selectedEvent}
                    onChange={handleSelectChange}
                >
                    <option value="" disabled>Please Select</option>
                    {events.map((event) => (
                        <option key={event.id || event._id} value={event.id || event._id}>
                            {event.name || event.title || `Event ${event.id || event._id}`}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default ReportIncident;