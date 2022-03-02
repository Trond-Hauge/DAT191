"use strict";

import Header from "../../components/header";
import dynamic from "next/dynamic";
import { server } from "../../next.config";

export default function DocumentPage({ isCookie, doc}) {
  const PDFViewer = dynamic(() => import("../../components/pdf-viewer"), {
    ssr: false
  });

  return (
    <>
      {Header(isCookie)}
      <PDFViewer filepath={doc.filepath}/>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookie = context.req?.headers.cookie;
  const isCookie = cookie ? true : false;

  const res = await fetch(`${server}/api/library/${context.query.document_id}`, {
    method: "GET",
    headers: { cookie: cookie }
  });
  const doc = await res.json();

  return { props: { isCookie, doc } };
}