"use strict";

import Header from "../components/header";
import { getMemberClaims } from "../utils/server/user";

export default function Login({permission}) {
  return (
    <>
      {Header(permission)}
      <main>
        <h1>Woops, something went wrong.</h1>
      </main>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const cookie = ctx.req.cookies.auth;
  const { permission } = getMemberClaims(cookie);
  return { props: { permission } };
}