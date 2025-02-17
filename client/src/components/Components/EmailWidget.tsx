import React, {useState} from "react";
import { Email } from '../../../../server/src/email';
import {IllegalArgumentException} from "../../../../server/src/Exceptions/IllegalArgumentException.ts";

interface EmailWidgetProps {
    onEmailChange: (email: string) => void; // Callback-Prop
    action: "Registration" | "Login"; // current action
}

const EmailWidget: React.FC<EmailWidgetProps> = ({ onEmailChange, action }) => {
    // create values to store the email inputs
    const [values, setValues] = useState({email: ''});
    // create empty error object to track validation errors
    const [errors, setErrors] = useState({});


    const validateEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        // Get email input directly from the ChangeEvent
        const currentEmailValue = e.target.value;
        // Set state to current value of email input
        setValues({ email: currentEmailValue });
        // Callback to parent-component-handler
        onEmailChange(currentEmailValue);

        const errors = {emailErrors: ''};

        if(!isEmail(values.email)){
            errors.emailErrors = 'Email is not valid';
        }
    }

    return (
        <>
            <input
                className="inputBox"
                type="email"
                placeholder="Please enter your email address"
                value={values.email}
                onChange={validateEmailInput} />
            <br />
            {Object.entries(errors).map(([key, error]) => (
                <span key={`${key}: ${String(error)}`}
                      style={{
                          fontWeight: 'bold',
                          color: 'red'
                      }}>
                    {String(error)}
                    </span>
            ))}
        </>
    )
}

export default EmailWidget;
