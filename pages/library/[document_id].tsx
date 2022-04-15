"use strict";

import Header from "../../components/header";
import dynamic from "next/dynamic";
import { server } from "../../next.config";
import { useState } from "react";
import { getMemberClaims } from "../../utils/server/user";

const PDFViewer = dynamic(() => import("../../components/pdf-viewer"), {
  ssr: false
});

export default function DocumentPage({ permission, doc }) {
  const [fetching, setFetching] = useState(false);
  const [file, setFile] = useState(null);

  if (!fetching) {
    setFetching(true);
    fetch(`${server}/api/library/file?filename=${doc.filename}&public=${doc.public}&owner=${doc.owner}`, { method: "GET" })
    .then(res => res.blob())
    .then(file => {
      setFile(file);
    });
  }

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