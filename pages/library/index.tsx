"use strict";

import Header from "../../components/header";
import { fileCardList } from "../../components/library";
import { useRouter } from "next/router";
import { server } from "../../next.config";
import axios from "axios";

export default function Library({ list, isCookie }) {
    // Sets the initial array of all accessible documents.
    let documents = Array.from(list);

    // Initial setup of router object and querying of URL parameters.
    const router = useRouter();
    const {title, org, author} = router.query;

    // Simple filtering by document title, organisation and author. Not case sensitive.
    const filterByTitle = (doc, title) => doc.document_name.toLowerCase().includes(title.toLowerCase());
    const filterByOrg = (doc, org) => doc.organisation_name.toLowerCase().includes(org.toLowerCase());
    const filterByAuthor = (doc, author) => `${doc.first_name.toLowerCase()} ${doc.last_name.toLowerCase()}`.includes(author.toLowerCase());
    if (title) documents = documents.filter(doc => filterByTitle(doc, title));
    if (org) documents = documents.filter(doc => filterByOrg(doc, org));
    if (author) documents = documents.filter(doc => filterByAuthor(doc, author));

    // Documents are sorted based on title.
    const compareDocs = (d1, d2) => (d1.document_name < d2.document_name) ? -1 : d1.document_name == d2.document_name ? 0 : 1;
    documents.sort(compareDocs);

    // Handles changes to search input fields. Upon change, title, org and author URL parameters are updated.
    // The URL is built iteratively, only including parameters that have a value.
    // Then the client side of the page is reloaded, and the new URL replaces the old without adding a new entry to browser history.
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

        router.replace(url, undefined, { shallow: true });
    }

    const uploadFile = async e => {
        e.preventDefault();
        const form = new FormData(e.target);
        const res = await axios.post(`/api/library/upload`, form);
        // TODO - Handle different responses
    }

    // The actual page contents that are returned.
    return (
        <>
            {Header(isCookie)}
            <main>
                <div className="side-menu-container">
                    <form id="search-form" onChange={handleChange}>
                        <input
                            name="title"
                            type="text"
                            placeholder="Search by title"
                            defaultValue={title}
                        />
                        <input
                            name="org"
                            type="text"
                            placeholder="Search by organisation"
                            defaultValue={org}
                        />
                        <input
                            name="author"
                            type="text"
                            placeholder="Search by author"
                            defaultValue={author}
                        />
                    </form>

                    <form id="upload-form" onSubmit={uploadFile}>
                        <input
                            name="file"
                            type="file"
                            accept=".pdf"
                            required
                        />
                        <input
                            name="fileDesc" 
                            type="text"
                            required
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>
                
                <div className="card-space">
                    {fileCardList(documents)}
                </div>
            </main>
        </>
    );
}

// Runs on the server before delivering results to the client.
// A GET request is sent to the documents API, which returns document contents based on the permission level of the user.
// Authentication cookie and documents are then delivered as props to the client.
export async function getServerSideProps(context) {
    const cookie = context.req?.headers.cookie;

    const res = await fetch(`${server}/api/library/documents`, {
        method: "GET",
        headers: { cookie: cookie }
    });

    if (res.status === 405) return { redirect: { destination: "/", permanent: false } };

    const json = await res.json();
    const isCookie = cookie ? true : false;
    return { props: { list: json, isCookie: isCookie } };
}