import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="grid grid-rows-2 place-items-center gap-7 px-10">
      <div className="grid grid-cols-3 gap-3 place-items-center">
        <Link className="font-sans text-teal-600 text-lg hover:text-teal-700 font-bold" to="/about">About</Link>
        <Link className="font-sans text-teal-600 text-lg hover:text-teal-700 font-bold" to="/contact">Contact</Link>
        <Link className="font-sans text-teal-600 text-lg hover:text-teal-700 font-bold" to="/team">Team</Link>
      </div>
      <div>
        <p className="text-center">
          Copyright <b>©</b> 2024 - All right reserved by PaySpaze
        </p>
      </div>
    </div>
  );
}

export default Footer;
