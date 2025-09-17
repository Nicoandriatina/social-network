import ProjectCard from "./ProjectCard";

const ProjectList = ({ projects }: any) => {
  return (
    <div className="projects-list">
      {projects.map((project: any) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectList;
