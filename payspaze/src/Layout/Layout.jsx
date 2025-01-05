import React from "react";
import { Outlet } from "react-router-dom";
import { Footer, Header } from "../Components/index.jsx";

function Layout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default Layout;
