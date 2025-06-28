import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../utils/api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EventSingle = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchEvent = async () => {
            if (!user) {
                setError("Please log in to view events");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                console.log(`Fetching event ${id}...`);
                
                // Use the API utility which handles authentication
                const data = await api.events.getEvent(id);
                
                // Handle different response formats
                if (data.event) {
                    setEvent(data.event);
                } else if (data.data) {
                    setEvent(data.data);
                } else {
                    setEvent(data);
                }
                
                console.log('Event fetched successfully:', data);
                setError(null);
            } catch (err) {
                console.error('Error fetching event:', err);
                setError(err.message || "Failed to load event");
                setEvent(null);
            } finally {
                setLoading(false);
            }
        };
        
        fetchEvent();
    }, [id, user]);

    if (error) return <div>Error: {error}</div>;
    if (!event) return <div>Loading...</div>;

    return (
        <div>
            <div className="container mx-auto px-3 py-3 w-75 justify-center flex flex-col items-center">
                <h2 className="text-5xl text-orange font-semibold text-center border-b border-orange mb-3 w-1/2 pb-2 uppercase">{event.name}</h2>
                <img src={event.image} alt={event.name} className="w-1/2 h-auto rounded-lg shadow-md" />
                <Link className="uppercase font-bold text-white bg-orange rounded-md px-5 py-1 mt-3 shaddow-lg" to="/my-events">Back To Events</Link>
            </div>
            
        </div>
    );
};

export default EventSingle;