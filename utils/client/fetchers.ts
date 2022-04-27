"use strict";

import useSWR from "swr";
import { server } from "../../next.config";

export function useDocument(id) {
    const fetcher = url => fetch(`${server}${url}`).then( res => res.blob() );
    const { data, error } = useSWR(`/api/library/file?id=${id}`, fetcher);

    return {
        file: data,
        loading: !error && !data,
        error: error
    }
}