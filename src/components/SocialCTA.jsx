import React from "react";

const SocialCTA = () => {
  return (
    <div className="relative flex flex-col my-4 bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg border border-slate-600 rounded-lg w-72 overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange/30 to-transparent rounded-bl-full opacity-40"></div>
      <div className="p-6 flex flex-col justify-center h-full">
        <h5 className="mb-3 text-orange text-xl font-bold uppercase tracking-wide">
          Connect With Us
        </h5>
        <p className="text-white text-sm font-light mb-5">
          Join our community and follow us for the latest updates.
        </p>
        
        <div className="grid grid-cols-3 gap-3 mt-2">
          <a 
            href="https://www.simgrid.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg py-3 px-1 hover:from-slate-700 hover:to-slate-800 transition-all transform hover:-translate-y-1 hover:shadow-md"
          >
            <svg className="w-6 h-6 mb-1 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm-1 15l-6-3V9l6 3v5zm2 0V12l6-3v5l-6 3z" />
            </svg>
            <span className="text-xs text-white font-medium">SimGrid</span>
          </a>
          
          <a 
            href="https://discord.gg/yourlink" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center bg-gradient-to-br from-[#5865F2] to-[#4752C4] rounded-lg py-3 px-1 hover:from-[#4752C4] hover:to-[#3b46a8] transition-all transform hover:-translate-y-1 hover:shadow-md"
          >
            <svg className="w-6 h-6 mb-1 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.211.378-.444.962-.608 1.39a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.39a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            <span className="text-xs text-white font-medium">Discord</span>
          </a>
          
          <a 
            href="https://twitter.com/youraccount" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center bg-gradient-to-br from-[#1DA1F2] to-[#0d8edf] rounded-lg py-3 px-1 hover:from-[#0d8edf] hover:to-[#0b7bcc] transition-all transform hover:-translate-y-1 hover:shadow-md"
          >
            <svg className="w-6 h-6 mb-1 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
            <span className="text-xs text-white font-medium">Twitter</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SocialCTA;