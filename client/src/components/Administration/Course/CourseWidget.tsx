import { useState } from "react";
import { Course, Project } from "./types";
import { CourseDialog } from "./components/CourseDialog";
import { CourseForm } from "./components/CourseForm";
import { CourseAction } from "./components/CourseAction";
import { useCourse } from "@/hooks/useCourse";
import { useDialog } from "@/hooks/useDialog";
import CourseSchedule from "./components/CourseSchedule";

interface CourseProps {
  label?: string;
  isEdit?: boolean;
  isProject?: Project | boolean | null;
  isSchedular?: boolean;
  course?: Course | null;
}

const CourseWidget: React.FC<CourseProps> = ({
  label = undefined,
  isEdit = false,
  isProject = null,
  isSchedular = false,
  course = null,
}) => {
  const {
    message,
    defaultCourse,
    defaultProject,
    createCourse,
    editCourse,
    createProject,
  } = useCourse();
  const initialData = isProject ? defaultProject : defaultCourse;
  const {
    dialogState,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    updateDialogData,
  } = useDialog<Course | Project>(initialData);

  const [isValid, setIsValid] = useState(false);

  const handleStateDialog = () => {
    if (isProject) {
      if (isEdit) {
        if (!isProject) {
          console.error("Edit mode requires a project");
          return;
        }
        if (dialogState.data) {
          openEditDialog(dialogState.data);
        }
      } else {
        openCreateDialog();
      }
    } else {
      if (isEdit) {
        if (!course) {
          console.error("Edit mode requires a course");
          return;
        }
        openEditDialog(course);
      } else {
        openCreateDialog();
      }
    }
  };

  const handleSubmit = async () => {
    if (!dialogState.data) return;

    try {
      if (isProject) {
        if (!course) {
          console.error("Parent course is required for projects");
          return;
        }

        const projectData = dialogState.data as Project;
        if (dialogState.mode === "create") {
          await createProject(projectData);
        } else if (dialogState.mode === "edit") {
          // await editProject(course.id, projectData.id, projectData);
        }
      } else {
        const courseData = dialogState.data as Course;
        if (dialogState.mode === "create") {
          await createCourse(courseData);
        } else if (dialogState.mode === "edit") {
          await editCourse(courseData);
        }
      }
      closeDialog();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  // @todo
  const [showSchedule, setShowSchedule] = useState(false);

  // @todo
  if (isSchedular && course) {
    return (
      <div>
        <CourseAction
          label="Schedule"
          isSchedular={true}
          onClick={() => setShowSchedule((prev) => !prev)}
          dataCy="schedule-course-trigger"
        />
        {showSchedule && (
          <CourseSchedule
            course={course}
            onClose={() => setShowSchedule(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <CourseDialog
        isOpen={dialogState.isOpen}
        title={
          isProject
            ? isEdit
              ? "Edit Project"
              : "Create Project"
            : isEdit
            ? "Edit Course"
            : "Create Course"
        }
        trigger={
          <CourseAction
            label={label}
            isEdit={isEdit}
            onClick={handleStateDialog}
            dataCy={`${isEdit ? "edit" : "add"}-course-trigger`}
          />
        }
        onClick={handleStateDialog}
        onClose={closeDialog}
        isValid={isValid}
        onSubmit={handleSubmit}
        message={message || ""}
      >
        <CourseForm
          type={isProject ? "project" : "course"}
          label={["Semester", "Name", "Students Can Create Project"]}
          data={dialogState.data || defaultCourse}
          onChange={updateDialogData}
          onValidate={setIsValid}
        />
      </CourseDialog>
    </div>
  );
};
export default CourseWidget;
