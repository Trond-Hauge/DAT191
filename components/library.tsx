"use strict";

import Link from "next/link";
import { useRouter } from "next/router";

export function fileCardList(documents) {
    return (
        <>
            {documents.map( doc => {
                return (
                    <Link href={`/library/${doc.document_id}`} key={doc.document_id}>
                        <div className="file-card">
                            <div className="inner-card-container">
                                <h2 className="org">{doc.organisation_name}</h2>
                                <h2 className="author">{doc.first_name} {doc.last_name}</h2>
                                <h3 className="title">{doc.document_name}</h3>
                                <p className="desc">{doc.document_description}</p>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </>
    )
}

export function uploadForm(isVerified, uploadFile) {
    if (isVerified) {
        return (
            <form id="upload-form" onSubmit={uploadFile}>
                <input
                    name="file"
                    type="file"
                    accept=".pdf"
                    required
                />
                <input
                    name="fileDesc" 
                    type="text"
                    required
                />
                <button type="submit">Submit</button>
            </form>
        )
    }
    else {
        return (<></>)
    }
}
