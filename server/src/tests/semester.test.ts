import { describe, it, expect } from "vitest";
import { Semester, SemesterType } from "../Models/Semester";

describe("Value Object creation:", () => {
  describe("Winter Semester Validation", () => {
    const expectedType = SemesterType.WINTER;
    const expectedYear = "2024/25";
    const expectedValue = "Winter 2024/25";

    it("should validate all winter semester inputs in one test", () => {
      const testCases = [
        "ws2425",
        "ws24/25",
        "ws24",
        "WS24",
        "Winter 24",
        "winter 2024",
        "WS2024",
        "ws 2024",
      ];

      const results = testCases.map((input) => {
        const semester = Semester.create(input);
        if (semester === null) {
          return {
            input,
            type: "Invalid",
            year: "Invalid",
            value: "Invalid",
          };
        }
        return {
          input,
          type: semester.getSemesterType(),
          year: semester.getAcademicYear(),
          value: semester.toString(),
        };
      });

      expect(results).toEqual(
        testCases.map((input) => ({
          input,
          type: expectedType,
          year: expectedYear,
          value: expectedValue,
        }))
      );
      // console.log(JSON.stringify(results, null, 2))
    });
  });

  describe("Summer Semester Validation", () => {
    const expectedType = SemesterType.SUMMER;
    const expectedYear = "2025";
    const expectedValue = "Summer 2025";

    it("should validate all summer semester inputs", () => {
      const testCases = [
        "SS25",
        "ss25",
        "Summer 25",
        "summer 2025",
        "SS2025",
        "ss 2025",
      ];

      const results = testCases.map((input) => {
        const semester = Semester.create(input);
        if (semester === null) {
          return {
            input,
            type: "Invalid",
            year: "Invalid",
            value: "Invalid",
          };
        }
        return {
          input,
          type: semester.getSemesterType(),
          year: semester.getAcademicYear(),
          value: semester.toString(),
        };
      });

      expect(results).toEqual(
        testCases.map((input) => ({
          input,
          type: expectedType,
          year: expectedYear,
          value: expectedValue,
        }))
      );
      // console.log(JSON.stringify(results, null, 2))
    });
  });

  describe("Input Handling Validation", () => {
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
});

describe("Value Object instances:", () => {
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
