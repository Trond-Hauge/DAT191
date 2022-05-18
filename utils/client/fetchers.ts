"use strict";

import useSWR from "swr";
import { getFile } from "../../firebase";

export function useFileURL(fileref) {
    const fetcher = ref => getFile(ref);
    const { data, error } = useSWR(fileref, fetcher, {
        revalidateOnFocus: false,
        revalidateOnMount: true,
        revalidateOnReconnect: false,
        refreshWhenOffline: false,
        refreshWhenHidden: false,
        refreshInterval: 0
      });

    return {
        fileURL: data ? window.URL.createObjectURL(data) : null,
        loading: error && !data,
        error
    }
}

export function useFile(id) {
    const fetcher = url => fetch(url).then( res => res.blob() );
    const { data, error } = useSWR(`/api/library/file?id=${id}`);

    return {
        documents: data,
        loading: !error && !data,
        error,
    }
}

export function useDocuments() {
    const fetcher = url => fetch(url).then( res => res.json() );
    const { data, error, mutate } = useSWR<any[],any>("/api/library/documents", fetcher);

    return {
        documents: data,
        loading: !error && !data,
        error,
        mutate
    }
}