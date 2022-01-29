"use strict";

import { useRouter } from 'next/router'

export default function Document(document) {
    const {query} = useRouter();
    const document_id = query.document_id; // Cannot use this in getInitialProps
    return (
        <div>
            Document page for: {document.document_name}
        </div>
    )
}

Document.getInitialProps = async (context) => {
    const document_id = context.query.document_id;
    const res = await fetch(`http://localhost:3000/api/documents/${document_id}`, {method: "GET"});
    const document = await res.json();
    return document;
}