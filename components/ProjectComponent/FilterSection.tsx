import styles from './projects.module.css';

// Définir l'interface pour filters
interface Filters {
  search: string;
  category: string;
  region: string;
  level: string;
}

// Définir les types pour handleFilterChange
interface FilterSectionProps {
  filters: Filters;
  handleFilterChange: (filterType: keyof Filters, value: string) => void;
}

const FilterSection = ({ filters, handleFilterChange }) => (
  <section className={styles.filtersSection}>
    <div className={styles.container}>
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <div className={styles.searchIcon}>🔍</div>
          <input 
            type="text" 
            className={styles.searchInput} 
            placeholder="Rechercher un projet, établissement..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Catégorie</label>
          <select 
            className={styles.filterSelect}
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">Toutes</option>
            <option value="Construction">Construction</option>
            <option value="Réhabilitation">Réhabilitation</option>
            <option value="Équipement">Équipement</option>
            <option value="Formation">Formation</option>
            <option value="Autres">Autres</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Région</label>
          <select 
            className={styles.filterSelect}
            value={filters.region}
            onChange={(e) => handleFilterChange('region', e.target.value)}
          >
            <option value="">Toutes</option>
            <option value="Antananarivo">Antananarivo</option>
            <option value="Vakinankaratra">Vakinankaratra</option>
            <option value="Haute Matsiatra">Haute Matsiatra</option>
            <option value="Boeny">Boeny</option>
            <option value="Atsinanana">Atsinanana</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Niveau</label>
          <select 
            className={styles.filterSelect}
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
          >
            <option value="">Tous</option>
            <option value="epp">EPP</option>
            <option value="ceg">CEG</option>
            <option value="lycee">Lycée</option>
            <option value="college">Collège</option>
            <option value="universite">Université</option>
          </select>
        </div>
      </div>
    </div>
  </section>
);

export default FilterSection;
