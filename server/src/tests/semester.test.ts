import { describe, it, expect } from "vitest";
import { Semester, SemesterType } from "../Models/Semester";

describe("Semester Object creation:", () => {
  const winterType = SemesterType.WINTER;
  const winterYear = "2024/25";
  const winterValue = "Winter 2024/25";

  const summerType = SemesterType.SUMMER;
  const summerYear = "2025";
  const summerValue = "Summer 2025";

  const winterCases = [
    "ws2425",
    "ws24/25",
    "ws24",
    "WS24",
    "Winter 24",
    "winter 2024",
    "WS2024",
    "ws 2024",
  ];

  it("should create correct winter semester", () => {
    winterCases.forEach((input) => {
      const semester = Semester.create(input);
      expect(semester.getSemesterType()).toEqual(winterType);
      expect(semester.getAcademicYear()).toEqual(winterYear);
      expect(semester.toString()).toEqual(winterValue);
    });
  });

  const summerCases = [
    "SS25",
    "ss25",
    "Summer 25",
    "summer 2025",
    "SS2025",
    "ss 2025",
  ];

  it("should create correct summer semester", () => {
    summerCases.forEach((input) => {
      const semester = Semester.create(input);
      expect(semester.getSemesterType()).toEqual(summerType);
      expect(semester.getAcademicYear()).toEqual(summerYear);
      expect(semester.toString()).toEqual(summerValue);
    });
  });

  it("should throw for all invalid inputs", () => {
    const invalidInputs = [
      "",
      " ",
      "invalid",
      "202",
      "WW24",
      "Summer",
      "2024/25",
      "s25ws",
      "2024 ws",
      "wintersemester2024",
      "wintersemester 2024",
      "winter semester2024",
      "sssemester25",
      "sssemester 25",
      "ss semester25",
    ];

    invalidInputs.forEach((input) => {
      expect(() => Semester.create(input)).toThrow();
    });
    console.log(`Tested invalid inputs: ${invalidInputs.join(", ")}`);
  });
});

describe("Semester Object instances:", () => {
  it("should create identical instances for the same input", () => {
    const s1 = Semester.create("WS2425");
    const s2 = Semester.create("winter24");

    expect(s1).toEqual(s2); // Same value
    expect(s1 === s2).toBe(false); // Different instances
  });

  it("should treat different semester inputs as separate instances", () => {
    const ws = Semester.create("WS24");
    const ss = Semester.create("SS25");

    expect(ws).not.toBeNull();
    expect(ws!.getSemesterType()).toBe(SemesterType.WINTER);
    expect(ss).not.toBeNull();
    expect(ss!.getSemesterType()).toBe(SemesterType.SUMMER);
    expect(ws).not.toEqual(ss);
  });
});
