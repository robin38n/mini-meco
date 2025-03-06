import React from "react";

export type MessageType = "success" | "error" | "info";

export interface Message {
  text: string;
  type: MessageType;
}

interface CourseMessageProps {
  message: Message;
}

const CourseMessage: React.FC<CourseMessageProps> = ({ message }) => {
  // CSS class based on the message type.
  const messageClass = {
    success: "text-green-600",
    error: "text-red-600",
    info: "text-blue-600",
  }[message.type];

  return <div className={`text-sm ${messageClass}`}>{message.text}</div>;
};

export default CourseMessage;
