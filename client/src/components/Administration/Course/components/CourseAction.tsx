import React from "react";
import Add from "@/assets/Add.png";
import Edit from "@/assets/Edit.png";

interface CourseActionProps {
  label?: string;
  isEdit?: boolean;
  isSchedular?: boolean;
  onClick: () => void;
  className?: string;
  dataCy?: string;
}

/**
 * CourseAction component
 * It renders either an "Add" or "Edit" Action
 * with appropriate styling and Cypress test attributes.
 */
export const CourseAction: React.FC<CourseActionProps> = ({
  label,
  isEdit = false,
  onClick,
  className = "",
  dataCy,
  ...rest
}) => {
  const imgSrc = isEdit ? Edit : Add;
  const imgAlt = isEdit ? "Edit Course" : "Add Course";

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 ${className}`}
      data-cy={dataCy}
      {...rest}
    >
      {label ? (
        <span className="uppercase">{label}</span>
      ) : (
        <img className="w-6 h-6" src={imgSrc} alt={imgAlt} />
      )}
    </div>
  );
};
