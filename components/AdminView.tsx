"use strict";

import Router from "next/router";
import { server } from "../next.config";
import { validateFirstName, validateLastName, validateUsername } from "../utils/multi/user";

export function UserView(user) {
    async function saveChangesUser() {
        const root = document.getElementById("userRoot");
        const firstName = root.querySelector("h3[id='firstName']")?.textContent;
        const lastName = root.querySelector("h3[id='lastName']")?.textContent;
        const username = root.querySelector("h3[id='username']")?.textContent;
        const email = root.querySelector("h3[id='email']")?.textContent;
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
        const answer = prompt("Are you sure you want to permanently delete this user? If yes, type: DELETE");
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
            <h1 className="view-header"><strong>User: </strong><p>{user.first_name + " " + user.last_name}</p></h1>
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
            <button onClick={saveChangesUser} className="btn-save-changes">Save Changes</button>
            <button onClick={deleteUser} className="btn-delete">Delete User</button>
        </div>
    )
}

export function DocumentView(doc) {
    return (
        <>
            <h1 className="view-header"><strong>Document: </strong><p>{doc.document_name}</p></h1>
            <div>
                <p>Title:</p>
                <h3 contentEditable>{doc.document_name}</h3>
            </div>
            <button className="btn-save-changes">Save Changes</button>
        </>
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