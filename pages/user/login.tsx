"use strict";

import Link from "next/link";
import { useRef, useState } from "react";
import Header from "../../components/header";
import { server } from "../../next.config";
import { emailCooldownSeconds } from "../../next.config";

export default function Login({isCookie}) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const forgottenPasswordRef = useRef<HTMLAnchorElement>(null);
  const [message, setMessage] = useState<any>(null);
  const [time, setTime] = useState<any>(null);

  async function handleForm() {
    const res = await fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailRef.current?.value,
        password: passRef.current?.value,
      }),
    });

    const json = await res.json();
    setMessage(json);

    // FOR TESTING!!
    console.log(message);
  }

  async function handleForgottenPassword() {
    if (!time || (Date.now() - time) / 1000 >= emailCooldownSeconds) {
      const res = await fetch(`${server}/api/user/requestPasswordReset`, {
        method: "GET",
        headers: { useremail: emailRef.current?.value }
      })
  
      const { message } = await res.json();
      forgottenPasswordRef.current.innerText = message;

      setTime(Date.now());
    }
    else {
      forgottenPasswordRef.current.innerText = "An email was already sent, please wait a bit before using this function again.";
    }
  }

  return (
    <>
      {Header(isCookie)}
      <main>
        <div className="main-content">
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
        <a ref={forgottenPasswordRef} onClick={handleForgottenPassword}>Forgotten password?</a>
        <Link href="/register">
          <a>Create Account</a>
        </Link>
      </main>
    </>
  );
}

export async function getServerSideProps(appContext) {
  const cookie = appContext.req?.headers.cookie;

  const isCookie = cookie ? true : false;
  return { props: { isCookie } };
}