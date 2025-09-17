import styles from './projects.module.css';

const HeroSection = () => (
  <section className={styles.hero}>
    <div className={styles.container}>
      <div className={styles.heroContent}>
        <h2>Soutenez l'Éducation Malgache</h2>
        <p>
          Découvrez des projets éducatifs inspirants et contribuez concrètement 
          à l'amélioration de l'enseignement à Madagascar.
        </p>
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNumber}>42</span>
            <span className={styles.heroStatLabel}>Projets actifs</span>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNumber}>156</span>
            <span className={styles.heroStatLabel}>Établissements</span>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNumber}>2.8M</span>
            <span className={styles.heroStatLabel}>Ar collectés</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
