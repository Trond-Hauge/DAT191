"use strict";

import Header from "../../components/header";
import dynamic from "next/dynamic";


export default function DocumentPage({ isCookie }) {
  /*
  const router = useRouter();

  const handleUpdate = async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const formData = Object.fromEntries(form.entries());
    const res = await fetch(`${server}/api/documents/${document.document_id}`, {
      method: "PATCH",
      body: JSON.stringify({ newName: formData.newName }),
    });
    router.push(router.asPath, undefined, { shallow: false });
  };

  <form onSubmit={handleUpdate}>
          <input name="newName" type="text" placeholder="New Name" />
          <button type="submit">Update document</button>
        </form>
  */

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

/*
Document.getInitialProps = async (context) => {
  const cookie = context.req?.headers.cookie;
  const document_id = context.query.document_id;
  const res = await fetch(`${server}/api/documents/${document_id}`, {
    method: "GET",
    headers: { cookie: cookie },
  });

  const isCookie = cookie ? true : false;
  const json = await res.json();
  return { document: json, isCookie: isCookie };
};
*/