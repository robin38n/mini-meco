import { useState, useEffect } from "react";
import ReturnButton from "../Components/return";
import { Button } from "react-bootstrap";
import Table from "../Components/Table";
import { Course } from "./Course/types";
import CourseWidget from "./Course/CourseWidget";
import { useCourse } from "@/hooks/useCourse";
import CourseSchedule from "./Course/components/CourseSchedule";
import "@/components/Administration/ProjectAdmin.css";

const CourseManager: React.FC = () => {
  const { courses, getCourses } = useCourse();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Course | null>(null);

  useEffect(() => {
    fetchCourse();
  }, []);

  function fetchCourse() {
    setLoading(true);
    getCourses().finally(() => setLoading(false));
  }

  const tableData: Array<Array<number | string | boolean | JSX.Element>> =
    [];
  courses.forEach((course) => {
    tableData.push([
      course.id,
      course.semester,
      typeof course.name === "string" ? course.name : course.courseName, // @todo: should be courseName but it isnt...
      <div key={course.id} className="flex gap-2">
        <CourseWidget isEdit course={course} />
        <CourseWidget isProject course={course} />
        {/* @todo: remove it by <CourseWidget isSchedular course={}/> */}
        <Button
          onClick={() => setSelectedSchedule(course)}
          className="btn btn-schedule bg-blue-500 text-white"
          data-cy="schedule-course-trigger"
        >
          Schedule
        </Button>
      </div>,
    ]);
    // @todo: not working idk why...
    if (course.projects && course.projects.length > 0) {
      course.projects.forEach((project) => {
        tableData.push([
          "",
          "",
          <div className="ml-4 text-sm text-gray-700" key={project.id}>
            {project.projectName}
          </div>,
          "",
        ]);
      });
    }
  });

  return (
    <div className="flex">
      <div className="flex-1">
        <ReturnButton />
        <div className="DashboardContainer">
          <h1>Course Manager</h1>
        </div>
        <div className="w-full bg-gray-200 p-3">
          <Table
            headings={["id", "semester", "name", "action"]}
            loading={isLoading}
            loadData={fetchCourse}
            data={tableData}
            rowsPerPage={9}
            filterOptions={{ key: 3, options: ["Winter", "Summer"] }}
          >
            <CourseWidget label="Add course" />
          </Table>
        </div>
      </div>
      {/* // @todo: removed by CourseWidget at Top */}
      {selectedSchedule && (
        <div className="fixed inset-0 z-50 flex size-full items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900/50">
          <CourseSchedule
            course={selectedSchedule}
            onClose={() => setSelectedSchedule(null)}
          />
        </div>
      )}
    </div>
  );
};
export default CourseManager;
