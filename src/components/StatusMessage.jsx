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
        success: 'text-orange border-orange/30 bg-orange/10',
        error: 'text-red-600 border-red-300/30 bg-red-100',
    };

    // Display message with animated dots if it ends with "..."
    const displayMessage = message.endsWith('...')
        ? message.replace(/\.{3}$/, '') + dots
        : message;

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <div className={`
                ${typeClasses[type]}
                font-bold
                p-4
                rounded-lg
                border
                shadow-lg
                flex
                items-center
                justify-center
                gap-3
                absolute
                top-1/2
                left-1/2
                transform
                -translate-x-1/2
                -translate-y-1/2
                text-4xl
                uppercase
                w-5/6
                max-w-3xl
                backdrop-blur-sm
                animate-slide-up
                transition-all
                duration-300
                text-white
            `}>
                {type === 'success' && (
                    <span className="text-orange">✓</span>
                )}
                {type === 'error' && (
                    <span className="text-red-600">⚠</span>
                )}
                <span className="tracking-wider">{displayMessage}</span>
            </div>
        </div>
    );
};

export default StatusMessage;
