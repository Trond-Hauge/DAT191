"use strict";

import Header from "../../components/header";
import dynamic from "next/dynamic";
import { server } from "../../next.config";
import fs from "fs";

export default function DocumentPage({ isCookie, doc, file}) {
  const PDFViewer = dynamic(() => import("../../components/pdf-viewer"), {
    ssr: false
  });

  return (
    <>
      {Header(isCookie)}
      <PDFViewer file={file}/>
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
  const { doc, file, error } = await res.json();

  if (error) {
    console.log(error);
    return { redirect: { destination: "/library", permanent: false } }
  }

  return { props: { isCookie, doc, file} };
}