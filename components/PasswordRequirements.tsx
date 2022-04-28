"use strict";

import { passwordRequirementsText } from "../messages/user";

export default function PasswordRequirements() {
    const lines = passwordRequirementsText.split("\n");
    const htmlText = lines.map( (text, index) => {
        return <p key={index}>{text}</p>
    });
    return htmlText;
}