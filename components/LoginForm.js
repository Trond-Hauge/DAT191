"use strict";

import { NextApiRequest, NextApiResponse } from "next";
import React from "react";
import Link from "next/link";

export default class LoginForm extends React.Component {
  state = {
    email: "",
    password: "",
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
  };

  render() {
    return (
      <form
        className="sign-in-form"
        onSubmit={this.handleSubmit}>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Your email address"
            onChange={this.handleChange}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Your password"
            onChange={this.handleChange}
          />
        </div>
        <button
            className="submit-button"
            type="submit">Submit</button>
        <hr />
        <Link href="/register">
              <a>Create Account</a>
            </Link>
      </form>
    );
  }
}
