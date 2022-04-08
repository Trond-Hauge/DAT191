import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../db";
import { hash } from "bcrypt";
import { INTERNAL_SERVER_ERROR, METHOD_NOT_ALLOWED } from "../../../messages/apiResponse";
import { passwordSaltRounds } from "../../../app.config";
import { validatePassword } from "../../../utils/user";

export default async function registerUser(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const pass = req.body.password;
        const first_name = req.body.firstName;
        const last_name = req.body.lastName;
        const email  = req.body.email;
        const username = req.body.username;
        const validPass = validatePassword(pass);

        if (validPass) {
            const member = await db("members").where("email", email).first();
            if (member) {
                res.status(207).json({ message: "This user already exists." });
            }
            else {
                hash(pass, passwordSaltRounds, async (err, hash) => {
                    if (err) {
                        res.status(500).json(INTERNAL_SERVER_ERROR);
                        console.error(err);
                        return;
                    }
                    try {
                        await db("members").insert({
                            first_name,
                            last_name,
                            email,
                            username,
                            password: hash,
                            permission: "unverified"
                        });
                        res.status(200).json({ message: "User has been created." });
                    }
                    catch (error) {
                        console.error(error);
                        res.status(500).json(INTERNAL_SERVER_ERROR);
                    }
                })
            }
        }
        else {
            res.status(207).json({ message: "Password does  not match requiremetns." });
        }
    } else {
        res.status(405).json(METHOD_NOT_ALLOWED);
    }
}

// For the login part:
// Continue tutorial at 32:00 : https://www.youtube.com/watch?v=j4Tob0KDbuQ&ab_channel=BrunoAntunes