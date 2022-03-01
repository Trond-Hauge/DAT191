"use strict";

import Header from "../../components/header";
import dynamic from "next/dynamic";
import { server } from "../../next.config";

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
  const document_id = context.query.document_id;

  const res = await fetch(`${server}/api/documents/${document_id}`, {
    method: "GET",
    headers: { cookie: cookie },
  });

  const isCookie = cookie ? true : false;
  return { props: { isCookie } };
}