import { Application, Request, Response } from "express";
import { Database } from "sqlite";
import { CourseManager } from "./CourseManager";
import { Course } from "./Models/Course";
import { Exception } from "./Exceptions/Exception";

/**
 * Controller for handling course-related HTTP requests.
 * Connects API routes to the CourseManager, which interacts with the database.
 * Each method processing HTTP requests and returning JSON responses.
 */
export class CourseController {
  private cm: CourseManager;

  constructor(private db: Database) {
    this.cm = new CourseManager(db);
  }

  /**
   * Initializes API routes for course management.
   * @param app Express application instance
   */
  init(app: Application): void {
    app.post("/course", this.createCourse.bind(this));
    app.get("/course", this.getAllCourse.bind(this));
    app.post("/courseProject", this.addProject.bind(this));
    app.get("/course/courseProjects", this.getCourseProjects.bind(this));
  }

  async getAllCourse(req: Request, res: Response): Promise<void> {
    try {
      let courses: Course[] = [];
      courses = await this.cm.getAllCourse();

      res.status(200).json({
        success: true,
        data: courses.map((course) => ({
          id: course.getId(),
          courseName: course.getName(),
          semester: course.getSemester(),
        })),
      });
    } catch (error) {
      this.handleError(res, error as Exception);
    }
  }

  async createCourse(req: Request, res: Response): Promise<void> {
    try {
      const { courseName, semester } = req.body;
      if (
        !courseName ||
        !semester ||
        typeof (courseName || semester) !== "string"
      ) {
        res.status(400).json({
          success: false,
          message: "Course name and semester is required and must be a string",
        });
        return;
      }

      const course = await this.cm.createCourse(courseName, semester);

      res.status(201).json({
        success: true,
        message: "Course created successfully",
        data: course,
      });
    } catch (error) {
      this.handleError(res, error as Exception);
    }
  }

  async readCourse(req: Request, res: Response): Promise<void> {
    try {
      const id = req.body.id;
      const courseId = parseInt(id);

      if (isNaN(courseId)) {
        res
          .status(400)
          .json({ success: false, message: "Course ID must be an integer" });
        return;
      }

      const course = await this.cm.readCourse(courseId);

      if (!course) {
        res.status(404).json({ success: false, message: "Course not found" });
        return;
      }

      res.status(200).json({
        success: true,
        data: course,
      });
    } catch (error) {
      this.handleError(res, error as Exception);
    }
  }

  // This method is not implemented yet
  async updateCourse(req: Request, res: Response): Promise<void> {
    try {
      res.status(501).json({
        success: false,
        message: "Course delete not implemented yet",
      });
    } catch (error) {
      this.handleError(res, error as Exception);
    }
  }

  // This method is not implemented yet
  async deleteCourse(req: Request, res: Response): Promise<void> {
    try {
      res.status(501).json({
        success: false,
        message: "Course update not implemented yet",
      });
    } catch (error) {
      this.handleError(res, error as Exception);
    }
  }

  // This method is not implemented yet
  async getUserCourses(req: Request, res: Response): Promise<void> {
    try {
      res.status(501).json({
        success: false,
        message: "User courses not implemented yet",
      });
    } catch (error) {
      this.handleError(res, error as Exception);
    }
  }

  // Composition methods for CourseProject 1:N
  async addProject(req: Request, res: Response): Promise<void> {
    try {
      const { courseId, projectName } = req.body;
      const id = parseInt(courseId);

      const proj = await this.cm.addProjectToCourse(id, projectName);

      // console.log("[CONTROLLER] addProject: ", proj.getName());
      res.status(201).json({
        success: true,
        message: "Project added successfully",
        data: {
          id: proj.getId(),
          projectName: proj.getName(),
          courseId: proj.getCourse()?.getId(),
        },
      });
    } catch (error) {
      this.handleError(res, error as Exception);
    }
  }

  async getCourseProjects(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.query;
      const id = parseInt(courseId as string);

      const course = await this.cm.readCourse(id);
      if (!course) {
        res.status(404).json({ success: false, message: "Course not found" });
        return;
      }

      const projects = await this.cm.getProjectsForCourse(course);
      if (!projects) {
        res
          .status(404)
          .json({ success: false, message: "Course projects not found" });
        return;
      }

      res.status(200).json({
        success: true,
        data: projects.map((proj) => ({
          id: proj.getId(),
          projectName: proj.getName(),
          courseId: proj.getCourse()?.getId(),
        })),
      });
    } catch (error) {
      this.handleError(res, error as Exception);
    }
  }

  // Error handling for responses
  private handleError(res: Response, error: Exception): void {
    console.error("Controller error:", error);

    // Check for specific error types and return responses
    if (error.name === "IllegalArgumentException") {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    } else if (error.name === "MethodFailedException") {
      res.status(500).json({
        success: false,
        message: "An error occurred while processing your request",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
