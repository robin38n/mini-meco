import React from "react";
import { cn } from "@/lib/utils";

export type MessageType = "success" | "error" | "info";

export interface Message {
  text: string;
  type: MessageType;
}

interface CourseMessageProps {
  message: Message;
}

const CourseMessage: React.FC<CourseMessageProps> = ({ message }) => {
  return (
    <div
      className={cn("text-sm", {
        "text-green-600": message.type === "success",
        "text-red-600": message.type === "error",
        "text-blue-600": message.type === "info",
      })}
    >
      {message.text}
    </div>
  );
};

export default CourseMessage;
