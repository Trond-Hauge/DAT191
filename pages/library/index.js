'use strict';

import Header from "../../components/header";
import Link from "next/link";
import {useRouter} from "next/router";
import {server} from "../../next.config";

export default function Library({list, isCookie}) {
    const router = useRouter();
    const searchParam = router.query.search;
    const searchStr = searchParam ? searchParam : "";
    const filterDocs = doc => doc.document_name.toLowerCase().includes(searchStr.toLowerCase());
    const compareDocs = (d1, d2) => d1.document_name < d2.document_name ? -1 : d1.document_name == d2.document_name ? 0 : 1;
    const documents = Array.from(list).sort(compareDocs).filter(filterDocs);

    const handleSearch = event => {
        event.preventDefault();
        const search = event.target.value;
        router.push(`/library?search=${search}`, undefined, {shallow: true});
    }

    return (
        <div className="container">
            {Header(isCookie)}

            <div id="input-container">
                <input
                    onInput={handleSearch}
                    name="search"
                    type="text"
                    placeholder="Search documents"
                />
                <br></br>
            </div>

            List:
            {docsList(documents)}

        </div>
    );
}

function docsList(docs) {
    return (
        <div className="docs-container">
            {docs.map((doc, index) => {
                const desc = doc.document_description.length > 130 ? doc.document_description.substring(0,130) + "..." : doc.document_description;
                return (
                    <Link href={`/library/${doc.document_id}`}>
                        <div className="card">
                            <div className="publishers">
                                <h3>Author of doc</h3>
                                <h4>Institution of publishment</h4>
                            </div>

                            <div className="title">
                                <h4>{doc.document_name}</h4>
                            </div>

                            <div className="description">
                                <p>{desc}</p>
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    );
}

Library.getInitialProps = async (context) => {
    const cookie = context.req?.headers.cookie;
    const res = await fetch(`${server}/api/documents/documents`, {
        method: "GET",
        headers: {cookie: cookie}
    });

    const isCookie = cookie ? true : false;
    const json = await res.json();
    return {list: json, isCookie: isCookie};
}