import UserAdmin from "./UserAdmin";
import CourseManager from "@/components/Administration/CourseManager";
import "./Administration.css";
import ProjectAdmin from "./ProjectAdmin";

const Administration = () => {
  return (
    <div>
      <div className="AdminbigContainer">
        <div className="AdminComponents">
          <UserAdmin />
        </div>
        <div className="AdminComponents">
          <CourseManager />
          <ProjectAdmin />
        </div>
      </div>
    </div>
  );
};

export default Administration;
