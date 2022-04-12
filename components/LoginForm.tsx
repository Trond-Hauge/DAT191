"use strict";

import React from "react";
import Link from "next/link";
import { useRef, useEffect } from "react";
import { server } from "../next.config";
import Router from "next/router";

export default function LoginForm(redirectPath?) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const msgRef = useRef<HTMLParagraphElement>(null);

  function handleKeyDown(e) {
    switch (e.code) {
      case "Enter": {
        handleForm();
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

  async function handleForm() {
    const res = await fetch(`${server}/api/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailRef.current?.value,
        password: passRef.current?.value
      })
    });

    const { message } = await res.json();

    if (res.status === 200) {
      if (redirectPath) Router.push(redirectPath);
      else Router.reload();
    }
    else if (res.status === 207) {
      msgRef.current.innerText = message;
    }
  }

  async function handleForgottenPassword() {
    const email = emailRef.current.value;
    const res = await fetch(`${server}/api/user/requestPasswordReset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
      }),
    });

    const { message } = await res.json();
    msgRef.current.innerText = message;
  }

  return (
    <form className="sign-in-form">
      <p ref={msgRef}></p>
      <input
        type="email"
        name="email"
        placeholder="Your email address"
        ref={emailRef}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Your password"
        ref={passRef}
        required
      />
      <a onClick={handleForm} type="button">Submit</a>
      <a onClick={handleForgottenPassword}>Forgot password?</a>
      <hr/>
      <Link href="/user/register">
        <a>Create Account</a>
      </Link>
    </form>
  );
}