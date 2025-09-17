import styles from './projects.module.css';

const Header = () => (
  <header className={styles.header}>
    <div className={styles.container}>
      <div className={styles.headerContent}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>MSN</div>
          <h1>Mada Social Network</h1>
        </div>
        <nav className={styles.headerNav}>
          <a href="/" className={styles.navLink}>Accueil</a>
          <a href="/projects" className={`${styles.navLink} ${styles.active}`}>Projets</a>
          {/* <a href="#" className={styles.navLink}>Établissements</a> */}
          <a href="/" className={styles.navLink}>À propos</a>
        </nav>
        <div className={styles.headerActions}>
          <a href="#" className={`${styles.btn} ${styles.btnSecondary}`}>Se connecter</a>
          <a href="#" className={`${styles.btn} ${styles.btnPrimary}`}>S'inscrire</a>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
