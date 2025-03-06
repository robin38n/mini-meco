import UserAdmin from "./UserAdmin";
import CourseAdmin from "@/components/Administration/CourseAdmin";
import "./Administration.css";

const Administration = () => {
  return (
    <div>
      <div className="AdminbigContainer">
        <div className="AdminComponents">
          <UserAdmin />
        </div>
        <div className="AdminComponents">
          <CourseAdmin />
        </div>
      </div>
    </div>
  );
};

export default Administration;
