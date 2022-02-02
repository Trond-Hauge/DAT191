"use strict";

import Link from "next/link";
import { useRef, useState } from "react";
import { server } from "../next.config";


export default function Header(boolski?) {
  console.log(boolski);
  

  let button;
  
  if (boolski) {
    button = Account();
  } else {
    button = SignIn();
  }

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
          {button}
        </ul>
      </div >
    </div >
  );
}

async function cookieValue (cookie) {
  console.log("HELLO! I JUST ARRIVED!!");
  
  const response = await fetch(`${server}/api/user/isLoggedIn`, {
    headers: {
      cookie: cookie!
    }
  });
  const json = await response.json();
  console.log("Inside",json.loggedIn);
  
  return json?.loggedIn;
}

function SignIn() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<any>(null);

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
    setMessage(json);
  }  

  return (
    <div className="dropdown">
      <button className="dropdown-button">Sign In</button>
      <div className="dropdown-content">
        <div className="sign-in-form">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              ref={emailRef}
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Your password"
              ref={passRef}
            />
          </div>
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

function Account() {
  return (
    <div className="dropdown">
      <button className="dropdown-button">Account</button>
      <div className="dropdown-content">
        <p>Akka bakka!</p>
      </div>
    </div>
  );
}