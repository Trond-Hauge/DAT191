"use strict";

import Header from "../../components/header";
import dynamic from "next/dynamic";

export default function DocumentPage({ isCookie }) {
  const PDFViewer = dynamic(() => import("../../components/pdf-viewer"), {
    ssr: false
  });

  return (
    <>
      {Header(isCookie)}
      <PDFViewer />
    </>
  );
}

export async function getServerSideProps(context) {
  const cookie = context.req?.headers.cookie;
  const isCookie = cookie ? true : false;
  return { props: { isCookie } };
}