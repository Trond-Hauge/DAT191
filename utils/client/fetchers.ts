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

export function useDocuments() {
    const fetcher = url => fetch(`${server}${url}`).then( res => res.json() );
    const { data, error } = useSWR<any[],any>("/api/library/documents", fetcher);

    return {
        documents: data,
        loading: !error && !data,
        error: error
    }
}