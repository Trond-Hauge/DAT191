"use strict"; 

import React, {useEffect} from "react";
import Unity, {UnityContext} from "react-unity-webgl";
import { useRouter } from "next/router";
import { usePermission } from "../utils/client/hooks";

const unityContext = new UnityContext({
  loaderUrl: "Build/Unity_Build.loader.js",
  dataUrl: "Build/Unity_Build.data",
  frameworkUrl: "Build/Unity_Build.framework.js",
  codeUrl: "Build/Unity_Build.wasm",
});

export default function Streaming() {
  const permission = usePermission()
  const router = useRouter();
  let perm = 0;
  
    if (permission === "verified") perm = 1;
    if (permission === "admin") perm = 2;

  function updatePermission(){
    console.log("NOW");
    //unityContext.send("PermissionBlocking", "SetGivenPermission", perm);
    //unityContext.send("PlayerCapsule", "SetTMPText", permission);
    unityContext.send("PlayerCapsule", "SetPermission", perm);
  }

  useEffect( () => {
    unityContext.on("loaded", () => {
        setTimeout(updatePermission, 50)
    });
    return () => unityContext.removeAllEventListeners();
  }, []);

  // clears memory when user navigates away from current page
  useEffect( () => {
    router.events.on("routeChangeStart", () => {
      unityContext.unityInstance.Quit();
    })
  }, []);

  // not in use before an exit user action is added. Still useful.
  useEffect( () => {
    unityContext.on("quitted", () => {
      unityContext.unityInstance.Quit();
    });
  }, []);

  return (
    <>
      <main>
        <Unity unityContext={unityContext} style={{height: "90%", width: "90%", display: "block", margin: "auto"}}/>
      </main>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const cookie = ctx.req?.cookies.auth;
  const url = ctx.resolvedUrl;

  if (!cookie) return {
    redirect: {
      destination: `/user/login?next=${url}`,
      permanent: false
    }
  }

  return { props: {} };
}