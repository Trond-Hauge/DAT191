"use strict";

import Header from "../../components/header";
import LoginForm from "../../components/LoginForm";
import { getMemberClaims } from "../../utils/server/user";

export default function Login({ permission }) {
  // TODO: Wrap login form in a container and provide styling fitting to this page.
  return (
    <>
      {Header(permission)}
      <main>
        {LoginForm("/")}
      </main>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const cookie = ctx.req?.cookies.auth;
  const { permission } = getMemberClaims(cookie);
  return { props: { permission } };
}