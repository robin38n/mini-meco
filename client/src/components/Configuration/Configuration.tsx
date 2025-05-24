import Settings from "./Settings";
import ProjectConfig from "./ProjectConfig";
import CourseParticipation from "./CourseParticipation";
import "./Configuration.css";

const Configuration = () => {
  return (
    <div>
      <div className="ConfigbigContainer">
        <div className="ConfigComponents">
          <Settings />
        </div>
        <div className="ConfigComponents">
          <CourseParticipation />
        </div>
        <div className="ConfigComponents">
          <ProjectConfig />
        </div>
      </div>
    </div>
  );
};

export default Configuration;
