import React from "react";
import { Link } from "react-router-dom";

const Cards = ({ user }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 justify-items-center">
            <div className="relative flex flex-col my-6 bg-gray-900 shadow-sm border border-slate-600 rounded-lg w-72">
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
        </div>

    );
};
export default Cards;
