import { Reader } from "../Serializer/Reader";
import { Serializable } from "../Serializer/Serializable";
import { Writer } from "../Serializer/Writer";
import { CourseProject } from "./CourseProject";
import { CourseSchedule } from "./CourseSchedule";
import { Semester } from "./Semester";

export class Course implements Serializable {
  protected id: number;
  protected courseName: string | null = null;
  protected semester: string | null = null;
  protected projects: CourseProject[] = []; // 1:N
  protected schedular: CourseSchedule | null = null; // 1:1
  constructor(id: number) {
    this.id = id;
  }

  async readFrom(reader: Reader): Promise<void> {
    this.id = reader.readNumber("id") as number;
    this.courseName = reader.readString("courseName");
    this.semester = reader.readString("semester");
    this.projects = (await reader.readObjects("courseId", "projects")) as CourseProject[];
  }

  writeTo(writer: Writer): void {
    writer.writeNumber("id", this.id);
    writer.writeString("courseName", this.courseName);
    if (this.semester) {
      writer.writeString("semester", this.semester.toString());
    } else {
      writer.writeString("semester", null);
    }
  }

  // Getters
  public getId(): number {
    return this.id;
  }

  public getName(): string | null {
    return this.courseName;
  }

  public getSemester(): string | null {
    return this.semester ? this.semester.toString() : null;
  }

  public getProjects(): CourseProject[] {
    // Return a copy of the array to prevent direct modification
    return [...this.projects];
  }

  // Setters
  public setName(name: string | null) {
    this.courseName = name;
  }

  public setSemester(semester: string | null) {
    if (semester) {
      let s = Semester.create(semester);
      this.semester = new String(s).toString(); // === s.toString()
    } else {
      this.semester = null;
    }
  }

  // Composition methods for CourseProject (1:N)
  public addProject(project: CourseProject): void {
    this.projects.push(project);
  }
  
  public removeProject(project: CourseProject | number): boolean {
    if (typeof project === "number") {
      const index = this.projects.findIndex(p => p.getId() === project);
      if (index !== -1) {
        this.projects.splice(index, 1);
        return true;
      }
      return false;
    } else {
      const index = this.projects.indexOf(project);
      if (index !== -1) {
        this.projects.splice(index, 1);
        return true;
      }
      return false;
    }
  }

  public findProjectById(projectId: number): CourseProject | undefined {
    return this.projects.find(project => project.getId() === projectId);
  }
}
