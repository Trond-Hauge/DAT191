'use strict';

import Link from "next/link";
import React from "react";
import { useRouter } from 'next/router'

function docsList(docs) {
    return (
        <ul>
            {docs.map((doc, index) => {
                return (<li key={doc.document_id}>
                            <Link href={`/library/${doc.document_id}`}><a>{doc.document_name}</a></Link>
                        </li>)
            })}
        </ul>
    );
}

export default function Library({list}) {
    const router = useRouter();
    const searchParam = router.query.search;
    const searchStr = searchParam ? searchParam : "";
    const filterDocs = doc => doc.document_name.toLowerCase().includes(searchStr.toLowerCase());
    const compareDocs = (d1, d2) => d1.document_name < d2.document_name ? -1 : d1.document_name == d2.document_name ? 0 : 1;
    const documents = Array.from(list).sort(compareDocs).filter(filterDocs);

    const handleSearch = event => {
        event.preventDefault();
        const search = event.target.value;
        router.push(`/library?search=${search}`, undefined, {shallow: true})
    }

    return (
        <div className="container">
            <div>
                <input
                    onInput={handleSearch}
                    name="search"
                    type="text"
                    placeholder="Search documents"
                />
                <br></br>

                List:
                <div id="docs-container">
                    {docsList(documents)}
                </div>
            </div>
        </div>
    );
}

Library.getInitialProps = async (context) => {
    const res = await fetch("http://localhost:3000/api/documents/documents", {method: "GET"}); //There must be a better way.
    const json = await res.json();
    return {list: json};
}