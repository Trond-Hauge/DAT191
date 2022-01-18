"use strict";

import Link from "next/link";
import {useRef, useState} from "react";

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
            <div className="dropdown-content">
              <LoginForm/>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
}

function LoginForm() {
  const emailRef = useRef < HTMLInputElement > (null);
  const passRef = useRef < HTMLInputElement > (null);
  const [message, setMessage] = useState < any > (null);

  async function handleForm() {

    console.log(JSON.stringify({
      email: emailRef.current?.value,
      password: passRef.current?.value
    }));
    
    
    const respt = await fetch("http://localhost:3000/api/user/login", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailRef.current?.value,
        password: passRef.current?.value
      })
    });

    const json = await respt.json();
    setMessage(json);
    

    console.log(emailRef.current?.value, passRef.current?.value);
  }

  return (
    <div className="sign-in-form">
      {JSON.stringify(message)}
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
  );
}
