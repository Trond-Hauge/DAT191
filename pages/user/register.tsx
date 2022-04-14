"use strict"

import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import Header from "../../components/header";
import { server } from "../../next.config";
import { validatePassword } from "../../utils/multi/user";
import { getMemberClaims } from "../../utils/server/user";

export default function Register({ permission }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const pRef = useRef<HTMLParagraphElement>(null);
    const router = useRouter();

     const submit = async (e) => {
        e.preventDefault();

        const valid = validatePassword(password);
        if (!valid) {
            pRef.current.innerText = "Password does not match requirements.";
            return;
        }

        const res = await fetch(`${server}/api/user/registerUser`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                username,
                password
            })
        });

        const { error, message } = await res.json();

        if (error) {
            router.push("/error");
        }
        else if (res.status === 207) {
            pRef.current.innerText = message;
        }
        else {
            router.push('/user/login');
        }
    }
    return (
        <>
        {Header(permission)}
        <main>
            <div className="sign-in-form">        
           <form onSubmit={submit}>
                <h1>Create Account</h1>
            <div>
                <input className="sign-in-form" placeholder="Enter first name" required
                       onChange={e => setFirstName(e.target.value)}
                />
            </div>
            <div>
                <input className="sign-in-form" placeholder="Enter last name" required
                       onChange={e => setLastName(e.target.value)}
                />
            </div>
            <div>
                <input type="email" className="sign-in-form" placeholder="Enter email" required
                       onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div>
                <input className="sign-in-form" placeholder="Create a username" required
                       onChange={e => setUsername(e.target.value)}
                />
            </div>
            <div>
                <input type="password" className="sign-in-form" placeholder="Create a password" required
                       onChange={e => setPassword(e.target.value)}
                />
            </div>
            <div>
                <button className="button" type="submit">Submit</button>
                <p ref={pRef}></p>
            </div>
            </form>
            </div>
        </main>
        </>
    );
};

export async function getServerSideProps(ctx) {
    const cookie = ctx.req?.cookies.auth;
    const { permission } = getMemberClaims(cookie);
    return { props: { permission } };
}