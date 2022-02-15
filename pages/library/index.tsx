'use strict';

import Header from "../../components/header";
import { fileCardList } from "../../components/library";
import { useRouter } from "next/router";
import { server } from "../../next.config";

export default function Library({ list, isCookie }) {
    const compareDocs = (d1, d2) => (d1.document_name < d2.document_name) ? -1 : d1.document_name == d2.document_name ? 0 : 1;
    let documents = Array.from(list).sort(compareDocs);

    const router = useRouter();
    const {title, org, author} = router.query;

    const filterByTitle = (doc, title) => doc.document_name.toLowerCase().includes(title.toLowerCase());
    const filterByOrg = (doc, org) => doc.organisation_name.toLowerCase().includes(org.toLowerCase());
    const filterByAuthor = (doc, author) => `${doc.first_name.toLowerCase()} ${doc.last_name.toLowerCase()}`.includes(author.toLowerCase());
    if (title) documents = documents.filter(doc => filterByTitle(doc, title));
    if (org) documents = documents.filter(doc => filterByOrg(doc, org));
    if (author) documents = documents.filter(doc => filterByAuthor(doc, author));

    const handleChange = e => {
        e.preventDefault();
        const field = e.target.name;
        const value = e.target.value;

        const t = field === "title" ? value : title;
        const o = field === "org" ? value : org;
        const a = field === "author" ? value : author;

        let paramAdded = false;
        let url = "/library";
        if (t) {
            url += `?title=${t}`;
            paramAdded = true;
        }
        if (o) {
            url += `${paramAdded ? "&" : "?"}org=${o}`;
            paramAdded = true;
        }
        if (a) url += `${paramAdded ? "&" : "?"}author=${a}`;

        router.push(url, undefined, { shallow: true });
    }

    return (
        <>
            {Header(isCookie)}
            <main>
                <div className="side-menu-container">
                    <form onChange={handleChange}>
                        <input
                            name="title"
                            type="text"
                            placeholder="Search by title"
                        />
                        <input
                            name="org"
                            type="text"
                            placeholder="Search by organisation"
                        />
                        <input
                            name="author"
                            type="text"
                            placeholder="Search by author"
                        />
                    </form>
                </div>
                <div className="card-space">
                    {fileCardList(documents)}
                </div>
            </main>
        </>
    );
}

export async function getServerSideProps(context) {
    const cookie = context.req?.headers.cookie;

    const res = await fetch(`${server}/api/documents/documents`, {
        method: "GET",
        headers: { cookie: cookie }
    });

    if (!cookie || res.status === 401) return { redirect: { destination: "/user/login", permanent: false } };
    if (res.status === 405) return { redirect: { destination: "/", permanent: false } };

    const json = await res.json();
    const isCookie = cookie ? true : false;
    return { props: { list: json, isCookie: isCookie } };
}