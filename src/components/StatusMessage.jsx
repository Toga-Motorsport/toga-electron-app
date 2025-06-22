import { useState, useEffect } from 'react';

const StatusMessage = ({ type, message }) => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        if (!message.includes('...')) return;

        const interval = setInterval(() => {
            setDots(prev => prev.length >= 4 ? '' : prev + '.');
        }, 700);

        return () => clearInterval(interval);
    }, [message]);

    // Determine classes based on message type
    const typeClasses = {
        success: 'text-orange',
        error: 'text-red-600 bg-red-100',
    };

    // Display message with animated dots if it ends with "..."
    const displayMessage = message.endsWith('...')
        ? message.replace(/\.{3}$/, '') + dots
        : message;

    return (
        <div className={`
      ${typeClasses[type]} 
      font-bold 
      p-2.5 
      rounded 
      flex 
      items-center 
      justify-center 
      gap-2
      absolute 
      top-1/2 
      left-1/2 
      transform 
      -translate-x-1/2 
      -translate-y-1/2
      text-4xl
      uppercase
      w-full
    `}>
            {displayMessage}
        </div>
    );
};

export default StatusMessage;
