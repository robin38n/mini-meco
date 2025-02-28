import { CourseProject } from "@/components/Projects/CourseProject";
import { Course, Project } from "./types";

class ApiClient {
  private static instnace: ApiClient;
  private BASE_API_URL: string = "http://localhost:3000/";

  private constructor() {}

  public static getInstance(): ApiClient {
    if (!ApiClient.instnace) {
      ApiClient.instnace = new ApiClient();
    }
    return ApiClient.instnace;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: Record<string, number | string | boolean>
  ): Promise<T> {
    try {
      const reponse = await fetch(this.BASE_API_URL + endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!reponse.ok) {
        const errorData = await reponse.json().catch(() => ({}));
        throw new Error(
          `HTTP Error: ${reponse.status} ${JSON.stringify(errorData)}`
        );
      }

      return (await reponse.json()) as Promise<T>;
    } catch (error) {
      console.error(`API request failed: ${method} ${endpoint}`, error);
      // @todo: ServiceFailuarException?
      // Application error: a server-side exception has occurred (see the server logs for more information).
      throw error; // Re-throw to allow caller to handle
    }
  }

  public async get<T>(endpoint: string): Promise<T> {
    return this.request<T>("GET", endpoint);
  }

  public async post<T>(
    endpoint: string,
    body: Record<string, number | string | boolean>
  ): Promise<T> {
    return this.request<T>("POST", endpoint, body);
  }

  public async put<T>(
    endpoint: string,
    body: Record<string, string | boolean>
  ): Promise<T> {
    return this.request<T>("PUT", endpoint, body);
  }

  public async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>("DELETE", endpoint);
  }
}

const courseApi = {
  getCourses: (): Promise<Course[]> => {
    return ApiClient.getInstance().get<Course[]>("course");
  },

  getCourseProjects: (courseName: string): Promise<Response> => {
    return ApiClient.getInstance().get(`course/courseProjects=${courseName}`);
  },

  createCourse: (body: {
    semester: string;
    courseName: string;
    studentsCanCreateProject: boolean;
  }): Promise<Response> => {
    console.log("[courseAPI] create: ", body);
    return ApiClient.getInstance().post<Response>("course", body);
  },

  editCourse: (body: {
    semester: string;
    courseName: string;
    studentsCanCreateProject: boolean;
  }): Promise<Response> => {
    return ApiClient.getInstance().post<Response>("course", body);
  },

  createProject: (body: {
    projectName: string;
    courseId: number;
    studentsCanJoinProject: boolean;
  }): Promise<Response> => {
    return ApiClient.getInstance().post<Response>("courseProject", body);
  },
};
export default courseApi;
