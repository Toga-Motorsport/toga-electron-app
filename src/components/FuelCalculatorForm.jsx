import React, { useState } from "react";

const FuelCalculatorForm = () => {
    const [lapTime, setLapTime] = useState("");
    const [fuelPerLap, setFuelPerLap] = useState("");
    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");
    const [fuelCapacity, setFuelCapacity] = useState("");
    const [totalFuel, setTotalFuel] = useState(null);
    const [stintsNeeded, setStintsNeeded] = useState(null);
    const [lapsPerStint, setLapsPerStint] = useState(null);

    const calculateFuel = (e) => {
        e.preventDefault();
        
        // Convert lap time (mm:ss.ms) to seconds
        const [lapMinutes, lapSeconds] = lapTime.split(":").map(parseFloat);
        const lapTimeInSeconds = (lapMinutes * 60) + lapSeconds;
        
        // Calculate total race time in seconds
        const totalRaceTimeInSeconds = (parseInt(hours) * 3600) + (parseInt(minutes) * 60);
        
        // Calculate estimated number of laps
        const estimatedLaps = Math.ceil(totalRaceTimeInSeconds / lapTimeInSeconds);
        
        // Calculate total fuel needed
        const fuel = estimatedLaps * parseFloat(fuelPerLap);
        
        // Calculate stints needed based on fuel capacity
        const tankCapacity = parseFloat(fuelCapacity);
        const stints = Math.ceil(fuel / tankCapacity);
        
        // Calculate average laps per stint
        const avgLapsPerStint = Math.floor(estimatedLaps / stints);
        
        setTotalFuel(fuel.toFixed(2));
        setStintsNeeded(stints);
        setLapsPerStint(avgLapsPerStint);
    };

    return (
        <div className="w-1/2 mx-w-2xl mx-auto p-9 bg-gray-900 rounded-lg shadow-md mt-3">
            <h2 className="text-2xl font-bold text-center text-orange mb-6">Race Fuel Calculator</h2>
            <form onSubmit={calculateFuel}>
                <div className="mb-4">
                    <label htmlFor="lapTime" className="block text-sm font-medium text-white mb-1">
                        Lap Time (mm:ss.ms)
                    </label>
                    <input
                        id="lapTime"
                        type="text"
                        placeholder="e.g. 1:45.500"
                        value={lapTime}
                        onChange={(e) => setLapTime(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange"
                    />
                </div>
                
                <div className="mb-4">
                    <label htmlFor="fuelPerLap" className="block text-sm font-medium text-white mb-1">
                        Fuel per Lap (L)
                    </label>
                    <input
                        id="fuelPerLap"
                        type="number"
                        step="0.01"
                        placeholder="e.g. 2.5"
                        value={fuelPerLap}
                        onChange={(e) => setFuelPerLap(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange"
                    />
                </div>
                
                <div className="mb-4">
                    <label htmlFor="fuelCapacity" className="block text-sm font-medium text-white mb-1">
                        Fuel Tank Capacity (L)
                    </label>
                    <input
                        id="fuelCapacity"
                        type="number"
                        step="0.1"
                        placeholder="e.g. 85"
                        value={fuelCapacity}
                        onChange={(e) => setFuelCapacity(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange"
                    />
                </div>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-1">Race Duration</label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            placeholder="Hours"
                            min="0"
                            value={hours}
                            onChange={(e) => setHours(e.target.value)}
                            required
                            className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange"
                        />
                        <span className="text-orange">hrs</span>
                        <input
                            type="number"
                            placeholder="Minutes"
                            min="0"
                            max="59"
                            value={minutes}
                            onChange={(e) => setMinutes(e.target.value)}
                            required
                            className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange"
                        />
                        <span className="text-orange">min</span>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="w-full py-2 px-4 bg-orange text-white font-semibold rounded-md shadow-sm hover:bg-white hover:text-orange focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2 transition-colors"
                >
                    Calculate
                </button>
                
                {totalFuel !== null && (
                    <div className="mt-6 p-4 bg-lightorange rounded-md border border-orange">
                        <h3 className="text-lg font-medium text-white mb-3">Race Strategy</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-white">Total Fuel Required</p>
                                <p className="text-xl font-bold text-black">{totalFuel} L</p>
                            </div>
                            <div>
                                <p className="text-sm text-white">Stints Needed</p>
                                <p className="text-xl font-bold text-black">{stintsNeeded}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm text-white">Laps Per Stint (avg)</p>
                                <p className="text-xl font-bold text-black">{lapsPerStint}</p>
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
};

export default FuelCalculatorForm;