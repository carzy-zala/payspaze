import React from "react";
import { Button } from "../Components/index.jsx";
import { useNavigate } from "react-router-dom";

function NoFound() {
    const navigator = useNavigate()
  return (
    <div className="grid grid-rows-[0fr_0fr_0fr_0fr] gap-24 place-items-center mt-20">
      <div className="text-4xl">404 - Page Not Found</div>
      <div>
        <Button onClick={()=> navigator("/")} children="Go back to Home Page" className="text-green-600 text-lg outline-none font-semibold" />
      </div>
      <div className="grid place-items-center">
        <img src="/404.jpg" className="w-[35%]" />
      </div>
      <div className="text-4xl pb-3">
        We're sorry, but the page you are looking for does not exist.
      </div>
    </div>
  );
}

export default NoFound;
