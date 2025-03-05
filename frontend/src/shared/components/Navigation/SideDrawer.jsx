import React from "react";
import "./SideDrawer.css";
import ReactDom from "react-dom";
import { CSSTransition } from "react-transition-group";
export default function SideDrawer(props) {
  const sideDrawer = (
    <CSSTransition
      in={props.show}
      timeout={200}
      classNames="slide-in-left"
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer" onClick={props.onClick}>
        {props.children}
      </aside>
    </CSSTransition>
  );
  return ReactDom.createPortal(
    sideDrawer,
    document.getElementById("drawer-hook")
  );
}
