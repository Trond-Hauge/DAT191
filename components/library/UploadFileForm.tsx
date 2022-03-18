"use strict";

import Router from "next/router";
import { server } from "../../next.config";

export default function UploadFileForm(isVerified) {
    if (isVerified) {
        const uploadFile = async e => {
            e.preventDefault();
            const form = new FormData(e.target);
            const res = await fetch(`${server}/api/library/upload`, {
                method: "POST",
                body: form
            })
            const { message, error } = await res.json();
    
            if (error) console.log(error);
            else console.log(message);
    
            Router.replace(Router.asPath);
        }

        return (
            <form className="upload-form" onSubmit={uploadFile}>
                <input
                    name="file"
                    type="file"
                    accept=".pdf"
                    required
                />
                <input
                    name="fileName" 
                    type="text"
                    placeholder="Document title"
                    required
                />
                <input
                    name="fileDesc" 
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
                <br></br>
                <button type="submit">Upload Document</button>
            </form>
        )
    }
    else {
        return (<></>)
    }
}