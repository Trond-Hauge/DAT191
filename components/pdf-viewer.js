import { useState } from "react";
// import default react-pdf entry
import { Document, Page, pdfjs } from "react-pdf";
// import pdf worker as a url, see `next.config.js` and `pdf-worker.js`

import workerSrc from "pdfjs-dist/build/pdf.worker.entry";

//const workerSrc = require("pdfjs-dist/build/pdf.worker.min.js") ? require("pdfjs-dist/build/pdf.worker.js");

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export default function PDFViewer() {
  const [file, setFile] = useState("/Document.pdf");
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }

  return (
    <div className="pdf-container">
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderAnnotationLayer={true}
              renderTextLayer={true}
            />
          ))}
        </Document>
    </div>
  );
}