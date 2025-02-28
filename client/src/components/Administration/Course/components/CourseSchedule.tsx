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
  const [timeboxes, setTimeboxes] = useState<Date[]>([]);

  const generateWeeklyTimeboxes = () => {
    const boxes: Date[] = [];
    let current = new Date(startDate);
    while (current <= endDate) {
      boxes.push(new Date(current));
      current.setDate(current.getDate() + 7);
    }
    setTimeboxes(boxes);
  };

  useEffect(() => {
    generateWeeklyTimeboxes();
  }, [startDate, endDate]);

  const addTimebox = (date: Date) => {
    const exists = timeboxes.some(
      (tb) =>
        tb.toISOString().substring(0, 10) ===
        date.toISOString().substring(0, 10)
    );
    if (!exists) {
      const newTimeboxes = [...timeboxes, date];
      newTimeboxes.sort((a, b) => a.getTime() - b.getTime());
      setTimeboxes(newTimeboxes);
    }
  };

  const removeTimebox = (date: Date) => {
    setTimeboxes(
      timeboxes.filter(
        (tb) =>
          tb.toISOString().substring(0, 10) !==
          date.toISOString().substring(0, 10)
      )
    );
  };

  // Split Timeboxes in two columns
  const splitTimeboxesIntoColumns = () => {
    const leftColumn: Date[] = [];
    const rightColumn: Date[] = [];

    timeboxes.forEach((tb) => {
      // Insert where fewer elements
      if (
        leftColumn.length < rightColumn.length ||
        (leftColumn.length === rightColumn.length && leftColumn.length < 4)
      ) {
        leftColumn.push(tb);
      } else {
        rightColumn.push(tb);
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

  console.log("course", course);

  return (
    <div className="course-schedule-panel p-4 w-1/4 rounded mt-4 text-gray-500 bg-white shadow">
      <h2 className="font-bold text-2xl text-black">
        Scheduler for {course.name}
      </h2>

      <div className="flex flex-col items-center">
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

      <div className="my-4">
        <h3 className="font-bold text-black">Add Timebox:</h3>
        <DateInput
          className="my-2 flex justify-center"
          value={selectedDate.toISOString().substring(0, 10)}
          onChange={(date) => {
            setSelectedDate(date);
            addTimebox(date);
          }}
        />
      </div>

      <div className="mb-4">
        <h3 className="font-bold text-black">Weekly Timeboxes:</h3>
        <div className="flex flex-row">
          {/* Left Col */}
          <div className="w-1/2 px-2">
            <ul>
              {leftColumn.map((tb, index) => (
                <li key={`left-${index}`} className="flex items-center p-2">
                  <span>{formatDateWithLeadingZeros(tb)}</span>
                  <Button
                    className="ml-2 bg-blue-500 text-white rounded"
                    onClick={() => removeTimebox(tb)}
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
              {rightColumn.map((tb, index) => (
                <li key={`right-${index}`} className="flex items-center p-2">
                  <span>{formatDateWithLeadingZeros(tb)}</span>
                  <Button
                    className="ml-2 bg-blue-500 text-white rounded"
                    onClick={() => removeTimebox(tb)}
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
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => console.log({ startDate, endDate, timeboxes, course })}
        >
          Save
        </Button>
        <Button
          className="px-4 py-2 bg-gray-300 text-black rounded"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default CourseSchedule;
