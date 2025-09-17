import styles from './projects.module.css';

// Define the types for the project and other parameters
interface Project {
  id: number;
  title: string;
  school: string;
  category: 'Construction' | 'Réhabilitation' | 'Équipement' | 'Formation' | 'Autres';
  description: string;
  target: number;
  raised: number;
  donors: number;
  date: string;
  region: string;
  level: 'epp' | 'ceg' | 'lycee' | 'college' | 'universite';
}

// Define a function to format the date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Define a function to get category icons based on the category
const getCategoryIcon = (category: 'Construction' | 'Réhabilitation' | 'Équipement' | 'Formation' | 'Autres') => {
  const icons: { [key in 'Construction' | 'Réhabilitation' | 'Équipement' | 'Formation' | 'Autres']: string } = {
    'Construction': '🏗️',
    'Réhabilitation': '🔧',
    'Équipement': '💻',
    'Formation': '🎓',
    'Autres': '✨'
  };
  return icons[category] || '📚'; // default icon if not found
};

// The ProjectCard component
const ProjectCard = ({ project, currentView, donate, viewDetails }: { 
  project: Project; 
  currentView: 'list' | 'grid'; 
  donate: (id: number) => void; 
  viewDetails: (id: number) => void;
}) => {
  const progressPercent = Math.round((project.raised / project.target) * 100);
  const formattedRaised = (project.raised / 1000000).toFixed(1) + 'M';
  const formattedTarget = (project.target / 1000000).toFixed(1) + 'M';

  return (
    <div className={`${styles.projectCard} ${currentView === 'list' ? styles.listView : ''}`}>
      <div className={styles.projectImage}>
        {getCategoryIcon(project.category)}
        <div className={styles.projectCategoryBadge}>{project.category}</div>
      </div>
      <div className={styles.projectContent}>
        {/* Conditional rendering for list view - CORRECTION ICI */}
        {currentView === 'list' && (
          <div className={styles.projectInfo}>
            <p>Project Info:</p>
            <ul>
              <li>Donors: {project.donors}</li>
              <li>Region: {project.region}</li>
              <li>Progress: {progressPercent}%</li>
            </ul>
          </div>
        )}

        <div className={styles.projectHeader}>
          <h3 className={styles.projectTitle}>{project.title}</h3>
          <div className={styles.projectSchool}>🏫 {project.school}</div>
        </div>
        <p className={styles.projectDescription}>{project.description}</p>
        <div className={styles.projectProgress}>
          <div className={styles.progressHeader}>
            <span className={styles.progressAmount}>{formattedRaised} Ar collectés</span>
            <span className={styles.progressTarget}>sur {formattedTarget} Ar</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
        <div className={styles.projectMeta}>
          <span className={styles.projectDate}>📅 {formatDate(project.date)}</span>
          <div className={styles.projectStats}>
            <span className={styles.statItem}>👥 {project.donors}</span>
            <span className={styles.statItem}>📍 {project.region}</span>
          </div>
        </div>

        {/* Project Actions */}
        <div className={styles.projectActions}>
          <button className={styles.btnDonate} onClick={() => donate(project.id)}>
            💝 Faire un don
          </button>
          <button className={styles.btnDetails} onClick={() => viewDetails(project.id)}>
            👁️ Détails
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;