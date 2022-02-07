"use strict";

import Header from "../../components/header";
import { useRouter } from "next/router";
import { server } from "../../next.config";

export default function Document({ document, isCookie }) {
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

  return (
    <div className="container">
      {Header(isCookie)}
      <main>
        <form onSubmit={handleUpdate}>
          <input name="newName" type="text" placeholder="New Name" />
          <button type="submit">Update document</button>
        </form>
      </main>
      Document page for: {document.document_name}
    </div>
  );
}

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
