import React from "react";

const containsLowerAndUpperCase = (value: string): boolean =>
  /(?=.*[a-z])(?=.*[A-Z])/.test(value);
const containsNumber = (value: string): boolean => /\d/.test(value);
const containsSpecialCharacter = (value: string): boolean =>
  /[!@#$%^&*(),.?":{}|<>]/.test(value);

const calculatePasswordStrength = (value: string): number => {
  if (value.length < 8) {
    return 1;
  }

  let strength = 1;
  if (containsLowerAndUpperCase(value)) {
    strength++;
  }
  if (containsNumber(value)) {
    strength++;
  }
  if (containsSpecialCharacter(value)) {
    strength++;
  }
  if (value.length >= 12) {
    strength++;
  }
  return strength;
};

const getStrengthInfo = (strength: number) => {
  switch (strength) {
    case 1:
      return { label: "Very Weak", color: "#ff4d4f" };
    case 2:
      return { label: "Weak", color: "#ff7a45" };
    case 3:
      return { label: "Medium", color: "#faad14" };
    case 4:
      return { label: "Strong", color: "#73d13d" };
    case 5:
      return { label: "Very Strong", color: "#52c41a" };
    default:
      return { label: "", color: "transparent" };
  }
};

interface PasswordWidgetProps {
  password: string;
  onPasswordChange: (password: string) => void;
  action: string;
}

const PasswordWidget: React.FC<PasswordWidgetProps> = ({
  password,
  onPasswordChange,
  action,
}) => {
  const strength = calculatePasswordStrength(password);
  const { label, color } = getStrengthInfo(strength);

  return (
    <>
      <input
        className="inputBox"
        type="password"
        placeholder="Please enter your password"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
      />
      {action === "Registration" && password !== "" && (
        <div style={{ whiteSpace: "nowrap" }}>
          <span style={{ color: "black" }}>Password Strength: </span>
          <br />
          <strong style={{ color }}>{label}</strong>
        </div>
      )}
    </>
  );
};

export default PasswordWidget;
