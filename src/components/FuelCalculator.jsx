import React from "react";
import { Link } from "react-router-dom";
import FuelCalculatorForm from "./FuelCalculatorForm";

const FuelCalculator = () => {

    return (
        <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4 font-montserrat rounded-lg shadow-lg">
            <h1 className="text-orange text-2xl uppercase">Fuel Calculator</h1>
            <p className="text-white text-sm">Please use the fields below to calculate the fuel needed for this race</p>
            <FuelCalculatorForm />
            <Link className="uppercase font-bold text-white bg-orange rounded-md px-5 py-1 mt-3 shaddow-lg" to="/">Back Home</Link>
        </div>
    ) ;
};

export default FuelCalculator;