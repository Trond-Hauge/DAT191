"use strict"; 

import { NextPageContext } from "next";
import { server } from "../next.config";

import Header from "../components/header";


export default function Streaming({ context, isCookie }: any) {
  console.log("Streaming-cookie = ", isCookie);

  return (
    <>
      {Header(isCookie)}
      <main>
        <p>Page for streaming!</p>
        <p>{JSON.stringify(context)}</p>
      </main>
    </>
  );
};

Streaming.getInitialProps = async (ctx: NextPageContext) => {
  const cookie = ctx.req?.headers.cookie;
  const isCookie = cookie ? true : false;

  const res = await fetch(`${server}/api/streaming`, {
    headers: {
      cookie: cookie!
    }
  });

  if (res.status === 401) {
    return {
      redirect: {
        destination: "/user/login",
        permanent: false
      }
    }
  }

  const json = await res.json();
  return {
    context: json,
    isCookie
  };
}