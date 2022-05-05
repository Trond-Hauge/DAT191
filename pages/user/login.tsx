"use strict";

import Header from "../../components/header";
import LoginForm from "../../components/LoginForm";
import { getMemberClaims } from "../../utils/server/user";
import { useRouter } from "next/router";

export default function Login({ permission }) {
  const { next } = useRouter().query;
  const redirect = next ? next : "/";
  // TODO: Wrap login form in a container and provide styling fitting to this page.
  return (
    <>
      {Header(permission)}
      <main>
        <LoginForm redirectPath={redirect}/>
      </main>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const cookie = ctx.req?.cookies.auth;
  const { permission } = getMemberClaims(cookie);
  return { props: { permission } };
}