"use strict";

import axios from "axios";
import Router from "next/router";

export default function UploadFileForm(isVerified) {
    if (isVerified) {
        const uploadFile = async e => {
            e.preventDefault();
            const form = new FormData(e.target);
            const res = await axios.post(`/api/library/upload`, form);
            const { message, error } = res.data;
    
            if (error) console.log(error);
            else console.log(message);
    
            Router.replace(Router.asPath);
        }

        return (
            <form id="upload-form" onSubmit={uploadFile}>
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
                <button type="submit">Submit</button>
            </form>
        )
    }
    else {
        return (<></>)
    }
}