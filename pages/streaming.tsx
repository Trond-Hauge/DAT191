"use strict";
//import {authenticated} from ".//api/user/users"

export default function Streaming() {
  //const res = await fetch("http://localhost:3000/api/documents/documents", {method: "POST"});
  return (
    <div>
      <p>Page for streaming!</p>
    </div>
  );
};

//Streaming.getInitialProps

// Follow: https://dev.to/ivandotv/protecting-static-pages-in-next-js-application-1e50
Streaming.requireAuthentication = true;