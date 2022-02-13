"use strict"

import React, {useState} from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Header } from "../components/header";

const Register = () => {
     const [firstName, setFirstName] = useState('');
     const [lastName, setLastName] = useState('');
     const [email, setEmail] = useState('');
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');
     const router = useRouter();

     const submit = async (e) => {
        e.preventDefault();

        await fetch('http://localhost:3000/pages/api/user/register-user', {
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

        await router.push('/user/login');
    }
    return (
        <>
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
             
                <button className="button" type="submit">Submit</button>
            
            </form>
            </div>
            </main>
            </>
    );
};

export default Register;