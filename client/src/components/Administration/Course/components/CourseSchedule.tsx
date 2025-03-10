import React, { useState, useEffect } from "react";
import { Course } from "../types";
import { Button } from "react-bootstrap";
import { DateInput } from "./CourseForm";

interface CourseScheduleProps {
  course: Course;
  onClose: () => void;
}

const CourseSchedule: React.FC<CourseScheduleProps> = ({ course, onClose }) => {
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 28);
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [submission, setSubmission] = useState<Date[]>([]);

  const generateWeeklySubmission = () => {
    const boxes: Date[] = [];
    let current = new Date(startDate);
    while (current <= endDate) {
      boxes.push(new Date(current));
      current.setDate(current.getDate() + 7);
    }
    setSubmission(boxes);
  };

  useEffect(() => {
    generateWeeklySubmission();
  }, [startDate, endDate]);

  const addSubmission = (date: Date) => {
    const exists = submission.some(
      (slot) =>
        slot.toISOString().substring(0, 10) ===
        date.toISOString().substring(0, 10)
    );
    if (!exists) {
      const newSubmission = [...submission, date];
      newSubmission.sort((a, b) => a.getTime() - b.getTime());
      setSubmission(newSubmission);
    }
  };

  const removeSubmission = (date: Date) => {
    setSubmission(
      submission.filter(
        (slot) =>
          slot.toISOString().substring(0, 10) !==
          date.toISOString().substring(0, 10)
      )
    );
  };

  const splitTimeboxesIntoColumns = () => {
    const leftColumn: Date[] = [];
    const rightColumn: Date[] = [];

    submission.forEach((slot) => {
      // Insert where fewer elements
      if (
        leftColumn.length < rightColumn.length ||
        (leftColumn.length === rightColumn.length && leftColumn.length < 4)
      ) {
        leftColumn.push(slot);
      } else {
        rightColumn.push(slot);
      }
    });

    return { leftColumn, rightColumn };
  };
  const { leftColumn, rightColumn } = splitTimeboxesIntoColumns();

  const formatDateWithLeadingZeros = (date: Date): string => {
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex size-full items-center justify-center bg-gray-900/50">
      <div className="mt-4 flex w-1/3 flex-col items-center justify-center rounded bg-white p-4 text-gray-500 shadow">
        <h2 className="text-2xl font-bold text-black">Course Scheduler</h2>
        <h3>
          ID: {course.id}, Name: {course.courseName} and Semester:{" "}
          {course.semester}
        </h3>

        <div className="flex w-fit flex-col items-center">
          <DateInput
            label="Course start:"
            value={startDate.toISOString().substring(0, 10)}
            onChange={setStartDate}
            className="my-2"
          />

          <DateInput
            label="Course end:"
            value={endDate.toISOString().substring(0, 10)}
            onChange={setEndDate}
            className="my-2"
          />
        </div>

        <div className="mb-4 w-fit items-center">
          <h3 className="px-2 font-bold text-black">Submission:</h3>
          <DateInput
            label="Add Date:"
            className="my-2 justify-center"
            value={selectedDate.toISOString().substring(0, 10)}
            onChange={(date) => {
              setSelectedDate(date);
              addSubmission(date);
            }}
          />
          <div className="flex flex-row">
            {/* Left Col */}
            <div className="px-2">
              <ul>
                {leftColumn.map((slot, index) => (
                  <li key={`left-${index}`} className="flex items-center p-2">
                    <span>{formatDateWithLeadingZeros(slot)}</span>
                    <Button
                      className="ml-2 rounded bg-blue-500 text-white"
                      onClick={() => removeSubmission(slot)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Col */}
            <div className="w-1/2 px-2">
              <ul>
                {rightColumn.map((slot, index) => (
                  <li key={`right-${index}`} className="flex items-center p-2">
                    <span>{formatDateWithLeadingZeros(slot)}</span>
                    <Button
                      className="ml-2 rounded bg-blue-500 text-white"
                      onClick={() => removeSubmission(slot)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2">
          <Button
            className="rounded bg-gray-300 px-4 py-2 text-black"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            className="rounded bg-blue-500 px-4 py-2 text-white"
            onClick={() =>
              console.log({ startDate, endDate, submission, course })
            }
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseSchedule;
