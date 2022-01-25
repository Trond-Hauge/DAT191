'use strict';

import Link from "next/link";

const compareDocs = (d1, d2) => d1.document_name < d2.document_name ? -1 : d1.document_name == d2.document_name ? 0 : 1;

export default function Library({list}) {
    const documents = Array.from(list);
    documents.sort(compareDocs);

    return (
        <div className="container">
            <div>
                <input 
                    name="search"
                    type="text"
                />
                <input
                    name="submit"
                    type="submit"
                    value="Search"
                />
                <br></br>

                List:
                <ul>
                    {documents.map((doc, index) => {
                        return (<li>
                                <Link href={"/library/" + doc.document_id}><a>{doc.document_name}, shared: {doc.shared.toString()}</a></Link>
                                </li>)
                    })}
                </ul>
            </div>
        </div>
    );
}

Library.getInitialProps = async () => {
    const res = await fetch("http://localhost:3000/api/documents/documents", {method: "GET"}); //There must be a better way.
    const json = await res.json();
    return {list: json};
}