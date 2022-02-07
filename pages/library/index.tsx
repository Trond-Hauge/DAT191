'use strict';

import Header from "../../components/header";
import { fileCard } from "../../components/library";
import { useRouter } from "next/router";
import { server } from "../../next.config";

let titleSearch = "";
let orgSearch = "";
let authorSearch = "";

export default function Library({ list, isCookie }) {
    let documents = Array.from(list).sort(compareDocs);

    const router = useRouter();
    const {title, org, author} = router.query;

    if (title) documents = documents.filter(doc => filterByTitle(doc, title));
    if (org) documents = documents.filter(doc => filterByOrg(doc, org));
    if (author) documents = documents.filter(doc => filterByAuthor(doc, author));

    const handleChange = e => {
        e.preventDefault();
        const inputField = e.target.name;
        const value = e.target.value;

        switch (inputField) {
            case "title": 
                titleSearch = value;
                break;
            case "org": 
                orgSearch = value;
                break;
            case "author": 
                authorSearch = value;
                break;
        }

        updateSearchParams();
    }

    const updateSearchParams = () => router.push(`/library?title=${titleSearch}&org=${orgSearch}&author=${authorSearch}`, undefined, { shallow: true });

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
                    {docsList(documents)}
                </div>
            </main>
        </>
    );
}

const compareDocs = (d1, d2) => (d1.document_name < d2.document_name) ? -1 : d1.document_name == d2.document_name ? 0 : 1;
const filterByTitle = (doc, title) => doc.document_name.toLowerCase().includes(title.toLowerCase());
const filterByOrg = (doc, org) => doc.organisation_name.toLowerCase().includes(org.toLowerCase());
const filterByAuthor = (doc, author) => {
    let check = false;
    const names = author.split(" ");
    check = doc.first_name.toLowerCase().includes(author.toLowerCase()) ||
        doc.last_name.toLowerCase().includes(author.toLowerCase());

    if (!check && names.length > 1) {
        check = names.some( name => doc.first_name.toLowerCase().includes(name.toLowerCase()) );
        if (!check) check = names.some( name => doc.last_name.toLowerCase().includes(name.toLowerCase()) );
    }

    return check;
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

export async function getServerSideProps(context) {
    const cookie = context.req?.headers.cookie;
    const res = await fetch(`${server}/api/documents/documents`, {
        method: "GET",
        headers: { cookie: cookie }
    });

    const json = await res.json();
    const isCookie = cookie ? true : false;
    return { props: { list: json, isCookie: isCookie } };
}