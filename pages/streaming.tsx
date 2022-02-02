"use strict";

import { NextPageContext } from "next";
import Router from "next/router";
import {server} from "../next.config";


export default function Streaming({ context }: any) {
  return (
    <div>
      <p>Page for streaming!</p>
      <p>{JSON.stringify(context)}</p>
    </div>
  );
};

Streaming.getInitialProps = async (ctx: NextPageContext) => {
  const cookie = ctx.req?.headers.cookie;  

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
    ctx.res?.writeHead(302, { Location: `${server}/user/login` }); // PLACEHOLDER LOCATION!!! Use Link instead?
    ctx.res?.end();
    return;
  }  

  const json = await response.json();
  return { context: json };
}