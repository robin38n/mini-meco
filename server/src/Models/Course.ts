import { Reader } from "../Serializer/Reader";
import { Serializable } from "../Serializer/Serializable";
import { Writer } from "../Serializer/Writer";
import { CourseProject } from "./CourseProject";
import { CourseSchedule } from "./CourseSchedule";
import { Semester } from "./Semester";

export class Course implements Serializable {
  protected id: number;
  protected name: string | null = null;
  protected semester: string | null = null;
  protected projects: CourseProject[] = []; // 1:N
  protected schedular: CourseSchedule | null = null; // 1:1
  constructor(id: number) {
    this.id = id;
  }

  readFrom(reader: Reader): void {
    this.id = reader.readNumber("id") as number;
    this.name = reader.readString("courseName");
    this.semester = reader.readString("semester");
  }

  writeTo(writer: Writer): void {
    writer.writeNumber("id", this.id);
    writer.writeString("courseName", this.name);
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
    return this.name;
  }

  public getSemester(): string | null {
    return this.semester ? this.semester.toString() : null;
  }

  // Setters
  public setName(name: string | null) {
    this.name = name;
  }

  public setSemester(semester: string | null) {
    if (semester) {
      let s = Semester.create(semester);
      this.semester = new String(s).toString(); // === s.toString()
    } else {
      this.semester = null;
    }
  }
}
