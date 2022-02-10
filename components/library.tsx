import Link from "next/link";

export function fileCard(doc) {
    return (
        <Link href={`/library/${doc.document_id}`}>
            <div className="file-card">
                <div className="inner-card-container">
                <h2 className="org">{doc.organisation_name}</h2>
                <h2 className="author">{doc.first_name} {doc.last_name}</h2>
                <h3 className="title">{doc.document_name}</h3>
                <p className="desc">{doc.document_description}</p>
                </div>
            </div>
        </Link>
    );
}