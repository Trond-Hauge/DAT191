"use strict";

import { getMemberClaims } from "../../utils/server/user";
import Header from "../../components/header";
import { db } from "../../db";
import { useRef, useState } from "react";
import { server } from "../../next.config";
import { useRouter } from "next/router";
import AnchorListClick from "../../components/AnchorListClick";
import { filterByDocument, sortByDocument } from "../../utils/multi/list";

export default function Publications({ permission, documents }) {
    const router = useRouter();
    const searchRef = useRef<HTMLInputElement>(null);
    const titleRef = useRef<HTMLParagraphElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const publicRef = useRef<HTMLButtonElement>(null);
    const [document, setDocument] = useState(null);
    const [aList, setAList] = useState(AnchorListClick(documents, d => d.document_name, updateDoc, d => d.document_id));

    function handleSearch() {
        const search = searchRef.current?.value;
        const list = search ? documents.filter( d => filterByDocument(d, search) ) : documents;
        const aList = AnchorListClick(list, d => d.document_name, updateDoc, d => d.document_id);
        setAList(aList);
    }

    function updateDoc(e) {
        const a: HTMLAnchorElement = e.target;
        const docID = parseInt(a.querySelector<HTMLInputElement>("input[type='hidden']")?.value);
        const doc = documents.find( d => d.document_id === docID );
        setDocument(doc);
    }

    async function saveChanges() {
        const title = titleRef.current?.textContent;
        const desc = descRef.current?.textContent;
        const _public = publicRef.current?.value;
        const id = document.document_id;

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
            router.reload();
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
        const id = document.document_id;

        const answer = prompt("Are you sure you want to delete this document permanently? Type DELETE to confirm");
        if (answer === "DELETE") {
            const res = await fetch(`${server}/api/user/document`, {
                method: "DELETE",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id
                })
            });

            if (res.status === 200) {
                router.reload();
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
                    onChange={handleSearch}
                    ref={searchRef}
                />
                {aList}
            </div>
            <div className="view-space-wide-menu">
                <div className="view-container">
                    {document &&
                        <>
                            <h1 className="view-header">Document</h1>
                            <div>
                                <h3>Title:</h3>
                                <p ref={titleRef} contentEditable>{document.document_name}</p>
                            </div>
                            <div>
                                <h3>Description:</h3>
                                <p ref={descRef} contentEditable>{document.document_description}</p>
                            </div>
                            <div>
                                <button ref={publicRef} className="btn-public" value={document.public} onClick={togglePublic}>{document.public ? "Public" : "Private"}</button>
                            </div>
                            <button onClick={saveChanges} className="btn-save-changes">Save Changes</button>
                            <button onClick={deleteDoc} className="btn-delete">Delete Document</button>
                        </>
                    }
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
    const documents = await db("documents").where("owner", id);
    return { props: { permission, documents: documents } };
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