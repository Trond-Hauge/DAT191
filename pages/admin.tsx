"use strict";

import Header from "../components/header";
import { getMemberClaims } from "../utils/server/user";
import { useState, useRef } from "react";
import { server } from "../next.config";
import AnchorListClick from "../components/AnchorListClick";
import { useRouter } from "next/router";
import { filterByDocument, filterByName, filterByOrganisation, sortByDocument, sortByName, sortByOrganisation } from "../utils/multi/list";

export default function Login({ permission }) {
    const [users, setUsers] = useState(null);
    const [documents, setDocuments] = useState(null);
    const [organisations, setOrganisations] = useState(null);
    const [fetching, setFetching] = useState(false);
    const [selectedList, setSelectedList] = useState(null);

    const selectRef = useRef<HTMLSelectElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    if (!fetching) {
        setFetching(true);

        fetch(`${server}/api/admin/members`).
        then( res => res.json()).
        then( json => {
            const { members } = json;
            members.sort(sortByName);
            setUsers(members);
            const aList = AnchorListClick(members, u => u.first_name + " " + u.last_name, "side-menu-elem-wide", handleClick);
            setSelectedList(aList);
        });

        fetch(`${server}/api/admin/documents`).
        then( res => res.json()).
        then( json => {
            const { documents } = json;
            setDocuments(documents);
        });

        fetch(`${server}/api/admin/organisations`).
        then( res => res.json()).
        then( json => {
            const { organisations } = json;
            setOrganisations(organisations);
        });
    }

    function handleClick() {

    }

    function handleSearch() {
        const search = searchRef.current?.value;
        updateList(search);
    }

    function handleSelectionChange() {
        searchRef.current.value = "";
        updateList();
    }

    function updateList(search?) {
        const val = selectRef.current?.value;
        const selected = val ? val : "users";

        switch (selected) {
            case "users": {
                const list = search ? users.filter( u => filterByName(u, search) ) : users;
                list.sort(sortByName);
                const aList = AnchorListClick(list, u => u.first_name + " " + u.last_name, "side-menu-elem-wide", handleClick);
                setSelectedList(aList);
            }
            break;

            case "docs": {
                const list = search ? documents.filter( d => filterByDocument(d, search) ) : documents;
                list.sort(sortByDocument);
                const aList = AnchorListClick(list, d => d.document_name, "side-menu-elem-wide", handleClick);
                setSelectedList(aList);
            }
            break;

            case "orgs": {
                const list = search ? organisations.filter( o => filterByOrganisation(o, search) ) : organisations;
                list.sort(sortByOrganisation);
                const aList = AnchorListClick(list, o => o.organisation_name, "side-menu-elem-wide", handleClick);
                setSelectedList(aList);
            }
            break;
        }
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