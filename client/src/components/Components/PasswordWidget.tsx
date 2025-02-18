import React from "react";
import { Password, PasswordStrength } from "server/src/Models/Password.ts";

// Helper function to convert password strength to a descriptive label and color
const getStrengthInfo = (strength: PasswordStrength) => {
  switch (strength) {
    case PasswordStrength.VeryWeak:
      return { label: "Very Weak", color: "#ff4d4f" };
    case PasswordStrength.Weak:
      return { label: "Weak", color: "#ff7a45" };
    case PasswordStrength.Medium:
      return { label: "Medium", color: "#faad14" };
    case PasswordStrength.Strong:
      return { label: "Strong", color: "#73d13d" };
    case PasswordStrength.VeryStrong:
      return { label: "Very Strong", color: "#52c41a" };
    default:
      return { label: "", color: "transparent" };
  }
};

interface PasswordWidgetProps {
  password: Password;
  onPasswordChange: (password: string) => void;
  action: string;
}

const PasswordWidget: React.FC<PasswordWidgetProps> = ({
  password,
  onPasswordChange,
  action,
}) => {
  const strength: PasswordStrength = password.getStrength();
  const { label, color } = getStrengthInfo(strength);

  return (
    <>
      <input
        className={"inputBox"}
        type="password"
        placeholder="Please enter your password"
        value={password.getValue()}
        onChange={(e) => onPasswordChange(e.target.value)}
      />
      {
        // If the user is registering, show a password strength
        action === "Registration" && password.getValue() != "" && (
          <div style={{ whiteSpace: "nowrap" }}>
            <span style={{ color: "black" }}>Password Strength: </span>
            <br></br>
            <strong style={{ color }}>{label}</strong>
          </div>
        )
      }
    </>
  );
};

export default PasswordWidget;
