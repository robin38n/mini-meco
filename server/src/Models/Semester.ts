import { IllegalArgumentException } from "../Exceptions/IllegalArgumentException";
import { MethodFailedException } from "../Exceptions/MethodFailedException";

type AcademicYear = `${number}/${number}` | `${number}`;

export enum SemesterType {
  WINTER = "Winter",
  SUMMER = "Summer",
}

export class Semester {
  private constructor(
    private readonly type: SemesterType,
    private readonly year: AcademicYear
  ) {}

  // Create a Semester instance as value object
  static create(input: string): Semester {
    let { type, year } = Semester.parseString(input);
    if (!type || !year) throw new MethodFailedException("Semester cannot be instantiated.");
    return new Semester(type, year);
  }

  static read(input: string): Semester {
    let vObj = Semester.create(input);
    if (!vObj) throw new MethodFailedException("Semester cannot be instantiated.");
    return vObj;
  }

  public getSemesterType(): SemesterType {
    return this.type;
  }

  public getAcademicYear(): AcademicYear {
    return this.year;
  }

  public toString(): string {
    return `${this.type} ${this.year}`;
  }

  // Parse the input string to extract the semester type and year
  private static parseString(input: string): { type: SemesterType, year: AcademicYear } {
    if (input === undefined) {
      throw new IllegalArgumentException("Semester value cannot be undefined");
    }
    const cleanInput = input.trim().toLowerCase();
    const regex = /^(ws|winter|ss|summer)\s*(?:(\d{2}|\d{4})(?:\/(\d{2}))?)$/;
    const match = cleanInput.match(regex);

    if (!match || !match[2]) {
      throw new IllegalArgumentException(
        `Invalid input: ${input} as string.`
      );
    }

    let validType = (match[1] === "ws" || match[1] === "winter") ? SemesterType.WINTER : SemesterType.SUMMER; // Normalize to 'winter' or 'summer'
    let year = match[2];
    if (year.includes("/")) {
      const [fristYear, secondYear] = year.split("/");
      if (fristYear.length === 4) {
        fristYear.slice(-2); // Normalize '202425' to '2425'
      }
      year = fristYear + secondYear;
    }

    let validYear = this.parseAcademicYear(parseInt(year), validType);

    return {
      type: validType,
      year: validYear
    };
  }

  // Helper method to calculate the academic year based on the semester type.
  // And convert 2-digit years to 4-digit years but assumes 21st century.
  private static parseAcademicYear(year: number, type: SemesterType): AcademicYear {
    let academicYear: string;

    if (type === SemesterType.WINTER) {
      // Handle 4-digits
      if (year > 1000) {
        let yearString = year.toString();
        let fristYear = parseInt(yearString.slice(0,2));
        let secondYear = parseInt(yearString.slice(2));
        
        // Check if year is consecutive e.g. ws2425 or ss2024
        if (secondYear - fristYear === 1) {
          academicYear = `20${fristYear}/${secondYear}`; 
        } else {
          let nextYear = year + 1;
          academicYear = `${year}/${nextYear.toString().slice(-2)}`; 
        }
        return academicYear as AcademicYear;
      }

      if (year < 100) {
        academicYear = `20${year}/${year + 1}`; // e.g. 2024/25
        return academicYear as AcademicYear;
      } 
      throw MethodFailedException.assert(false, `Cannot parse AcademicYear: ${year} for winter semester.`)

      // Handle 2-digits
    } else {
      if (year < 100) {
        academicYear = `20${year}`; // e.g. 2024
      } else {
        academicYear = `${year}`;
      }
      return academicYear as AcademicYear;
    }
  }
}
