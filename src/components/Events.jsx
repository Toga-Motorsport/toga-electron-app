import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const Events = () => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
                <p className="text-white">Loading events...</p>
            </div>
        );
    }
    
    if (!user) {
        return (
            <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
                <h1 className="text-orange text-2xl uppercase mb-4">My Events</h1>
                <p className="text-white text-sm mb-4">Please log in to view your events</p>
                <Link className="uppercase font-bold text-white bg-orange rounded-md px-5 py-1 shadow-lg" to="/">Back Home</Link>
            </div>
        );
    }
    return (
         <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4 font-montserrat rounded-lg shadow-lg">
            <h1 className="text-orange text-2xl uppercase">My Events</h1>
            <p className="text-white text-sm">All my upcoming and previous events</p>

            
 { user && user.simgrid_events && user.simgrid_events.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 justify-items-center mx-auto">
        {user.simgrid_events
            .sort((a, b) => new Date(b.championship.start_date) - new Date(a.championship.start_date))
            .map((event, index) => {
                const eventDate = new Date(event.championship.start_date);
                const currentDate = new Date();
                const isUpcoming = eventDate > currentDate;

                return (
                    <div key={index} className="relative flex flex-col my-4 bg-gray-900 shadow-sm border border-slate-600 rounded-lg w-72">
                        <div className="p-4 pt-8 flex flex-col justify-center h-full">
                            <h5 className="mb-2 text-orange text-xs font-semibold uppercase pr-12">
                                {event.championship.name}
                            </h5>
                            <p className="text-white text-xs font-normal">
                                {event.championship.game} - <span className="text-orange font-semibold">{new Date(event.championship.start_date).toLocaleDateString()}</span>
                            </p>
                            <Link to={`/event/${event.championship_id}`}
                                className="rounded-md bg-slate-800 py-2 px-4 mt-6 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                                type="button">
                                View Event
                            </Link>
                        </div>
                    </div>
                );
            })}
    </div>
) : (
    <p className="text-white text-sm mt-4">No events found.</p>
)}


                
    
                    



           
            <Link className="uppercase font-bold text-white bg-orange rounded-md px-5 py-1 mt-3 shaddow-lg" to="/">Back Home</Link>
        </div>
    );
};


export default Events;