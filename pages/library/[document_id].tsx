"use strict";

import Header from "../../components/header";
import dynamic from "next/dynamic";
import { server } from "../../next.config";
import { getMemberClaims } from "../../utils/server/user";
import { useDocument } from "../../utils/client/fetchers";

const PDFViewer = dynamic(() => import("../../components/pdf-viewer"), {
  ssr: false
});

export default function DocumentPage({ permission, doc }) {
  const { file } = useDocument(doc.document_id);

  return (
    <>
    {Header(permission)}
    <PDFViewer file={file} filename={doc.filename}/>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const cookie = ctx.req?.cookies.auth;
  const { permission } = getMemberClaims(cookie);

  const res = await fetch(`${server}/api/library/${ctx.query.document_id}`, {
    method: "GET",
    headers: { cookie: cookie }
  });
  const { doc, error } = await res.json();

  if (error || !doc) return { 
    redirect: { 
      destination: "/library", 
      permanent: false 
    } 
  }

  return { props: { permission, doc } };
}