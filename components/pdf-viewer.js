import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Link from "next/link";
import Router from "next/router";
import workerSrc from "pdfjs-dist/build/pdf.worker.entry";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

// This setup is using React instead of regular variables to provide a more responsive experience, with less stress on the server.
// The downside of this setup is that the user may lose their progress when refreshing.
// However, the PDF renderer seems to rerender each time without, potentially causing significant overhead.
// TODO: See if using Router.replace will casue significant stress on server in terms of loading the PDF.

// Potential solution: Copy link to clipboard. useState is already prepared to do queries.

export default function PDFViewer({file}) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(Router.query.page ? parseInt(Router.query.page) : 1);
  const [scale, setScale] = useState(Router.query.scale ? parseInt(Router.query.scale) : 10);

  function handleKeyDown(e) {
    switch (e.code) {
      case "ArrowRight": {
        nextPage();
      }
      break;

      case "ArrowDown": {
        nextPage();
      }
      break;

      case "ArrowLeft": {
        prevPage();
      }
      break;

      case "ArrowUp": {
        prevPage();
      }
      break;
    }
  }

  useEffect( () => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  })

  function onDocumentLoadSuccess({numPages}) {
    setNumPages(numPages);
  }

  function nextPage() {
    if (pageNumber < numPages) {
      setPageNumber((prevPage) => prevPage + 1);
      //Router.replace(`${url}?page=${pageNumber+1}&scale=${scale}`, undefined, {shallow: true});
    }
  }

  function prevPage() {
    if (pageNumber > 1) {
      setPageNumber((prevPage) => prevPage - 1);
      //Router.replace(`${url}?page=${pageNumber-1}&scale=${scale}`, undefined, {shallow: true});
    }
  }

  function goToPage() {
    const input = document.querySelector("input[name='page']");
    const page = parseInt(input.value);
    if (page && page > 0 && page <= numPages) setPageNumber(page);
  }

  function zoomIn() {
    if (scale < 20) {
      setScale((prevScale) => prevScale + 1);
      //Router.replace(`${url}?page=${pageNumber}&scale=${scale+0.1}`, undefined, {shallow: true});
    }
  }

  function zoomOut() {
    if (scale > 10) {
      setScale((prevScale) => prevScale - 1);
      //Router.replace(`${url}?page=${pageNumber}&scale=${scale-0.1}`, undefined, {shallow: true});
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
            style={{width: "40%"}}
          />
          <a onClick={goToPage}>Go to page</a>
          <hr />
          <a onClick={zoomIn}>Zoom in</a>
          <a onClick={zoomOut}>Zoom out</a>
          <hr />
          <Link href="/library"><a>Back to Library</a></Link>
        </div>
        <div className="pdf-container">
          <Document file={file ? file : {}} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} scale={scale/10} />
          </Document>
        </div>
      </div>
    </main>
  );
}