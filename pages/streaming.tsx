"use strict";

import { NextPageContext } from "next";
import Router from "next/router";
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
  const cookie = await ctx.req?.headers.cookie;
  const isCookie = await ctx.req?.headers.cookie != undefined;

  const response = await fetch(`${server}/api/streaming`, {
    headers: {
      cookie: cookie!
    }
  });

  // Hard redirect
  if (response.status === 401 && !ctx.req) {
    Router.replace("/user/login");
    return {}; // Necessary "{}" !! Removes last page from history, though.
  }

  // Soft redirect
  if (response.status === 401 && ctx.req) {
    ctx.res?.writeHead(302, { Location: `${server}/user/login` });
    ctx.res?.end();
    return;
  }

  const json = await response.json();
  return {
    context: json,
    isCookie
  };
}