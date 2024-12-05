import React from "react";
import { Link } from "react-router-dom";
import style from "./navbar.module.css";

function NavBar() {
  return (
    <nav className={style.navbar}>
      <div className={style.titleName}>Meal Sharing</div>
      <ul className={style.navLinks}>
        <li key="home">
          <Link to="/">
            <b>Home</b>
          </Link>
        </li>
        <li key="meals">
          <Link to="/all-meals">
            <b>Meals</b>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
