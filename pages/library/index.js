'use strict';

import Link from "next/link";
import React from "react";
import { useRouter } from 'next/router'
import { client_encoding } from "pg/lib/defaults";

export default function Library({list}) {
    const compareDocs = (d1, d2) => d1.document_name < d2.document_name ? -1 : d1.document_name == d2.document_name ? 0 : 1;
    const documents = Array.from(list).sort(compareDocs);
    const router = useRouter();
    const searchParam = router.query.search;
    const searchStr = searchParam ? searchParam : "";

    const handleSubmit= event => {
        event.preventDefault();
        const form = new FormData(event.target);
        const formData = Object.fromEntries(form.entries());
        const search = formData.search;
    }

    function documentsList() {
        const filterDocs = doc => doc.document_name.toLowerCase().includes(searchStr.toLowerCase());
        return (
            <ul>
                {documents.filter(filterDocs).map((doc, index) => {
                    return (<li key={doc.document_id}>
                                <Link href={"/library/" + doc.document_id}><a>{doc.document_name}, shared: {doc.shared.toString()}</a></Link>
                            </li>)
                })}
            </ul>
        );
    }

    return (
        <div className="container">
            <div>
                <form onSubmit={handleSubmit} method="GET">
                    <input
                        name="search"
                        type="text"
                    />
                    <button type="input">Search</button>
                </form>
                <br></br>

                List:
                <div id="docs-container">
                    {documentsList()}
                </div>
            </div>
        </div>
    );
}

Library.getInitialProps = async () => {
    const res = await fetch("http://localhost:3000/api/documents/documents", {method: "GET"}); //There must be a better way.
    const json = await res.json();
    return {list: json};
}