"use strict";

import { getMemberClaims } from "../../utils/server/user";
import Header from "../../components/header";
import { db } from "../../db";
import { useEffect, useRef, useState } from "react";
import { server } from "../../next.config";
import { useRouter } from "next/router";
import AnchorListClick from "../../components/AnchorListClick";
import { filterByDocument } from "../../utils/multi/list";

export default function Publications({ permission, documents }) {
    const router = useRouter();
    const searchRef = useRef<HTMLInputElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLTextAreaElement>(null);
    const publicRef = useRef<HTMLButtonElement>(null);
    const [search, setSearch] = useState("");
    const [doc, setDoc] = useState(null);
    const [view, setView] = useState(<></>);
    const [aList, setAList] = useState(<></>);

    useEffect( () => {
        if (descRef.current) {
            const ta: HTMLTextAreaElement = descRef.current;
            ta.value = doc.document_description;
            ta.style.height = "";
            ta.style.height = ta.scrollHeight + 3 + "px";
        }

        if (titleRef.current) {
            titleRef.current.value = doc.document_name;
        }
    }, [view])

    useEffect( () => {
        if (doc) {
            setView(
                <>
                    <h1 className="view-header">Document</h1>
                    <div>
                        <h3>Title:</h3>
                        <input
                            type="text"
                            ref={titleRef}
                        />
                    </div>
                    <div>
                        <h3>Description:</h3>
                        <textarea
                            onChange={ e => {
                                const ta: HTMLTextAreaElement = e.target;
                                ta.style.height = "";
                                ta.style.height = ta.scrollHeight + 3 + "px";
                            }}
                            ref={descRef}
                        />
                    </div>
                    <div>
                        <button ref={publicRef} className="btn-public" value={doc.public} onClick={togglePublic}>{doc.public ? "Public" : "Private"}</button>
                    </div>
                    <button onClick={saveChanges} className="btn-save-changes">Save Changes</button>
                    <button onClick={deleteDoc} className="btn-delete">Delete Document</button>
                </>
            )
        }
    }, [doc])

    useEffect( () => {
        const list = AnchorListClick(documents.filter(d => filterByDocument(d,search)), d => d.document_name, updateDoc, d => d.document_id)
        setAList(list);
    }, [documents, search])

    function updateDoc(e) {
        const a: HTMLAnchorElement = e.target;
        const docID = parseInt(a.querySelector<HTMLInputElement>("input[type='hidden']")?.value);
        const d = documents.find( d => d.document_id === docID );
        setDoc(d);
    }

    async function saveChanges() {
        const title = titleRef.current?.value;
        const desc = descRef.current?.value;
        const _public = publicRef.current?.value;
        const id = doc.document_id;

        const res = await fetch(`${server}/api/user/document`, {
            method: "PATCH",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                title,
                desc,
                public: _public,
                id
            })
        });

        if (res.status === 200) {
            router.replace(router.asPath);
        }
        else if (res.status === 207) {
            const { message } = await res.json();
            alert(message);
        }
        else {
            alert("Something went wrong!");
        }
    }

    async function deleteDoc() {
        const id = doc.document_id;

        const answer = prompt("Are you sure you want to delete this doc permanently? Type DELETE to confirm");
        if (answer === "DELETE") {
            const res = await fetch(`${server}/api/user/document`, {
                method: "DELETE",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id
                })
            });

            if (res.status === 200) {
                setView(null);
                router.replace(router.asPath);
            }
            else {
                alert("Something went wrong!");
            }
        }
    }

    function togglePublic(e) {
        const btn = e.target;
        const val = btn.value;
        if (val === "true") {
            btn.value = false;
            btn.innerText = "Private";
        }
        else {
            btn.value = true;
            btn.innerText = "Public";
        }
    }

    return (
        <>
        {Header(permission)}
        <main>
            <div className="wide-side-menu-container">
                <h4>Your Publications</h4>
                <input
                    type="text"
                    placeholder="Search"
                    onChange={ e => setSearch(e.target.value) }
                    ref={searchRef}
                />
                {aList}
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

export async function getServerSideProps (ctx) {
  const cookie = ctx.req?.cookies.auth;
  const { id, permission } = getMemberClaims(cookie);
  const url = ctx.resolvedUrl;

  if (!cookie) return {
    redirect: {
      destination: `/user/login?next=${url}`,
      permanent: false
    }
  }

  try {
    const documents = await db("documents").where("owner", id).distinctOn("document_name").orderBy("document_name", "asc");
    return { props: { permission, documents } };
  }
  catch (error) {
    console.error(error);
    return {
      redirect: {
        destination: "/error",
        permanent: false
      }
    }
  }
}