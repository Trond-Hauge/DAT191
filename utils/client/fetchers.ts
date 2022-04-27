"use strict";

import useSWR from "swr";
import { server } from "../../next.config";

export function useDocument(document) {
    const fetcher = url => fetch(`${server}${url}`).then( res => res.blob() );
    const { data, error } = useSWR(`/api/library/file?filename=${document.filename}&public=${document.public}&owner=${document.owner}`, fetcher);

    return {
        file: data,
        loading: !error && !data,
        error: error
    }
}