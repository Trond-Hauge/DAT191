import Link from "next/link";

export function fileCard(doc) {
    const desc = doc.document_description.length > 130 ? doc.document_description.substring(0, 130) + "..." : doc.document_description;
    return (
        <Link href={`/library/${doc.document_id}`}>
            <div className="file-card">
                <h3>{doc.document_name}</h3>
                <p>{desc}</p>
            </div>
        </Link>
    );
}