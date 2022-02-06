"use strict";

import Link from "next/link";
import { useRef, useState } from "react";
import { server } from "../next.config";


export default function Header(bool) {
  console.log("Boolean input:", bool);

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
          {SignIn(bool)}
        </ul>
      </div >
    </div >
  );
}


// Watch: https://www.youtube.com/watch?v=IF6k0uZuypA&ab_channel=Fireship
function SignIn(bool) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const [loggedIn, setLoggedIn] = useState(bool);
  const [open, setOpen] = useState();


  async function handleForm() {
    console.log("STARTING!");
    

    const response = await fetch(`${server}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailRef.current?.value,
        password: passRef.current?.value
      })
    });

    console.log("HELLO!!!");
    

    const json = await response.json();
    setLoggedIn(json.loggedIn);
    console.log("Fetched: ", json.loggedIn, " - Type: ", typeof json.loggedIn);
  }

  if (loggedIn) {
    return (
      <div className="dropdown">
        <button className="dropdown-button">Account</button>
        <div className="dropdown-content">
          <p>Akka bakka!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dropdown">
      <a className="dropdown-button">Sign In</a>
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
    </div>
  );
}