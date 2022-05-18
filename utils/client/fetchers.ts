"use strict";

import useSWR from "swr";
import { getFile } from "../../firebase";

/**
 * A hook which fetches a file with Firebase and returns a local URL to the file object, as well as loading and error values.
 * @param fileref Bucket reference to a file.
 * @returns An object containing a URL to the file object, a loading property indicating if the data is in a loading state, an error property indicating if the fetch failed.
 */
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

/**
 * A hook which fetches a file from the library/file API route. Returns the file object as well as loading and error values.
 * @param id An id referencing the associated document.
 * @returns An object containing the file, a loading property indicating if the data is still being fetched, an error property indicating if the fetch failed.
 */
export function useFile(id) {
    const fetcher = url => fetch(url).then( res => res.blob() );
    const { data, error } = useSWR(`/api/library/file?id=${id}`);

    return {
        file: data,
        loading: !error && !data,
        error,
    }
}

/**
 * A hook which fetches a list of documents from the library/documents API route.
 * @returns An object containing the list of documents, a loading property indicating if the data is still being fetched, an error property indicating if the fetch failed, a mutate property which is a function that can be run to update the fetch.
 */
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