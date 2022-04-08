"use strict";

import Header from "../components/header";

export default function Login({isCookie}) {
  return (
    <>
      {Header(isCookie)}
      <main>
        <h1>Woops, something went wrong.</h1>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookie = context.req?.headers.cookie;

  const isCookie = cookie ? true : false;
  return { props: { isCookie } };
}