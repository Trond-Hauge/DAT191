"use strict";

import LoginForm from "../../components/LoginForm";
import { useRouter } from "next/router";

export default function Login() {
  const { next } = useRouter().query;
  const redirect = next ? next : "/";
  
  return (
    <>
      <main>
        <div className="login-form-container">
          <LoginForm redirectPath={redirect}/>
        </div>
      </main>
    </>
  );
}