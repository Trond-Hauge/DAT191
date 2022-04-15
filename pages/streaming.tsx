"use strict"; 

import { getMemberClaims } from "../utils/server/user";
import { server } from "../next.config";

import Header from "../components/header";


export default function Streaming({ context, permission }: any) {
  return (
    <>
      {Header(permission)}
      <main>
        <p>Page for streaming!</p>
        <p>{JSON.stringify(context)}</p>
      </main>
    </>
  );
};

export async function getServerSideProps(ctx) {
  const cookie = ctx.req?.cookies.auth;
  const { permission } = getMemberClaims(cookie);
  const url = ctx.resolvedUrl;

  const res = await fetch(`${server}/api/streaming`, {
    headers: {
      cookie: cookie!
    }
  });

  if (res.status === 401) {
    return {
      redirect: {
        destination: `/user/login?next=${url}`,
        permanent: false
      }
    }
  }

  const json = await res.json();
  return { props: { context: json, permission } };
}