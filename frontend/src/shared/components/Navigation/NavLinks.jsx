import { useContext } from "react";
import "./NavLinks.css";
import { AuthContext } from "../../context/auth-context";
import { NavLink } from "react-router-dom";
export default function NavLinks(props) {
  const auth = useContext(AuthContext);
  return (
    <>
      <ul className="nav-links">
        <li>
          <NavLink to="/" exact>
            ALL USERS
          </NavLink>
        </li>
        {auth.isLoggedIn && (
          <li>
            <NavLink to="/u1/places">MY PLACES</NavLink>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <NavLink to="/places/new">ADD PLACE</NavLink>
          </li>
        )}
        {!auth.isLoggedIn && (
          <li>
            <NavLink to="/auth">AUTHENTICATE</NavLink>
          </li>
        )}
      </ul>
    </>
  );
}
