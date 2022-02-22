import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useRouter } from "next/router";
import Router from "next/router";
// import pdf worker as a url, see `next.config.js` and `pdf-worker.js`

import workerSrc from "pdfjs-dist/build/pdf.worker.entry";

//const workerSrc = require("pdfjs-dist/build/pdf.worker.min.js") ? require("pdfjs-dist/build/pdf.worker.js");

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

export default function PDFViewer() {
  const file = "/Document.pdf";
  const {asPath} = useRouter();
  const url = asPath.split("?")[0];

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(Router.query.page ? parseInt(Router.query.page) : 1);
  const [scale, setScale] = useState(Router.query.scale ? parseFloat(Router.query.scale) : 1);

  function onDocumentLoadSuccess({numPages}) {
    setNumPages(numPages);
  }

  function nextPage() {
    if (pageNumber < numPages) {
      Router.replace(`${url}?page=${pageNumber+1}&scale=${scale}`, undefined, {shallow: true});
    }
  }

  function prevPage() {
    if (pageNumber > 1) {
      Router.replace(`${url}?page=${pageNumber-1}&scale=${scale}`, undefined, {shallow: true});
    }
  }

  function zoomIn() {
    if (scale < 2) {
      Router.replace(`${url}?page=${pageNumber}&scale=${scale+0.1}`, undefined, {shallow: true});
    }
  }

  function zoomOut() {
    if (scale > 1.1) {
      Router.replace(`${url}?page=${pageNumber}&scale=${scale-0.1}`, undefined, {shallow: true});
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
