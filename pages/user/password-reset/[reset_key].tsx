"use strict";

import Header from "../../../components/header";
import { server } from "../../../next.config";
import Router from "next/router";
import { useRef } from "react";
import { validatePassword } from "../../../utils/user";

export default function Login({isCookie, reset_key }) {
  const passRef = useRef<HTMLInputElement>(null);
  const passRetypeRef = useRef<HTMLInputElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Doing stuff");
    const pass = passRef.current?.value;
    const passRetype = passRetypeRef.current?.value;
    const valid = validatePassword(pass);
    if (pass !== passRetype) {
      pRef.current.innerText = "Passwords do not match.";
      return;
    }
    else if (!valid) {
      pRef.current.innerText = "Password does not match requirements.";
      return;
    }

    const res = await fetch(`${server}/api/user/processPasswordReset`, {
      method: "PATCH",
      body: {
        reset_key,
        password: pass
      }
    });

    const { message, error } = await res.json();
    if (res.status === 207) {
      pRef.current.innerText = message;
    }
    else {
      Router.push("/user/login");
    }
  }

  return (
    <>
      {Header(isCookie)}
      <main>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="New password"
            required
            ref={passRef}
          />
          <br/>
          <input
          required
            placeholder="Retype password"
            ref={passRetypeRef}
          />
          <br/>
          <button type="submit">Reset password</button>
        </form>
        <p ref={pRef}></p>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookie = context.req?.headers.cookie;
  const reset_key = context.query.reset_key;

  const res = await fetch(`${server}/api/user/authenticatePasswordReset`, {
    method: "GET",
    headers: { reset_key }
  });
  const { authorised } = await res.json();
  if (!authorised) return { redirect: { destination: "/error", permanent: false } }

  const isCookie = cookie ? true : false;
  return { props: { isCookie, reset_key} };
}