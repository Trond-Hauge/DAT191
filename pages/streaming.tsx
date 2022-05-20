"use strict"; 

import { getMemberClaims } from "../utils/server/user";
import { server } from "../next.config";
import React, {useEffect} from "react";
import Unity, {UnityContext} from "react-unity-webgl";

import Header from "../components/header";

const unityContext = new UnityContext({
  loaderUrl: "Build/Unity_Build.loader.js",
  dataUrl: "Build/Unity_Build.data",
  frameworkUrl: "Build/Unity_Build.framework.js",
  codeUrl: "Build/Unity_Build.wasm",
});

export default function Streaming({ context, permission }: any) {

  let perm = 0;
  
    if (permission === "verified") perm = 1;
    if (permission === "admin") perm = 2;

  function updatePermission(){
    
    //unityContext.send("PermissionBlocking", "SetGivenPermission", perm);
    unityContext.send("PlayerCapsule", "SetTMPText", permission);
    unityContext.send("PlayerCapsule", "SetPermission", perm);
  }

  useEffect(function () {
    unityContext.on("loaded", () => updatePermission())
  });

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

  const res = await fetch(`${server}/api/streaming`, {
    headers: {
      cookie: cookie!
    }
  });

  if (res.status === 401) {
    return {
      redirect: {
        destination: `/user/login?next=${url}`,
        permanent: false
      }
    }
  }

  const json = await res.json();
  return { props: { context: json, permission } };
}