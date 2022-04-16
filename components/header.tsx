"use strict";

import Link from "next/link";
import Router from "next/router";
import { useState, useEffect } from "react";
import { server } from "../next.config";
import LoginForm from "./LoginForm";

export default function Header(permission) {
  const isAdmin = permission === "admin";

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
          { isAdmin &&
            <li>
              <Link href="/admin">
                <a>Admin Panel</a>
              </Link>
            </li>
          }
          <li>
            {SignIn(permission ? true : false)}
          </li>
        </ul>
      </div >
    </div >
  );
}

// Watch: https://www.youtube.com/watch?v=IF6k0uZuypA&ab_channel=Fireship
function SignIn(loggedIn) {
  const [open, setOpen] = useState(false);

  function handleKeyDown(e) {
    switch (e.code) {
      case "Escape": {
        if (open) setOpen(false);
      }
      break;
    }
  }

  useEffect( () => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  })

  async function logout() {
    await fetch(`${server}/api/user/logout`);
    Router.reload();
  }

  const loginForm = LoginForm();

  if (loggedIn) {
    return (
      <div className="dropdown">
        <a className="dropdown-button" onClick={() => setOpen(!open)}>Account</a>
        {open &&
          <div className="dropdown-content">
            <Link href="/user"><a>Account Settings</a></Link>
            <Link href="/user/publications"><a>Your Publications</a></Link>
            <a>Meetings</a> 
            <hr/>
            <a onClick={logout}>Log out</a>
          </div>
        }
      </div>
    );
  }

  return (
    <div className="dropdown">
      <a className="dropdown-button" onClick={() => setOpen(!open)}>Sign In</a>
      {open &&
        <div className="dropdown-content">
          {loginForm}
        </div>
      }
    </div>
  );
}