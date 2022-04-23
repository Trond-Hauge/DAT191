"use strict";

import { getMemberClaims } from "../../utils/server/user";
import Header from "../../components/header";
import { db } from "../../db";
import { useRef } from "react";
import { server } from "../../next.config";
import { useRouter } from "next/router";

export default function Home({ permission, user }) {
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passMsgRef = useRef(null);

  const router = useRouter();

  function requestPasswordReset() {
    fetch(`${server}/api/user/requestPasswordReset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
      }),
    });

    passMsgRef.current.innerText = "An email will be sent to you to reset your password."
  }

  async function saveChanges() {
    const res = await fetch(`${server}/api/user/user`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: firstNameRef.current?.textContent,
        lastName: lastNameRef.current?.textContent,
        username: usernameRef.current?.textContent,
        email: emailRef.current?.textContent,
        userID: user.member_id
      })
    });

    if (res.status === 200) {
      router.reload();
    }
    else if (res.status === 207) {
      const { message } = await res.json();
      alert(message);
    }
    else {
      alert("Something went wrong!");
    }
  }

  async function deleteAccount() {
    const answer = prompt("Are you sure you want to permanently delete your account? Type DELETE to confirm.");
    if (answer === "DELETE") {
      const res = await fetch(`${server}/api/user/user`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: user.member_id
        })
      });

      if (res.status === 200) {
        await fetch(`${server}/api/user/logout`);
        router.reload();
      }
      else {
        alert("Something went wrong!");
      }
    }
  }

  return (
    <>
      {Header(permission)}
      <main>
        <div className="view-space">
          <div className="view-container">
            <h1 className="view-header">Account Settings</h1>
            <div>
                <h3>First Name</h3>
                <p contentEditable ref={firstNameRef}>{user.first_name}</p>
            </div>
            <div>
                <h3>Last Name</h3>
                <p contentEditable ref={lastNameRef}>{user.last_name}</p>
            </div>
            <div>
                <h3>Username</h3>
                <p contentEditable ref={usernameRef}>{user.username}</p>
            </div>
            <div>
                <h3>Email</h3>
                <p contentEditable ref={emailRef}>{user.email}</p>
            </div>
            <div>
                <h3>Permission</h3>
                <p>{user.permission}</p>
            </div>
            <div>
              <a onClick={requestPasswordReset}>Click here to change your password</a>
              <p ref={passMsgRef}></p>
            </div>
            <button onClick={saveChanges} className="btn-save-changes">Save Changes</button>
            <button onClick={deleteAccount} className="btn-delete">Delete Account</button>
          </div>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps (ctx) {
  const cookie = ctx.req?.cookies.auth;
  const { email, permission } = getMemberClaims(cookie);
  const url = ctx.resolvedUrl;

  if (!cookie) return {
    redirect: {
      destination: `/user/login?next=${url}`,
      permanent: false
    }
  }

  try {
    const user = await db.select("first_name", "last_name", "email", "username", "permission", "member_id").from("members").where("email", email).first();
    return { props: { permission, user } };
  }
  catch (error) {
    console.error(error);
    return {
      redirect: {
        destination: "/error",
        permanent: false
      }
    }
  }
}