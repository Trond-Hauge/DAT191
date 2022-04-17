"use strict";

import Header from "../components/header";
import { getMemberClaims } from "../utils/server/user";
import { useState, useRef } from "react";
import { server } from "../next.config";
import AnchorListClick from "../components/AnchorListCick";

export default function Login({ permission }) {
    const [usersList, setUsersList] = useState(null);
    const [documentsList, setDocumentsList] = useState(null);
    const [organisationsList, setOrganisationsList] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [selectedList, setSelectedList] = useState(null);

    const selectRef = useRef<HTMLSelectElement>(null);

    if (!fetching) {
        setFetching(true);

        fetch(`${server}/api/admin/users`).
        then( res => res.json()).
        then( json => {
            const { users } = json;
            if (users) {
                const uList = AnchorListClick(users, u => u.first_name + " " + u.last_name, handleClick, "side-menu-elem-wide");
                setUsersList(uList);
                setSelectedList(uList);
            }
        });

        fetch(`${server}/api/admin/documents`).
        then( res => res.json()).
        then( json => {
            const { documents } = json;
            if (documents) {
                const dList = AnchorListClick(documents, d => d.document_name, handleClick, "side-menu-elem-wide");
                setDocumentsList(dList);
            }
        });

        fetch(`${server}/api/admin/organisations`).
        then( res => res.json()).
        then( json => {
            const { organisations } = json;
            if (organisations) {
                const oList = AnchorListClick(organisations, o => o.organisation_name, handleClick, "side-menu-elem-wide");
                setOrganisationsList(oList);
            }
        });
    }

    function handleClick() {

    }

    function handleSelectionChange() {
        const val = selectRef.current?.value;
        const selected = val ? val : "users";

        if (selected === "users") setSelectedList(usersList);
        else if (selected === "docs") setSelectedList(documentsList);
        else if (selected === "orgs") setSelectedList(organisationsList);
    }
    
    return (
        <>
        {Header(permission)}
        <main>
            <div className="side-menu-container">
                <select className="side-menu-elem-wide" defaultValue="users" ref={selectRef} onChange={handleSelectionChange}>
                    <option value="users">Users</option>
                    <option value="docs">Documents</option>
                    <option value="orgs">Organisations</option>
                </select>
                <input
                    type="text"
                    name="search"
                    placeholder="Search"
                    className="side-menu-elem-wide"
                />
                {selectedList}
            </div>
        </main>
        </>
    );
}

export async function getServerSideProps(ctx) {
    const cookie = ctx.req?.cookies.auth;
    const { permission } = getMemberClaims(cookie);
    const url = ctx.resolvedUrl;

    if (!cookie) return {
        redirect: {
            destination: `/user/login?next=${url}`,
            permanent: false
        }
    }

    if (permission !== "admin") return {
        redirect: {
            destination: "/error",
            permanent: false
        }
    }

    return { props: { permission } };
}