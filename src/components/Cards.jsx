import React from "react";
import { Link } from "react-router-dom";

const Cards = ({ user }) => {
    // Function to open links in default browser
    const handleLinkClick = (e, url) => {
    e.preventDefault();
    console.log('handleLinkClick called with URL:', url);
    console.log('window.electron available:', !!window.electron);
    console.log('window.electron.openExternal:', window.electron?.openExternal);
    
    // Use the exposed electron API through the window object
    if (window.electron && window.electron.openExternal) {
        console.log('Using electron.openExternal');
        window.electron.openExternal(url);
    } else {
        console.log('Using fallback window.open');
        // Fallback - just open in the current window
        window.open(url, '_blank');
    }
};
    
    return (
        <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4 gap-4 justify-items-center mx-auto">
            <div className="relative flex flex-col my-4 bg-gray-900 shadow-sm border border-slate-600 rounded-lg w-72">
                <div className="p-4 flex flex-col justify-center h-full">
                    <h5 className="mb-2 text-orange text-xl font-semibold uppercase">
                        Report an Incident
                    </h5>
                    <p className="text-white text-xs font-normal">
                        Taken part in a race and want to report an incident?
                    </p>
                    <Link to="/report-incident"
                        className="rounded-md bg-slate-800 py-2 px-4 mt-6 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button">
                        Report now
                    </Link>
                </div>
            </div>
            <div className="relative flex flex-col my-4 bg-gray-900 shadow-sm border border-slate-600 rounded-lg w-72">
                <div className="p-4 flex flex-col justify-center h-full">
                    <h5 className="mb-2 text-orange text-xl font-semibold uppercase">
                        Fuel Calcualtion
                    </h5>
                    <p className="text-white text-xs font-normal">
                        Calculate the fuel needed for your race.
                    </p>
                    <Link to="/fuel-calculator"
                        className="rounded-md bg-slate-800 py-2 px-4 mt-6 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button">
                        Calculate now
                    </Link>
                </div>
            </div>
            <div className="relative flex flex-col my-4 bg-gray-900 shadow-sm border border-slate-600 rounded-lg w-72">
                <div className="p-4 flex flex-col justify-center h-full">
                    <h5 className="mb-2 text-orange text-xl font-semibold uppercase">
                        My Events
                    </h5>
                    <p className="text-white text-xs font-normal">
                        Events that I have taken part in.
                    </p>
                    <Link to="/my-events"
                        className="rounded-md bg-slate-800 py-2 px-4 mt-6 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="button">
                        View My Events
                    </Link>
                </div>
            </div>
            <div className="relative flex flex-col my-4 bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg border border-slate-600 rounded-lg w-72 overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange/30 to-transparent rounded-bl-full opacity-40"></div>
                <div className="p-3 flex flex-col justify-center h-full">
                    <h5 className="mb-2 text-orange text-xl font-bold uppercase tracking-wide">
                        Connect With Us
                    </h5>
                    <p className="text-white text-sm font-normal mb-2">
                        Join our community and follow us for the latest updates.
                    </p>
                    
                    <div className="grid grid-cols-3 gap-3 mt-1">
                        <a 
                            href="https://www.thesimgrid.com/communities/toga-motorsport" 
                            onClick={(e) => handleLinkClick(e, "https://www.thesimgrid.com/communities/toga-motorsport")}
                            className="flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg py-2 px-1 hover:from-slate-700 hover:to-slate-800 transition-all transform hover:-translate-y-1 hover:shadow-md"
                        >
                            <svg className="w-4 h-4 mb-1 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm-1 15l-6-3V9l6 3v5zm2 0V12l6-3v5l-6 3z" />
                            </svg>
                            <span className="text-xs text-white font-medium">SimGrid</span>
                        </a>
                        
                        <a 
                            href="https://discord.gg/kP8GtcS8jr" 
                            onClick={(e) => handleLinkClick(e, "https://discord.gg/kP8GtcS8jr")}
                            className="flex flex-col items-center justify-center bg-gradient-to-br from-[#5865F2] to-[#4752C4] rounded-lg py-2 px-1 hover:from-[#4752C4] hover:to-[#3b46a8] transition-all transform hover:-translate-y-1 hover:shadow-md"
                        >
                            <svg className="w-4 h-4 mb-1 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.211.378-.444.962-.608 1.39a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.39a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                            </svg>
                            <span className="text-xs text-white font-medium">Discord</span>
                        </a>
                        
                        <a 
                            href="https://youtube.com/@togamotorsport" 
                            onClick={(e) => handleLinkClick(e, "https://youtube.com/@togamotorsport")}
                            className="flex flex-col items-center justify-center bg-gradient-to-br from-[#FF0000] to-[#CC0000] rounded-lg py-2 px-1 hover:from-[#CC0000] hover:to-[#AA0000] transition-all transform hover:-translate-y-1 hover:shadow-md"
                        >
                            <svg className="w-4 h-4 mb-1 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            <span className="text-xs text-white font-medium">YouTube</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cards;