
import ProjectCard from './ProjectCard';
import styles from './projects.module.css';

const ProjectsGrid = ({ projects, currentView, donate, viewDetails }) => (
  <div className={`${styles.projectsGrid} ${currentView === 'grid' ? styles.active : ''}`}>
    {projects.map((project, index) => (
      <ProjectCard 
        key={project.id} 
        project={project} 
        currentView={currentView} 
        donate={donate} 
        viewDetails={viewDetails}
      />
    ))}
  </div>
);

export default ProjectsGrid;
