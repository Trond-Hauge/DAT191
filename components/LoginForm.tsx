"use strict";

import React from "react";
import Link from "next/link";
import { useRef, useState } from "react";

//export default class LoginForm extends React.Component {
export default function LoginForm() {
  const emailRef = useRef < HTMLInputElement > (null);
  const passRef = useRef < HTMLInputElement > (null);
  const [message, setMessage] = useState < any > (null);

  
  const state = {
    email: "",
    password: "",
  };

  const handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  async function handleForm() {
    const respt = await fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      headers: { "Conent-type": "application/json" },
      body: JSON.stringify({
        email: emailRef.current?.value,
        password: passRef.current?.value,
      }),
    });

    const json = await respt.json();
    setMessage(json);

    console.log(emailRef.current?.value, passRef.current?.value);
  }

  //<form className="sign-in-form" onSubmit={this.handleSubmit}>

  // before the refs: onChange={this.handleChange}
  return (
    <form className="sign-in-form">
      <div>
        <input
          type="email"
          name="email"
          placeholder="Your email address"
          ref={emailRef}
        />
      </div>
      <div>
        <input
          type="password"
          name="password"
          placeholder="Your password"
          ref={passRef}
        />
      </div>
      <button className="submit-button" type="submit" onClick={handleForm}>
        Submit
      </button>
      <hr />
      <Link href="/register">
        <a>Create Account</a>
      </Link>
    </form>
  );
}
