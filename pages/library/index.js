'use strict';

import Link from "next/link";


export default function Library({list}) {
    return (
        <div>
            <p>Page for library!</p>
            <hr/>
            <div>
                List: {JSON.stringify(list, null, 2)}
            </div>
        </div>
    );
}

Library.getInitialProps = async () => {
    const res = await fetch("http://localhost:3000/api/documents/documents"); //There must be a better way.
    const json = await res.json();
    return {list: json};
}