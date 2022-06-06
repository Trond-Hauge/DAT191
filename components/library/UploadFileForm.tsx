"use strict";

import Router from "next/router";
import { useRef } from "react";
import { maxFileSize } from "../../app.config";
import { deleteFile, uploadFile } from "../../firebase";
import { server } from "../../next.config";
import { usePermission } from "../../utils/client/hooks";

const B_TO_MB = 0.00000095367432;

export default function UploadFileForm({ uid, onUpload }) {
    const msgRef = useRef<HTMLParagraphElement>(null);
    const permission = usePermission()

    if (permission === "verified" || permission === "admin") {
        const uploadDocumentOld = async e => {
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

        const uploadDocument = async e => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const form = Object.fromEntries(formData.entries());
            e.target.reset();

            const name = form.name;
            const desc = form.desc;
            const _public = form.public;
            const file: any = form.file;
            const sizeBytes = file.size;
            const filename = file.name;
            const fileref = `${uid}/${Date.now().valueOf()}:${filename}`;

            if (sizeBytes * B_TO_MB > maxFileSize) {
                msgRef.current.innerText = `This file is too large. Maximum file size is ${maxFileSize}MBs`;
                return;
            }

            try {
                await uploadFile(fileref, file);

                const res = await fetch("/api/library/uploadWithFirebase", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        name,
                        desc,
                        public: _public,
                        filename,
                        fileref,
                    })
                })

                if (res.status === 200) {
                    msgRef.current.innerText = "Document was uploaded successfully.";
                    onUpload();
                }
                else {
                    deleteFile(fileref);
                    throw new Error("Failed to upload document to database");
                }
            } 
            catch (error) {
                msgRef.current.innerText = "Something went wrong.";
            }
        }

        return (
            <>
            <form onSubmit={uploadDocument}>
                <input
                    name="file"
                    type="file"
                    accept="application/pdf"
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
    else return <p className="side-menu-elem-wide">You must be a verified user to upload files to the library.</p>
}