"use strict";

import { getMemberClaims } from "../../utils/server/user";
import Header from "../../components/header";

export default function Home({ permission }) {
  return (
    <>
      {Header(permission)}
      <main>
        This is the user account page
      </main>
    </>
  );
}

export async function getServerSideProps (ctx) {
  const cookie = ctx.req?.cookies.auth;
  const { permission } = getMemberClaims(cookie);
  const url = ctx.resolvedUrl;

  if (!cookie) return {
      redirect: {
          destination: `/user/login?next=${url}`,
          permanent: false
      }
  }

  return { props: { permission: permission} };
}