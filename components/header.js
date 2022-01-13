"use strict";

import LoginForm from ".//LoginForm.js";

import Link from "next/link";

export function Header() {
  return (
    <div className="navbar">
      <div className="nav-container-left">
        <ul className="nav-left">
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <a>About</a>
            </Link>
          </li>
        </ul>
      </div>

      <div className="nav-container-right">
        <ul className="nav-right">
          <div className="dropdown">
            <button className="dropdown-button">Sign In</button>
            <div className="dropdown-content" method="post">
              <LoginForm />
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
}
