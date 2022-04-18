"use strict";

export function UserView(user) {
    return (
        <>
            <p>{user.first_name + " " + user.last_name}</p>
            <p>{user.email}</p>
        </>
    )
}

export function DocumentView(doc) {
    return (
        <>
            <p>{doc.document_name}</p>
        </>
    )
}

export function OrganisationView(org) {
    return (
        <>
            <p>{org.organisation_name}</p>
        </>
    )
}