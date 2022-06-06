"use strict";

import { server } from "../../next.config";
import Router from "next/router";
import { useRef } from "react";
import { validatePassword } from "../../utils/multi/validation";
import PasswordRequirements from "../../components/PasswordRequirements";

export default function Login({ permission }) {
  const passRef = useRef<HTMLInputElement>(null);
  const passRetypeRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const pass = passRef.current?.value;
    const passRetype = passRetypeRef.current?.value;
    const valid = validatePassword(pass);
    if (pass !== passRetype) {
      alert("Passwords do not match.");
      return;
    }
    else if (!valid) {
      alert("Password does not match requirements.");
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
      alert(message);
    }
    else {
      Router.push("/user/login");
    }
  }

  return (
    <>
      <main>
        <div className="view-space">
          <div className="view-container">
            <div className="narrow-container">
              <h3>Password Requirements:</h3>
              {PasswordRequirements()}
            </div>
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  type="password"
                  placeholder="New password"
                  required
                  ref={passRef}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Retype password"
                  required
                  ref={passRetypeRef}
                />
              </div>
              <button className="btn-submit" type="submit">Reset password</button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const reset_key = ctx.query.reset_key;

  const res = await fetch(`${server}/api/user/authenticatePasswordReset?reset_key=${reset_key}`, { method: "GET" });
  const { authorised } = await res.json();
  if (!authorised) return { redirect: { destination: "/error", permanent: false } }

  return { };
}