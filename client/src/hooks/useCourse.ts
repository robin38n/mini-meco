import { useState } from "react";
import { Course, Project } from "@/components/Administration/Course/types";
import courseApi from "@/components/Administration/Course/api";

const defaultCourse: Course = {
  id: 0,
  semester: "",
  courseName: "",
  projects: [],
  studentsCanCreateProject: false,
};

const defaultProject: Project = {
  id: 0,
  projectName: "",
  courseId: 0,
  studentsCanJoinProject: false,
};

export const useCourse = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [message, setMessage] = useState<string | null>();

  const getCourses = async (): Promise<Course[]> => {
    try {
      const data: Course[] = await courseApi.getCourses();
      setCourses(data);
      return data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  };

  const createCourse = async (course: Course) => {
    setMessage(null);

    const body = {
      semester: course.semester,
      courseName: course.courseName,
      studentsCanCreateProject: course.studentsCanCreateProject,
    };

    try {
      await courseApi.createCourse(body);
      setMessage(`Course: "${course.courseName}" created successfully`);
      await getCourses(); // Refresh the course list
    } catch (error) {
      setMessage(
        `Fail to create Course: "${course.courseName}" for Semester: "${course.semester}"`
      );
    }
  };

  const editCourse = async (course: Course) => {
    if (!course) return;
    setMessage(null);

    const body = {
      semester: course.semester,
      courseName: course.courseName,
      studentsCanCreateProject: course.studentsCanCreateProject,
    };

    try {
      await courseApi.editCourse(body);
      setMessage(`Course: ${course.courseName} editing successfully`);
      await getCourses(); // Refresh the course list
    } catch (error) {
      setMessage(`Course: ${course.courseName} Error: ${error}`);
    }
  };

  const deleteCourse = (course: Course) => {};

  // @todo: 
  const getCourseProjects = async (name: string) => {
    try {
      await courseApi.getCourseProjects(name);
    } catch (error) {
      throw error;
    }
  };

  const createProject = async (project: Project) => {
    setMessage(null);

    const body = {
      projectName: project.projectName,
      courseId: project.courseId,
      studentsCanJoinProject: project.studentsCanJoinProject
    };

    try {
      await courseApi.createProject(body);
      setMessage(`Course: "${project.projectName}" created successfully`);
    } catch (error) {
      setMessage(
        `Fail to create Project: "${project.projectName}" for courseId: "${project.courseId}"`
      );
    }
  }

  return {
    message,
    defaultCourse,
    defaultProject,
    courses,
    setCourses,
    getCourses,
    createCourse,
    editCourse,
    getCourseProjects,
    createProject
  };
};
