import { Database } from "sqlite";
import { ObjectHandler } from "./ObjectHandler";
import { DatabaseSerializableFactory } from "./Serializer/DatabaseSerializableFactory";
import { Course } from "./Models/Course";
import { CourseProject } from "./Models/CourseProject";
import { DatabaseResultSetReader } from "./Serializer/DatabaseResultSetReader";
import { DatabaseWriter } from "./Serializer/DatabaseWriter";
import { MethodFailedException } from "./Exceptions/MethodFailedException";
import { Semester } from "./Models/Semester";
import { IllegalArgumentException } from "./Exceptions/IllegalArgumentException";

export class CourseManager {
  constructor(
    private db: Database,
    private oh: ObjectHandler = new ObjectHandler(),
    private factory: DatabaseSerializableFactory = new DatabaseSerializableFactory(
      db
    )
  ) {}

  /**
   * Create a new Course, set Name/Semester and write persistent.
   * This implementation handles a database schema where courseName is defined as UNIQUE.
   * @return new Course-Object.
   */
  public async createCourse(name: string, semester: string): Promise<Course> {
    let validSemester = Semester.create(semester);
    let course: Course | null = null;

    // @todo: idk what to do
    // const existingRow = await this.db.get(
    //   "SELECT * FROM courses WHERE courses.courseName = ? AND courses.semester = ?",
    //   [name, validSemester.toString()]
    // );
    try {
      const existingRow = await this.db.get(
        "SELECT * FROM courses WHERE courses.courseName = ?",
        [name]
      );
      console.log("existingRow", existingRow);

      if (existingRow) {
        course = await this.oh.getCourse(existingRow.id, this.db);
        if (!course) {
          throw new MethodFailedException(
            "Existing course could not be loaded."
          );
        }

        // If Semester is set and does not match semester
        if (
          course.getSemester() &&
          course.getSemester() !== validSemester.toString()
        ) {
          throw new IllegalArgumentException(
            `Course with name "${name}" already exists with semester "${course.getSemester()}". ` +
              `Cannot create another course with the same name for semester "${validSemester.toString()}".`
          );
        }

        course.setName(semester);
        console.log(
          "[createCourse] Updated existing course:",
          course.getId(),
          "/",
          course.getName(),
          "/",
          course.getSemester()
        );

        const writer = new DatabaseWriter(this.db);
        writer.writeRoot(course);

        return course;
      } else {
        // Create new Course-Entity
        course = (await this.factory.create("Course")) as Course;
        if (!course) {
          throw new MethodFailedException("Course creation failed.");
        }

        course.setName(name);
        course.setSemester(semester);
        console.log(
          "[createCourse] new CourseID/Name/Semester:",
          course.getId(),
          "/",
          course.getName(),
          "/",
          course.getSemester()
        );

        // Write Root-Object Course
        const writer = new DatabaseWriter(this.db);
        writer.writeRoot(course);
        console.log(
          "[createCourse] writerRoot with CourseID/Name:",
          course.getId(),
          "/",
          course.getName()
        );

        return course;
      }
    } catch (error) {
      throw error;
    }
  }

  public async getAllCourse(): Promise<Course[]> {
    const courseRows = await this.db.all("SELECT * FROM courses");
    let allCourse: Course[] = [];
    for (const row of courseRows) {
      const course = await this.oh.getCourse(row.id, this.db);
      if (course !== null) {
        allCourse.push(course);
      }
    }
    return allCourse;
  }

  public async getProjectsForCourse(course: Course): Promise<CourseProject[]> {
    const projectRows = await this.db.all(
      `
            SELECT *
            FROM projects
            WHERE courseId = ?
        `,
      course.getId()
    );
    let projects: CourseProject[] = [];
    for (const row of projectRows) {
      const project = await this.oh.getCourseProject(row.id, this.db);
      if (project !== null) {
        project.setCourse(course);
        projects.push(project);
      }
    }

    return projects;
  }
}
