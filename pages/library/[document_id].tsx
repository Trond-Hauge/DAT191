"use strict";

import Header from "../../components/header";
import dynamic from "next/dynamic";
import { server } from "../../next.config";
import { getMemberClaims } from "../../utils/server/user";
import useSWR from "swr";

const PDFViewer = dynamic(() => import("../../components/pdf-viewer"), {
  ssr: false
});

const fetcher = url => fetch(url, { method: "GET" }).then( res => res.blob() );

export default function DocumentPage({ permission, doc }) {
  const {data, error} = useSWR(`${server}/api/library/file?filename=${doc.filename}&public=${doc.public}&owner=${doc.owner}`, fetcher);

  if (error) return (<h1>Error loading document</h1>)

  return (
    <>
    {Header(permission)}
    <PDFViewer file={data} filename={doc.filename}/>
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