"use strict";

import Link from "next/link";
import { useRef, useState } from "react";

export default function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<any>(null);

  async function handleForm() {
    const respt = await fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailRef.current?.value,
        password: passRef.current?.value,
      }),
    });

    const json = await respt.json();
    setMessage(json);

    // FOR TESTING!!
    console.log(message);
  }

  return (
    <div className="container">
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
  );
}
