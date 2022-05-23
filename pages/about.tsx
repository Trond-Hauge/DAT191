"use strict";

import Header from "../components/header";
import { getMemberClaims } from "../utils/server/user";

export default function About({ permission }) {
  return (
    <>
      {Header(permission)}
      <main>
        <h1>What is HEQED House?</h1>
        <p>HEQED House is a sub-project of the HEQED, Health Equity through Education, project. More to come here later...</p>
      </main>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const cookie = ctx.req?.cookies.auth;
  const { permission } = getMemberClaims(cookie);
  return { props: { permission } };
}