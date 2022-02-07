"use strict";

import Link from "next/link";
import Router from "next/router";
import { useRef, useState } from "react";
import { server } from "../next.config";


export default function Header(cookies) {
  console.log("Boolean input:", cookies);

  const isCookie = cookies ? true : false;

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
          {SignIn(isCookie)}
        </ul>
      </div >
    </div >
  );
}


// Watch: https://www.youtube.com/watch?v=IF6k0uZuypA&ab_channel=Fireship
function SignIn(isCookie) {
  console.log("is bool? ", isCookie);

  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  async function handleForm() {

    const response = await fetch(`${server}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailRef.current?.value,
        password: passRef.current?.value
      })
    });

    const json = await response.json();

    if (json.loggedIn) {
      Router.reload();
    }
  }

  if (isCookie) {
    return (
      <div className="dropdown">
        <a className="dropdown-button" onClick={() => setOpen(!open)}>Account</a>
        {open &&
          <div className="dropdown-content">
            <p>Akka bakka!</p>
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
          <div className="sign-in-form">
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              ref={emailRef}
            />
            <input
              type="password"
              name="password"
              placeholder="Your password"
              ref={passRef}
            />
            <button className="submit-button" onClick={handleForm}>
              Submit
            </button>
            <hr />
            <Link href="/register">
              <a>Create Account</a>
            </Link>
          </div>
        </div>
      }
    </div>
  );
}