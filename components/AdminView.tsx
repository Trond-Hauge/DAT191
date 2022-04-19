"use strict";

export function UserView(user) {
    return (
        <>
            <h1>{user.first_name + " " + user.last_name}</h1>
            <h1>{user.username}</h1>
            <h1>{user.email}</h1>
        </>
    )
}

export function DocumentView(doc) {
    return (
        <>
            <h1>{doc.document_name}</h1>
        </>
    )
}

export function OrganisationView(org) {
    return (
        <>
            <h1>{org.organisation_name}</h1>
        </>
    )
}