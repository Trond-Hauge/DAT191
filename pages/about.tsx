"use strict";

import Header from "../components/header";


export default function About({ isCookie }) {
  return (
    <>
      {Header(isCookie)}
      <main>
        <div className="main-content">
          <p>This page is even more work in progress that the rest of the site.</p>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(appContext) {
  const cookie = appContext.req?.headers.cookie;

  const isCookie = cookie ? true : false;
  return { props: { isCookie } };
}