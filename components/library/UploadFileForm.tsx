"use strict";

import Router from "next/router";
import { useRef } from "react";
import { server } from "../../next.config";

export default function UploadFileForm(isVerified: boolean) {
    const msgRef = useRef<HTMLParagraphElement>(null);

    if (isVerified) {
        const uploadFile = async e => {
            e.preventDefault();
            const form = new FormData(e.target);
            const res = await fetch(`${server}/api/library/upload`, {
                method: "POST",
                body: form
            })
            const { message, error } = await res.json();
    
            if (error) {
                Router.push("/error");
            }
            else {
                msgRef.current.innerText = message;
                if (res.status === 201) {
                    e.target.reset();
                    Router.replace(Router.asPath, undefined, { shallow: false });
                }
            }
        }

        return (
            <>
            <form onSubmit={uploadFile}>
                <input
                    name="file"
                    type="file"
                    accept=".pdf"
                    required
                />
                <input
                    name="name" 
                    type="text"
                    placeholder="Document title"
                    required
                />
                <input
                    name="desc" 
                    type="text"
                    placeholder="Document description"
                    required
                />
                <label>Public</label>
                <input 
                    name="public"
                    value="true"
                    type="checkbox"
                    defaultChecked
                    required
                />
                <button type="submit">Upload Document</button>
            </form>
            <p ref={msgRef}></p>
            </>
        )
    }
    else {
        return (
            <p>You must be a verified user to upload files to the library.</p>
        )
    }
}