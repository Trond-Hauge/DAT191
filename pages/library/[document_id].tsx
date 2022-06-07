"use strict";

import dynamic from "next/dynamic";
import { getMemberClaims } from "../../utils/server/user";
import { db } from "../../db";
import { useFileURL } from "../../utils/client/fetchers";

const PDFViewer = dynamic(() => import("../../components/pdf-viewer"), {
  ssr: false
});

export default function DocumentPage({ doc }) {
  const { fileURL, error } = useFileURL(doc.fileref);

  return (
    <>
    <PDFViewer fileURL={fileURL ?? error ?? {}} filename={doc.filename} />
    </>
  );
}

export async function getServerSideProps(ctx) {
  const docID = ctx.query.document_id;
  const cookie = ctx.req?.cookies.auth;
  const { id, permission } = getMemberClaims(cookie);

  const doc = await db.select("documents.document_name", "documents.document_id", "documents.owner", "documents.document_description", "documents.fileref", "documents.filename", "documents.public","members.first_name", "members.last_name", "organisations.organisation_name")
            .from("documents")
            .where("documents.document_id", docID)
            .leftJoin("members", "documents.owner", "members.member_id")
            .leftJoin("members_organisations", "documents.owner", "members_organisations.member_id")
            .leftJoin("organisations", "members_organisations.organisation_id", "organisations.organisation_id")
            .first();

  if (!doc?.public && permission !== "admin" && doc?.owner !== id) return {
    redirect: { 
        destination: "/library", 
        permanent: false 
      } 
  }

  return { props: { doc } };
}