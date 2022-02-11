"use strict"

import { useState } from "react"
import axios from "axios";
import Header from "../components/header";

export default function UploadFiles({ isCookie }) {
    const [file, setFile] = useState(null);
    
    const onInputChange = (e) => {
        setFile(e.target.files[0])
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const data = new FormData();

        data.append('file', file);

        axios.post('//localhost:3000/', data)
            .then((e) => {
                console.log('Success')
            })
            .catch((e) => {
                console.error('Error', e)
            })
    };

    return (
        <>
        {Header(isCookie)}
        <main>
        <form method="post" action="#" id="#" onSubmit={onSubmit}>
            <div className="form-group files">
                <label>Upload your file</label>
                <input type="file"
                    onChange={onInputChange}
                    className="form-control"
                    multiple=""/>
            </div>
            <button>Submit</button>
        </form>
        </main>
        </>
    );
}
export async function getServerSideProps(appContext) {
    const cookie = appContext.req?.headers.cookie;
  
    const isCookie = cookie ? true : false;
    return { props: { isCookie } };
  }
