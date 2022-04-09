"use strict";

import Header from "../../components/header";
import { server } from "../../next.config";
import Router from "next/router";
import { useRef } from "react";
import { validatePassword } from "../../utils/user";
import { passwordRequirementsText } from "../../messages/user";

export default function Login({ isCookie }) {
  const passRef = useRef<HTMLInputElement>(null);
  const passRetypeRef = useRef<HTMLInputElement>(null);
  const pRef = useRef<HTMLParagraphElement>(null);

  async function handleSubmit(e) {
    e.preventDefault();
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
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        reset_key: Router.query.reset_key,
        password: pass
      })
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
        <text>
          <strong>Password Requirements:</strong>
          <p>{passwordRequirementsText}</p>
        </text>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            required
            ref={passRef}
          />
          <br/>
          <input
            type="password"
            placeholder="Retype password"
            required
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

export async function getServerSideProps(ctx) {
  const cookie = ctx.req?.headers.cookie;
  const reset_key = ctx.query.reset_key;

  const res = await fetch(`${server}/api/user/authenticatePasswordReset?reset_key=${reset_key}`, { method: "GET" });
  const { authorised } = await res.json();
  if (!authorised) return { redirect: { destination: "/error", permanent: false } }

  const isCookie = cookie ? true : false;
  return { props: { isCookie } };
}