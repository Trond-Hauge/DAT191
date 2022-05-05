"use strict";

import Header from "../../components/header";
import UploadFileForm from "../../components/library/UploadFileForm";
import FileCardList from "../../components/library/FileCardList";
import { useRouter } from "next/router";
import { getMemberClaims } from "../../utils/server/user";
import { filterByDocument, filterByName, filterByOrganisation } from "../../utils/multi/list";
import { useDocuments } from "../../utils/client/fetchers";
import Spinner from "../../components/Spinner";

export default function Library({ permission }) {
    const { documents, loading, error } = useDocuments();
    const router = useRouter();
    const {title, org, author} = router.query;

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
                        <UploadFileForm permission={permission}/>
                    </div>
                </div>
                
                <div className="card-space">
                    {function(){
                        if (error) return <h2>Error loading documents</h2>
                        if (loading) return <Spinner />;
                        if (documents) return <FileCardList documents={documents.filter( doc => filterByDocument(doc, title) && filterByOrganisation(doc, org) && filterByName(doc, author) )} />
                    }()}
                </div>
            </main>
        </>
    );
}

export async function getServerSideProps(ctx) {
    const cookie = ctx.req?.cookies.auth;
    const { permission } = getMemberClaims(cookie);
    return { props: { permission } };
}