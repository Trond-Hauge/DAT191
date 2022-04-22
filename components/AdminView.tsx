"use strict";

import Router from "next/router";
import { server } from "../next.config";
import { validateFirstName, validateLastName, validateUsername } from "../utils/multi/user";

export function UserView(user) {
    async function saveChanges() {
        const root = document.getElementById("userRoot");
        const firstName = root.querySelector("*[id='firstName']")?.textContent;
        const lastName = root.querySelector("*[id='lastName']")?.textContent;
        const username = root.querySelector("*[id='username']")?.textContent;
        const email = root.querySelector("*[id='email']")?.textContent;
        const permission = root.querySelector<HTMLSelectElement>("select[id='permission']")?.value;
        const id = root.querySelector<HTMLInputElement>("input[id='userID']")?.value;
    
        const valid = validateFirstName(firstName) && validateLastName(lastName) && validateUsername(username);
        if (valid) {
            const res = await fetch(`${server}/api/admin/members`, {
                method: "PATCH",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    firstName,
                    lastName,
                    username,
                    email,
                    permission,
                    id
                })
            });
    
            if (res.status === 200) {
                Router.reload();
            }
            else if (res.status === 207) {
                const { message } = await res.json();
                alert(message);
            }
            else {
                alert("Something went wrong!");
            }
        }
        else {
            alert("Some of the changed details are invalid!");
        }
    }

    async function deleteUser() {
        const root = document.getElementById("userRoot");
        const id = root.querySelector<HTMLInputElement>("input[id='userID']")?.value;
        const answer = prompt("Are you sure you want to delete this user permanently? If yes, type: DELETE");
        if (answer === "DELETE") {
            const res = await fetch(`${server}/api/admin/members`, {
                method: "DELETE",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id
                })
            })

            if (res.status === 200) {
                Router.reload();
            }
            else {
                alert("Something went wrong!");
            }
        }
    }

    return (
        <div id="userRoot">
            <input
            id="userID"
                type="hidden"
                value={user.member_id}
            />
            <h1 className="view-header">User</h1>
            <div>
                <p>First Name:</p>
                <h3 id="firstName" contentEditable>{user.first_name}</h3>
            </div>
            <div>
                <p>Last Name:</p>
                <h3 id="lastName" contentEditable>{user.last_name}</h3>
            </div>
            <div>
                <p>Username:</p>
                <h3 id="username" contentEditable>{user.username}</h3>
            </div>
            <div>
                <p>Email:</p>
                <h3 id="email" contentEditable>{user.email}</h3>
            </div>
            <div>
                <p>Permission:</p>
                <select id="permission">
                    <option value="unverified" selected={user.permission === "unverified"}>Unverified</option>
                    <option value="verified" selected={user.permission === "verified"}>Verified</option>
                    <option value="admin" selected={user.permission === "admin"}>Admin</option>
                </select>
            </div>
            <button onClick={saveChanges} className="btn-save-changes">Save Changes</button>
            <button onClick={deleteUser} className="btn-delete">Delete User</button>
        </div>
    )
}

export function DocumentView(doc) {
    async function saveChanges() {
        const root = document.getElementById("docRoot");
        const title = root.querySelector("*[id='title'")?.textContent;
        const desc = root.querySelector("*[id='desc']")?.textContent;
        const _public = root.querySelector<HTMLButtonElement>("*[id='public']")?.value;
        const id = root.querySelector<HTMLInputElement>("*[id='docID']")?.value;

        const res = await fetch(`${server}/api/admin/documents`, {
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
            Router.reload();
        }
        else {
            alert("Something went wrong!");
        }
    }

    async function deleteDoc() {
        const root = document.getElementById("docRoot");
        const id = root.querySelector<HTMLInputElement>("*[id='docID']")?.value;

        const answer = prompt("Are you sure you want to delete this document permanently? If yes, type: DLETE");
        if (answer === "DELETE") {
            const res = await fetch(`${server}/api/admin/documents`, {
                method: "DELETE",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    id
                })
            });

            if (res.status === 200) {
                Router.reload();
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
        <div id="docRoot">
            <input
                id="docID"
                type="hidden"
                value={doc.document_id}
            />
            <h1 className="view-header">Document</h1>
            <div>
                <h3>Title:</h3>
                <p id="title" contentEditable>{doc.document_name}</p>
            </div>
            <div>
                <h3>Description:</h3>
                <p id="desc" contentEditable>{doc.document_description}</p>
            </div>
            <div>
                <button id="public" className="btn-public" value={doc.public} onClick={togglePublic}>{doc.public ? "Public" : "Private"}</button>
            </div>
            <button onClick={saveChanges} className="btn-save-changes">Save Changes</button>
            <button onClick={deleteDoc} className="btn-delete">Delete Document</button>
        </div>
    )
}

export function OrganisationView(org) {
    return (
        <>
            <h1 className="view-header"><strong>User: </strong><p>{org.organisation_name}</p></h1>
            <div>
                <p>Organisation name:</p>
                <h3 contentEditable>{org.organisation_name}</h3>
            </div>
            <button className="btn-save-changes">Save Changes</button>
        </>
    )
}