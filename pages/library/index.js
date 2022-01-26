'use strict';

import Link from "next/link";
import React from "react";

export default function Library({list}) {
    const compareDocs = (d1, d2) => d1.document_name < d2.document_name ? -1 : d1.document_name == d2.document_name ? 0 : 1;
    const documents = Array.from(list).sort(compareDocs);

    const search = event => {
        event.preventDefault();
        const searchStr = event.target.value;
        const newDocsList = documentsList(searchStr);
        const docsContainer = document.getElementById("docs-container");
        // TODO: Find out how to replace current docs list with new docs list.
    }

    function documentsList(searchStr = "") {
        const filterDocs = doc => doc.document_name.toLowerCase().includes(searchStr.toString().toLowerCase());
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
                <input
                    onInput={search}
                    name="search"
                    type="text"
                    placeholder="Search documents"
                />
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