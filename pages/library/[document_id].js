"use strict";

import {useRouter} from "next/router"

export default function Document({document}) {
    const router = useRouter();

    const handleUpdate = async event => {
        event.preventDefault();
        const form = new FormData(event.target);
        const formData = Object.fromEntries(form.entries());
        console.log("Form: \n" + formData);
        const res = await fetch(`http://localhost:3000/api/documents/${document.document_id}`, {
            method: "PATCH",
            body: JSON.stringify({newName: formData.newName})
        });
        router.push(router.asPath, undefined, {shallow: false});
    }

    return (
        <div className="container">

        <form onSubmit={handleUpdate}>
            <input
                name="newName"
                type="text"
                placeholder="New Name"
            />
            <button type="submit">Update document</button>
        </form>

            Document page for: {document.document_name}
        </div>
    )
}

Document.getInitialProps = async (context) => {
    const document_id = context.query.document_id;
    const res = await fetch(`http://localhost:3000/api/documents/${document_id}`, {method: "GET"});
    const json = await res.json();
    return {document: json};
}