"use strict"

import { useRouter } from "next/router";
import Header from "../../components/header";
import { server } from "../../next.config";
import PasswordRequirements from "../../components/PasswordRequirements";
import { validateEmail, validateFirstName, validateLastName, validatePassword, validateUsername } from "../../utils/multi/validation";
import { getMemberClaims } from "../../utils/server/user";

export default function Register({ permission }) {
    const router = useRouter();

    // Function that handles submit of registration form. Validates input before sending request to user/account API route.
    // Upon error the user is redirected to error page. Upon successful registration user is redirected to login page.
    // If the response indicates that the user account was not registered, user is alerted with feedback message.
    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const form = Object.fromEntries(formData.entries());

        const valid = validatePassword(form.password)
            && validateFirstName(form.firstName)
            && validateLastName(form.lastName)
            && validateUsername(form.username)
            && validateEmail(form.email);

        if (!valid) {
            alert("One or more of the details entered do not match requirements.");
            return;
        }

        const res = await fetch(`${server}/api/user/account`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                username: form.username,
                password: form.password
            })
        });

        const { error, message } = await res.json();

        if (error) {
            router.push("/error");
        }
        else if (res.status === 207) {
            alert(message);
        }
        else {
            router.push('/user/login');
        }
    }
    return (
        <>
        {Header(permission)}
        <main>
            <div className="view-space">
                <div className="view-container">
                    <h1 className="view-header">Create Account</h1>       
                    <form onSubmit={handleSubmit} className="register-form">
                        <div>
                            <input
                                name="firstName"
                                type="text" 
                                placeholder="Enter first name" 
                                required
                            />
                        </div>
                        <div>
                            <input
                                name="lastName"
                                type="text" 
                                placeholder="Enter last name" 
                                required
                            />
                        </div>
                        <div>
                            <input
                                name="email"
                                type="email" 
                                placeholder="Enter email" 
                                required
                            />
                        </div>
                        <div>
                            <input 
                                name="username"
                                type="text"
                                placeholder="Create a username" 
                                required
                            />
                        </div>
                        <div>
                            <input
                                name="password" 
                                type="password" 
                                placeholder="Create a password" 
                                required
                            />
                        </div>
                        <div className="narrow-container">
                            <h3>Password Requirements:</h3>
                            {PasswordRequirements()}
                        </div>
                        <button className="btn-submit" type="submit">Submit</button>
                    </form>
                </div>
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