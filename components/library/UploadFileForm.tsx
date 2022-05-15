"use strict";

import Router from "next/router";
import { useRef } from "react";
import { server } from "../../next.config";

export default function UploadFileForm({ permission, onUpload }) {
    const msgRef = useRef<HTMLParagraphElement>(null);

    if (permission === "verified" || permission === "admin") {
        const uploadFile = async e => {
            e.preventDefault();
            const form = new FormData(e.target);
            e.target.reset();
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
                    if (onUpload) onUpload();
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
                    className="side-menu-elem-wide"
                />
                <textarea
                    name="desc" 
                    rows={8}
                    placeholder="Document description"
                    required
                    className="side-menu-elem-wide"
                />
                <label>Public</label>
                <input 
                    name="public"
                    value="true"
                    type="checkbox"
                    defaultChecked
                />
                <button type="submit">Upload Document</button>
            </form>
            <p ref={msgRef}></p>
            </>
        )
    }
    else {
        return (
            <p className="side-menu-elem-wide">You must be a verified user to upload files to the library.</p>
        )
    }
}