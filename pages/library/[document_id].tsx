"use strict";

import Header from "../../components/header";
import dynamic from "next/dynamic";
import { server } from "../../next.config";

export default function DocumentPage({ isCookie, docInfo}) {
  const PDFViewer = dynamic(() => import("../../components/pdf-viewer"), {
    ssr: false
  });

  // docInfo should be used to retrieve and display information regarding the document.

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

  const res = await fetch(`${server}/api/library/${context.query.document_id}?isMetaDataRequest=true`, {
    method: "GET",
    headers: { cookie: cookie }
  });
  const docInfo = await res.json();

  return { props: { isCookie, docInfo } };
}