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
    const [successMessage, setSuccessMessage] = useState<string | null>(null);


    const validateEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        // Get email input directly from the ChangeEvent
        const currentEmailValue = e.target.value;
        // Set state to current value of email input
        setValues({ email: currentEmailValue });
        // Callback to parent-component-handler
        onEmailChange(currentEmailValue);

        const errors = {emailErrors: ''};
        // Reset success message
        setSuccessMessage(null);

        // Using EmailAddress value type to check the validity of the user input
        try {
            new Email(currentEmailValue);
            setErrors({});
            // Give different feedback based on current action
            if (action === "Registration") {
                setSuccessMessage("E-Mail address is valid for registration!");
            } else if (action === "Login") {
                setSuccessMessage("E-Mail address valid for login!");
            }
        }
        catch (exception)
        {
            if(exception instanceof IllegalArgumentException)
            {
                errors.emailErrors = exception.message;
                setErrors(errors);
            }
        }
    }

    // Copy&pasted EmailValidation from ../server/src/email
    function isValidEmail (email: string): boolean {
        // Valid email string format: must not contain '@', followed by '@', must include a '.',
        // and end with a string without '@'
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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
            {/* Show negative feedback */}
            {Object.entries(errors).map(([key, error]) => (
                <span key={`${key}: ${String(error)}`}
                      style={{
                          fontWeight: 'bold',
                          color: 'red'
                      }}>
                    {String(error)}
                    </span>
            ))}
            {/* Show positive feedback */}
            {successMessage && (
                <div
                    style={{
                        fontWeight: "bold",
                        color: "green",
                    }}
                >
                    {successMessage}
                </div>
            )}
        </>
    )
}

export default EmailWidget;
