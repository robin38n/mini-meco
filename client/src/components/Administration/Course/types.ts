export interface Course {
  id: number;
  semester: string;
  courseName: string;
  projects: Project[];
  studentsCanCreateProject: boolean;
  [key: string]: number | string | boolean | Project[];
}

export interface Project {
  id: number;
  projectName: string;
  courseId: number;
  studentsCanJoinProject: boolean;
}
