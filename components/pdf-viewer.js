import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
// import pdf worker as a url, see `next.config.js` and `pdf-worker.js`

import workerSrc from "pdfjs-dist/build/pdf.worker.entry";

//const workerSrc = require("pdfjs-dist/build/pdf.worker.min.js") ? require("pdfjs-dist/build/pdf.worker.js");

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export default function PDFViewer() {
  const file = "/Document.pdf";

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function nextPage() {
    if (pageNumber < numPages) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  }

  function prevPage() {
    if (pageNumber > 1) {
      setPageNumber((prevPageNumber) => prevPageNumber - 1);
    }
  }

  function zoomIn() {
    if (scale < 2) {
      setScale((prevScale) => prevScale + 0.1);
    }
  }

  function zoomOut() {
    if (scale > 1.1) {
      setScale((prevScale) => prevScale - 0.1);
    }
  }

  return (
    <main>
      <div className="container-2-column">
        <div className="side-menu-container">
          <p>
            Page {pageNumber} / {numPages}
          </p>
          <hr />
          <a onClick={nextPage}>Next Page</a>
          <a onClick={prevPage}>Previous Page</a>
          <hr />
          <input
            name="page"
            type="number"
            placeholder="Go to page"
            min="1"
            max={numPages}
          />
          <a>Go to page</a>
          <hr />
          <a onClick={zoomIn}>Zoom in</a>
          <a onClick={zoomOut}>Zoom out</a>
        </div>
        <div className="pdf-container">
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} scale={scale} />
          </Document>
        </div>
      </div>
    </main>
  );
}

// Outdated
/*
{Array.from({ length: numPages }, (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderAnnotationLayer={true}
              renderTextLayer={true}
            />
          ))}
*/
