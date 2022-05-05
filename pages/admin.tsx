"use strict";

import Header from "../components/header";
import { getMemberClaims } from "../utils/server/user";
import { useState, useRef, useEffect } from "react";
import AnchorListClick from "../components/AnchorListClick";
import { filterByDocument, filterByName, filterByOrganisation } from "../utils/multi/list";
import { db } from "../db";
import { UserView, DocumentView, OrganisationView, AddOrgView } from "../components/AdminView";

export default function Login({ permission, users, documents, organisations }) {
    const [usersList, setUsersList] = useState(<></>);
    const [documentsList, setDocumentsList] = useState(<></>);
    const [organisationsList, setOrganisationsList] = useState(<></>);
    const [selectedList, setSelectedList] = useState(<></>);
    const [view, setView] = useState(<></>);
    const [search, setSearch] = useState("");

    const selectRef = useRef<HTMLSelectElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect( () => {
        const list = AnchorListClick(users.filter(u => filterByName(u, search)), u => u.first_name + " " + u.last_name, handleClick, u => u.member_id);
        setUsersList(list);
        const selected = selectRef.current?.value;
        if (!selected || selected === "users") {
            setSelectedList(list);
        }
    }, [users, search]);

    useEffect( () => {
        const list = AnchorListClick(documents.filter(d => filterByDocument(d, search)), d => d.document_name, handleClick, d => d.document_id);
        setDocumentsList(list);
        const selected = selectRef.current?.value;
        if (selected === "docs") {
            setSelectedList(list);
        }
    }, [documents, search]);

    useEffect( () => {
        const list = AnchorListClick(organisations.filter(o => filterByOrganisation(o, search)), o => o.organisation_name, handleClick, o => o.organisation_id);
        setOrganisationsList(list);
        const selected = selectRef.current?.value;
        if (selected === "orgs") {
            setSelectedList(list);
        }
    }, [organisations, search]);

    async function handleClick(e) {
        const id = parseInt(e.target.querySelector("input[type='hidden']")?.value);
        const selected = selectRef.current?.value;
        if (selected === "docs") {
            const doc = documents.find(d => d.document_id === id);
            setView(DocumentView(doc))
        }
        else if (selected === "orgs") {
            const org = organisations.find(o => o.organisation_id === id);
            setView(OrganisationView(org));
        }
        else {
            const user = users.find(u => u.member_id === id);
            setView(UserView(user));
        }
    }

    async function handleSelectionChange() {
        searchRef.current.value = "";
        const selected = selectRef.current?.value;
        if (selected === "docs") {
            setSelectedList(documentsList);
            setView(<></>)
        }
        else if (selected === "orgs") {
            setSelectedList(organisationsList);
            setView(AddOrgView(users));
        }
        else {
            setSelectedList(usersList);
            setView(<></>)
        }
    }
    
    return (
        <>
        {Header(permission)}
        <main>
            <div className="wide-side-menu-container">
                <select defaultValue={"users"} ref={selectRef} onChange={handleSelectionChange}>
                    <option value="users">Users</option>
                    <option value="docs">Documents</option>
                    <option value="orgs">Organisations</option>
                </select>
                <input
                    type="text"
                    name="search"
                    placeholder="Search"
                    onChange={() => setSearch(searchRef.current?.value)}
                    ref={searchRef}
                />
                {selectedList}
            </div>
            <div className="view-space-wide-menu">
                <div className="view-container">
                    {view}
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

    const users = await db("members").orderBy("last_name", "asc").orderBy("first_name", "asc");
    const documents = await db("documents").orderBy("document_name", "asc");
    const organisations = await db("organisations").orderBy("organisation_name", "asc");

    if (!users || !documents || !organisations) return {
        redirect: {
            destination: "/error",
            permanent: false
        }
    }
    
    return { props: { permission, users, documents, organisations} };
}