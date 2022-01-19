'use strict';

import Link from "next/link";
import {Header} from "../../components/header";

export default function Library({list}) {
    return (
        <div className="container">
            {Header()}
            <div>
                List:
                <ul>
                    {JSON.stringify(list, null, 2)}
                </ul>
            </div>
        </div>
    );
}

Library.getInitialProps = async () => {
    const res = await fetch("http://localhost:3000/api/documents/documents", {method: "GET"}); //There must be a better way.
    const json = await res.json();
    return {list: json};
}
