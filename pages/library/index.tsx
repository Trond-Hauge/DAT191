'use strict';

import Header from "../../components/header";
import { fileCard } from "../../components/library";

import Link from "next/link";
import { useRouter } from "next/router";
import { server } from "../../next.config";

export default function Library({ list, isCookie }) {
    const router = useRouter();
    const searchParam = router.query.search;
    const searchStr = searchParam ? searchParam : "";
    const filterDocs = doc => doc.document_name.toLowerCase().includes(searchStr.toLowerCase());
    const compareDocs = (d1, d2) => (d1.document_name < d2.document_name) ? -1 : d1.document_name == d2.document_name ? 0 : 1;
    const documents = Array.from(list).sort(compareDocs).filter(filterDocs);

    const handleSearch = event => {
        event.preventDefault();
        const search = event.target.value;
        router.push(`/library?search=${search}`, undefined, { shallow: true });
    }

    return (
        <>
            {Header(isCookie)}
            <main>
                <div className="side-menu-container">
                    <input
                        onInput={handleSearch}
                        name="search"
                        type="text"
                        placeholder="Search documents"
                    />
                </div>
                <div className="card-space">
                    {docsList(documents)}
                </div>
            </main>
        </>
    );
}

function docsList(docs) {
    return (
        <>
            {docs.map((doc, index) => {
                return (
                    <>
                        {fileCard(doc)}
                    </>
                );
            })}
        </>
    );
}

Library.getInitialProps = async (context) => {
    const cookie = context.req?.headers.cookie;
    const res = await fetch(`${server}/api/documents/documents`, {
        method: "GET",
        headers: { cookie: cookie }
    });

    const isCookie = cookie ? true : false;
    const json = await res.json();
    return { list: json, isCookie: isCookie };
}