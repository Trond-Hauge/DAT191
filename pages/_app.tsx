import Header from "../components/header";
import { server } from "../next.config";

import { NextPageContext } from "next";


import "../styles/globals.css";
import "../styles/navigation.css";
import "../styles/normalize.css";

export default function MyApp({ Component, pageProps }, ctx : NextPageContext)  {
  const cookie = ctx.req?.headers.cookie;

  return (
    <div>
      {Header(cookie)}
      <Component {...pageProps} />
    </div>
  );
}

// An authenticator, that may be used for more than just the header