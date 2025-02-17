import React, {useState} from "react";

interface EmailWidgetProps {
    onEmailChange: (email: string) => void; // Callback-Prop
    action: "Registration" | "Login"; // current action
}

const EmailWidget: React.FC<EmailWidgetProps> = ({ onEmailChange, action }) => {
    // create values to store the email inputs
    const [values, setValues] = useState({email: ''});
    // create empty error object to track validation errors
    const [errors, setErrors] = useState({});

    const ValidateEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        setEmail(e);
        const errors = {emailErrors: ''};

        if(!isEmail(values.email)){
            errors.emailErrors = 'Email is not valid';
        }

        //testing purposes
        console.log("Emails data:", values);
        console.log("Error data:", errors);

        setErrors(errors);

        //if (!Object.keys(errors).length) {
        //    alert(JSON.stringify(values, null, 2));
        //}
    }

    const setEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues((values) => ({...values, email: e.target.value}));
    }

    return (
        <>
            <input
                className="inputBox"
                type="email"
                placeholder="Please enter your email address"
                value={values.email}
                onChange={ValidateEmailInput} />
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
