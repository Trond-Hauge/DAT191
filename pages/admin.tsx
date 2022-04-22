"use strict";

import Header from "../components/header";
import { getMemberClaims } from "../utils/server/user";
import { useState, useRef } from "react";
import AnchorListClick from "../components/AnchorListClick";
import { filterByDocument, filterByName, filterByOrganisation, sortByDocument, sortByName, sortByOrganisation } from "../utils/multi/list";
import { db } from "../db";
import { UserView, DocumentView, OrganisationView } from "../components/AdminView";

export default function Login({ permission, users, documents, organisations }) {
    const [selectedList, setSelectedList] = useState(null);
    const [selectedView, setSelectedView] = useState(null);
    const [init, setInit] = useState(true);

    const selectRef = useRef<HTMLSelectElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    function handleClick(e) {
        const a = e.target;
        const id = parseInt(a.querySelector("input[type='hidden']").value);
        const val = selectRef.current?.value;
        const selected = val ? val : "users";

        switch (selected) {
            case "users": {
                const user = users.find(u => u.member_id === id);
                setSelectedView(UserView(user));
            }
            break;

            case "docs": {
                const doc = documents.find(d => d.document_id === id);
                setSelectedView(DocumentView(doc));
            }
            break;

            case "orgs": {
                const org = organisations.find(o => o.organisation_id === id);
                setSelectedView(OrganisationView(org));
            }
            break;
        }
    }

    function handleSearch() {
        const search = searchRef.current?.value;
        updateList(search);
    }

    function handleSelectionChange() {
        searchRef.current.value = "";
        if (selectRef?.current?.value === "orgs") {
            setSelectedView(OrganisationView());
        }
        else {
            setSelectedView(null);
        }
        updateList();
    }

    function updateList(search?) {
        const val = selectRef.current?.value;
        const selected = val ? val : "users";

        switch (selected) {
            case "users": {
                const list = search ? users.filter( u => filterByName(u, search) ) : users;
                list.sort(sortByName);
                const aList = AnchorListClick(list, u => u.first_name + " " + u.last_name, "side-menu-elem-wide", handleClick, u => u.member_id);
                setSelectedList(aList);
            }
            break;

            case "docs": {
                const list = search ? documents.filter( d => filterByDocument(d, search) ) : documents;
                list.sort(sortByDocument);
                const aList = AnchorListClick(list, d => d.document_name, "side-menu-elem-wide", handleClick, d => d.document_id);
                setSelectedList(aList);
            }
            break;

            case "orgs": {
                const list = search ? organisations.filter( o => filterByOrganisation(o, search) ) : organisations;
                list.sort(sortByOrganisation);
                const aList = AnchorListClick(list, o => o.organisation_name, "side-menu-elem-wide", handleClick, o => o.organisation_id);
                setSelectedList(aList);
            }
            break;
        }
    }

    if (init) {
        setInit(false);
        updateList();
    }
    
    return (
        <>
        {Header(permission)}
        <main>
            <div className="side-menu-container">
                <select className="side-menu-elem-wide" defaultValue={"users"} ref={selectRef} onChange={handleSelectionChange}>
                    <option value="users">Users</option>
                    <option value="docs">Documents</option>
                    <option value="orgs">Organisations</option>
                </select>
                <input
                    type="text"
                    name="search"
                    placeholder="Search"
                    className="side-menu-elem-wide"
                    onChange={handleSearch}
                    ref={searchRef}
                />
                {selectedList}
            </div>
            <div className="view-space">
                <div className="view-container">
                    {selectedView}
                </div>
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
            destination: "/",
            permanent: false
        }
    }

    const users = await db("members");
    const documents = await db("documents");
    const organisations = await db("organisations");

    if (!users || !documents || !organisations) return {
        redirect: {
            destination: "/error",
            permanent: false
        }
    }
    
    return { props: { permission, users, documents, organisations} };
}