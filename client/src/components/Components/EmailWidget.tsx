import React, {useState} from "react";

const isEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(email);

const EmailWidget: React.FC = () =>{
    // create state variables for state managing of the email input
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
