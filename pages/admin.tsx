"use strict";

import { getMemberClaims } from "../utils/server/user";
import { useState, useRef, useEffect } from "react";
import AnchorListClick from "../components/AnchorListClick";
import { filterByDocument, filterByName, filterByOrganisation } from "../utils/multi/list";
import { db } from "../db";
import { UserView, DocumentView, OrganisationView, AddOrgView } from "../components/AdminView";

export default function Login({ users, documents, organisations }) {
    // component states, contains lists of <a> elements for users, documents and organisations.
    // selectedList contains the currently selected list to manage.
    // view contains the currently selected view of a specific item from the selected list.
    // search contains the current search query string.
    const [usersList, setUsersList] = useState(<></>);
    const [documentsList, setDocumentsList] = useState(<></>);
    const [organisationsList, setOrganisationsList] = useState(<></>);
    const [selectedList, setSelectedList] = useState(<></>);
    const [view, setView] = useState(<></>);
    const [search, setSearch] = useState("");

    // References the select and search inputs from user.
    const selectRef = useRef<HTMLSelectElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    // Creates <a> list from users after filtering based on search and sets it as the currently selected list if selected. This is the default selected list.
    useEffect( () => {
        const list = AnchorListClick(users.filter(u => filterByName(u, search)), u => u.first_name + " " + u.last_name, handleClick, u => u.member_id);
        setUsersList(list);
        const selected = selectRef.current?.value;
        if (!selected || selected === "users") {
            setSelectedList(list);
        }
    }, [users, search]);

    // Creates <a> list from documents after filtering based on search and sets it as the currently selected list if selected.
    useEffect( () => {
        const list = AnchorListClick(documents.filter(d => filterByDocument(d, search)), d => d.document_name, handleClick, d => d.document_id);
        setDocumentsList(list);
        const selected = selectRef.current?.value;
        if (selected === "docs") {
            setSelectedList(list);
        }
    }, [documents, search]);

    // Creates <a> list from organisations after filtering based on search and sets it as the currently selected list if selected.
    useEffect( () => {
        const list = AnchorListClick(organisations.filter(o => filterByOrganisation(o, search)), o => o.organisation_name, handleClick, o => o.organisation_id);
        setOrganisationsList(list);
        const selected = selectRef.current?.value;
        if (selected === "orgs") {
            setSelectedList(list);
        }
    }, [organisations, search]);

    // Function for handling a click event on an item in list. Finds item and sets view according to which list is selected.
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

    // Function for handling change of selected list. Upon changing selected list search input field is cleared.
    // View is also cleared, in the case of the organisation list being selected, the view is set to the view for adding new organisaitons.
    async function handleSelectionChange() {
        searchRef.current.value = "";
        setSearch("");
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

    // If there is no logged-in user, redirect to login page, and set this url to redirect back to post login
    if (!cookie) return {
        redirect: {
            destination: `/user/login?next=${url}`,
            permanent: false
        }
    }

    // If user does not have admin privilidge, redirect to home page
    if (permission !== "admin") return {
        redirect: {
            destination: "/",
            permanent: false
        }
    }

    // Fetch all members, documents and organisations from database
    const users = await db("members").orderBy("last_name", "asc").orderBy("first_name", "asc");
    const documents = await db("documents").distinctOn("document_name").orderBy("document_name", "asc");
    const organisations = await db("organisations").orderBy("organisation_name", "asc");
    
    return { props: { users, documents, organisations} };
}