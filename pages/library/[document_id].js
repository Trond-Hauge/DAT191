"use strict";

import { useRouter } from 'next/router'

export default function Document() {
    const router = useRouter();
    const {document_id} = router.query;
    return (
        <div>
            Document {document_id} page
        </div>
    )
}