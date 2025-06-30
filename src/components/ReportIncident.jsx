import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../utils/api";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const ReportIncident = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [event, setEvent] = useState(null);

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
                const data = await api.events.getActiveEvents();
                
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


    return (
        <div></div>
    );
};

export default ReportIncident;