"use strict";

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
        <ul className="nav-right">{signIn()}</ul>
      </div>
    </div>
  );
}

function signIn() {
  return (
    <div className="dropdown">
      <button className="dropdown-button">Sign In</button>
      <div className="dropdown-content" method="post">
        <form className="sign-in-form">
          <input type="text" placeholder="Username" name="username" />
          <input type="text" placeholder="Password" name="password" />
          <button className="submit-button" type="submit">Confirm</button>
        </form>
        <hr />
        <a>Create account</a>
      </div>
    </div>
  );
}
