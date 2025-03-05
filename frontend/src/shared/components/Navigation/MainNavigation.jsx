//libraries
import React, { useState } from "react";
import "./MainNavigation.css";

//files
import MainHeader from "./MainHeader";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";
//main Function
export default function MainNavigation(props) {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  function OpenDrawerHandler() {
    setDrawerIsOpen(true);
  }

  function CloseDrawerHandler() {
    setDrawerIsOpen(false);
  }
  return (
    <>
      {drawerIsOpen && <Backdrop onClick={CloseDrawerHandler} />}
      <SideDrawer show={drawerIsOpen} onClick={CloseDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={OpenDrawerHandler}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">YourPlaces</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </>
  );
}
