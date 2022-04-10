"use strict";

import Header from "../../components/header";
import LoginForm from "../../components/LoginForm";

export default function Login({isCookie}) {
  // TODO: Wrap login form in a container and provide styling fitting to this page.
  return (
    <>
      {Header(isCookie)}
      <main>
        {LoginForm("/")}
      </main>
    </>
  );
}

export async function getServerSideProps(appContext) {
  const cookie = appContext.req?.headers.cookie;

  const isCookie = cookie ? true : false;
  return { props: { isCookie } };
}