"use strict";

import Header from "../../../components/header";
import { server } from "../../../next.config"

export default function Login({isCookie}) {
  async function handleSubmit() {
    
  }

  return (
    <>
      {Header(isCookie)}
      <main>
        <form>
          <input
            placeholder="New password"
          />
          <br/>
          <input
            placeholder="Retype password"
          />
          <br/>
          <button>Reset password</button>
        </form>
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
  if (!authorised) return { redirect: { destination: "/user/login", permanent: false } }

  const isCookie = cookie ? true : false;
  return { props: { isCookie } };
}