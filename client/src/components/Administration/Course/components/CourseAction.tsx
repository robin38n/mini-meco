import React from "react";
import Add from "@/assets/Add.png";
import Edit from "@/assets/Edit.png";

interface CourseActionProps {
  label?: string;
  type?: "course" | "project" | "schedule";
  action: "add" | "edit" | "delete" | "schedule";
  onClick: () => void;
  className?: string;
  dataCy?: string;
}

/**
 * Presentational component that renders action buttons for courses and projects.
 * Supports add, edit, delete, and schedule actions with icons or labels.
 * Uses dynamic styling based on action type for better UI consistency.
 */
export const CourseAction: React.FC<CourseActionProps> = ({
  label,
  type = "course",
  action,
  onClick,
  className = "",
  dataCy,
  ...rest
}) => {
  const getIcon = () => {
    switch (action) {
      case "edit":
        return <img className="size-6" src={Edit} alt="Edit" />;
      case "delete":
        return;
      case "add":
        return <img className="size-6 " src={Add} alt="Add" />;
      default:
        return null;
    }
  };
  
  // Button styling based on action type
  const getButtonClass = () => {
    const baseClass = "flex size-full items-center gap-2 cursor-pointer text-white";

    if (type === "schedule") {
      return `${baseClass} btn btn-schedule bg-blue-600 text-white px-3 py-1 rounded ${className}`;
    }
    
    return `${baseClass} ${className}`;
  };

  return (
    <div
      onClick={onClick}
      className={getButtonClass()}
      data-cy={dataCy || `${action}-${type}-trigger`}
      role="button"
      tabIndex={0}
      {...rest}
    >
      {label ? <span className="uppercase text-xs">{label}</span> : getIcon()}
    </div>
  );
};