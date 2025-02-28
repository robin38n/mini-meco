import { useEffect } from "react";
import type { Course, Project } from "@/components/Administration/Course/types";
import {
  useForm,
  createCourseValidation,
  createProjectValidation,
} from "@/hooks/useForm";

interface FormFieldProps {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  error,
}) => (
  <div className="flex-col items-center justify-between">
    <h4>{label}: </h4>
    <input
      className={`w-full h-10 text-black bg-gray-50 border ${
        error ? "border-red-500 ring-1 ring-red-500" : ""
      }`}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {error && <div className="text-red-500 text-sm">{error}</div>}
  </div>
);

interface CheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  checked,
  onChange,
}) => (
  <div className="flex items-center space-x-3 text-black">
    <input
      className="mr-4 h-6 w-6 cursor-pointer appearance-none rounded-md border-2 border-gray-400 bg-white 
            checked:bg-blue-600 checked:ring-2 checked:ring-white transition-all"
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    />
    <label className="text-md">{label}</label>
  </div>
);

interface DateInputProps {
  label?: string;
  value: string;
  onChange: (date: Date) => void;
  className?: string;
}

export const DateInput: React.FC<DateInputProps> = ({
  label,
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      {label && <label className="mr-2 text-gray-500">{label}</label>}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(new Date(e.target.value))}
        className="px-3 py-2 bg-white text-gray-500 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        style={{ colorScheme: "auto" }}
      />
    </div>
  );
};

interface CourseFormProps {
  type: "course" | "project";
  label: string[];
  data: Course | Project;
  onChange: (data: Course | Project) => void;
  onValidate: (isValid: boolean) => void;
  children?: React.ReactNode;
}

export const CourseForm: React.FC<CourseFormProps> = ({
  type,
  label,
  data,
  onChange,
  onValidate,
  children,
}) => {
  const isCourse = type === "course";

  // Use the correct type & validation schema based on form type<T>
  const {
    data: formData,
    errors,
    isValid,
    handleChanges,
  } = isCourse
    ? useForm<Course>(data as Course, createCourseValidation())
    : useForm<Project>(data as Project, createProjectValidation());

  // Notify parent component of changes
  useEffect(() => {
    onChange(formData);
    onValidate(isValid);
  }, [formData, isValid]);

  // Narrow the handleChanges using type assertions
  const courseHandleChanges = handleChanges as (
    key: keyof Course,
    value: string | boolean
  ) => void;
  const projectHandleChanges = handleChanges as (
    key: keyof Project,
    value: string
  ) => void;

  return (
    <div className="space-y-4">
      {isCourse ? (
        <>
          <FormField
            label={label[0]}
            value={(formData as Course).semester}
            error={(errors as Record<keyof Course, string>).semester}
            onChange={(value) => courseHandleChanges("semester", value)}
          />
          <FormField
            label={label[1]}
            value={(formData as Course).courseName}
            error={(errors as Record<keyof Course, string>).courseName}
            onChange={(value) => courseHandleChanges("courseName", value)}
          />
          <CheckboxField
            label={label[2]}
            checked={(formData as Course).studentsCanCreateProject || false}
            onChange={(value) =>
              courseHandleChanges("studentsCanCreateProject", value)
            }
          />
        </>
      ) : (
        <FormField
          label="Project Name"
          value={(formData as Project).projectName || ""}
          error={(errors as Record<keyof Project, string>).projectName}
          onChange={(value) => projectHandleChanges("projectName", value)}
        />
      )}
      {children}
    </div>
  );
};
