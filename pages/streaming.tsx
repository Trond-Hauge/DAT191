"use strict"; 

import { getMemberClaims } from "../utils/server/user";
import React, {useEffect} from "react";
import Unity, {UnityContext} from "react-unity-webgl";
import Header from "../components/header";

const unityContext = new UnityContext({
  loaderUrl: "Build/Unity_Build.loader.js",
  dataUrl: "Build/Unity_Build.data",
  frameworkUrl: "Build/Unity_Build.framework.js",
  codeUrl: "Build/Unity_Build.wasm",
});

export default function Streaming({  permission }) {

  function updatePermission(permission){
    let perm = 0;
  
    if (permission === "verified") perm = 1;
    if (permission === "admin") perm = 2;
    
    // WIP - Test after new build! Is collision volume disconnected?
    unityContext.send("PlayerCapsule", "SetPermission", perm);
    unityContext.send("PlayerCapsule", "SetTMPText", permission);
    
  }

  useEffect(function () {
     unityContext.on("loaded", () => updatePermission(permission))
  }, []);

  return (
    <>
      {Header(permission)}
      <main>
        <Unity unityContext={unityContext} style={{height: "90%", width: "90%", display: "block", margin: "auto"}}/>
        <button onClick={updatePermission}>Hit me!</button>
      </main>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const cookie = ctx.req?.cookies.auth;
  const { permission } = getMemberClaims(cookie);
  const url = ctx.resolvedUrl;

  if (!permission) return {
    redirect: {
      destination: `/user/login?next=${url}`,
      permanent: false
    }
  }

  return { props: { permission } };
}