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
                <h3>First Name:</h3>
                <p id="firstName" contentEditable>{user.first_name}</p>
            </div>
            <div>
                <h3>Last Name:</h3>
                <p id="lastName" contentEditable>{user.last_name}</p>
            </div>
            <div>
                <h3>Username:</h3>
                <p id="username" contentEditable>{user.username}</p>
            </div>
            <div>
                <h3>Email:</h3>
                <p id="email" contentEditable>{user.email}</p>
            </div>
            <div>
                <h3>Permission:</h3>
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
        else if (res.status === 207) {
            const { message } = await res.json();
            alert(message);
        }
        else {
            alert("Something went wrong!");
        }
    }

    async function deleteDoc() {
        const root = document.getElementById("docRoot");
        const id = root.querySelector<HTMLInputElement>("*[id='docID']")?.value;

        const answer = prompt("Are you sure you want to delete this document permanently? If yes, type: DELETE");
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

export function OrganisationView(org?) {
    async function saveChanges() {
        const root = document.getElementById("orgRoot");
        const id = root.querySelector<HTMLInputElement>("*[id='orgID']")?.value;
        const orgName = root.querySelector("*[id='name']")?.textContent;

        const res = await fetch(`${server}/api/admin/organisations`, {
            method: "PATCH",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id,
                orgName
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

    async function deleteOrg() {
        const root = document.getElementById("orgRoot");
        const id = root.querySelector<HTMLInputElement>("*[id='orgID']")?.value;

        const answer = prompt("Are you sure you want to delete this organisation permanently? If yes, type: DELETE");
        if (answer === "DELETE") {
            const res = await fetch(`${server}/api/admin/organisations`, {
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

    if (!org) {
        return <>{AddOrgForm()}</>
    }
    else {
        return (
            <>
                <div id="orgRoot">
                    <input
                        id="orgID"
                        type="hidden"
                        value={org.organisation_id}
                    />
                    <h1 className="view-header">Organisation</h1>
                    <div>
                        <h3>Organisation name:</h3>
                        <p id="name" contentEditable>{org.organisation_name}</p>
                    </div>
                    <button onClick={saveChanges} className="btn-save-changes">Save Changes</button>
                    <button onClick={deleteOrg} className="btn-delete">Delete Organisation</button>
                </div>
                <br></br>
                {AddOrgForm()}
            </>
        )
    }
}

function AddOrgForm() {
    return (
        <>
            <h1 className="view-header">Add a new organisation</h1>
            <div>
                <input
                    type="text"
                    name="name"
                />
            </div>
        </>
    )
}