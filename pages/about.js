"use strict";

import { Header } from "../components/header.js";

export default function About() {
  return (
    <div className="container">
      {Header()}
      <div className="container-flex">
        <p>This page is even more work in progress that the rest of the site.</p>
      </div>
    </div>
  );
}
