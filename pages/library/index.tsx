"use strict";

import Header from "../../components/header";
import UploadFileForm from "../../components/library/UploadFileForm";
import FileCardList from "../../components/library/FileCardList";
import { useRouter } from "next/router";
import { server } from "../../next.config";
import { getMemberClaims } from "../../utils/server/user";

export default function Library({ list, permission, isVerified }) {
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

    // The actual page contents that are returned.
    return (
        <>
            {Header(permission)}
            <main>
                <div className="side-menu-container">
                    <div className="search-space">
                        <form onChange={handleChange}>
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
                    </div>
                    <div className="upload-space">
                        {UploadFileForm(isVerified)}
                    </div>
                </div>
                
                <div className="card-space">
                    {FileCardList(documents)}
                </div>
            </main>
        </>
    );
}

// Runs on the server before delivering results to the client.
// A GET request is sent to the documents API, which returns document contents based on the permission level of the user.
// A GET request is then sent to the user/permission API, which responds with the permission level of the user.
// Documents, isCookie, and isVerified are then delivered as props to the client.
export async function getServerSideProps(ctx) {
    const cookie = ctx.req?.cookies.auth;
    const { permission } = getMemberClaims(cookie);
    const isVerified = permission === "admin" || permission === "verified";

    const res = await fetch(`${server}/api/library/documents`, {
        method: "GET",
        headers: { cookie: cookie }
    });
    const json = await res.json();

    return { props: { list: json, permission, isVerified } };
}