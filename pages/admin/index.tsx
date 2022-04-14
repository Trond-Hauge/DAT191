"use strict";

import Header from "../../components/header";
import { getMemberClaims } from "../../utils/server/user";

export default function Home({permission}) {
  return (
    <>
    {Header(permission)}
      <main>
        This is the admin page
      </main>
    </>
  );
}

export async function getServerSideProps (ctx) {
  const cookie = ctx.req?.cookies.auth;
  const { permission } = getMemberClaims(cookie);
  return { props: { permission } };
}