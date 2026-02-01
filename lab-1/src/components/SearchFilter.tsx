import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { SearchFilters, ProductCategory } from '../types';
import { debounce } from '../utils/formatters';

interface SearchFilterProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  categories: ProductCategory[];
}

const PRICE_RANGES = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $500', min: 100, max: 500 },
  { label: '$500+', min: 500, max: 10000 },
];

export const SearchFilter: React.FC<SearchFilterProps> = ({
  filters,
  onFiltersChange,
  categories,
}) => {
  const [localQuery, setLocalQuery] = useState(filters.query);
  const [isExpanded, setIsExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onFiltersChange({
        ...filters,
        query,
      });
    }, 300),
    [filters, onFiltersChange]
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocalQuery(query);
    debouncedSearch(query);
  };

  const handleCategoryToggle = (category: ProductCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    
    onFiltersChange({
      ...filters,
      categories: newCategories,
    });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    onFiltersChange({
      ...filters,
      priceRange: [min, max],
    });
  };

  const handleInStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      inStock: e.target.checked,
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = e.target.value.split('-');
    const sortBy = values[0];
    const sortOrder = values[1];
    
    onFiltersChange({
      ...filters,
      sortBy,
      sortOrder,
    });
  };

  const clearFilters = () => {
    setLocalQuery('');
    onFiltersChange({
      query: '',
      categories: [],
      priceRange: [0, 1000],
      inStock: false,
      sortBy: 'name',
      sortOrder: 'asc',
    });
  };

  const activeFiltersCount =
    (filters.query ? 1 : 0) +
    filters.categories.length +
    (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 1000 ? 1 : 0) +
    (filters.inStock ? 1 : 0);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.searchRow}>
        <div style={styles.searchBox}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search products..."
            value={localQuery}
            onChange={handleQueryChange}
            style={styles.searchInput}
          />
          {localQuery && (
            <button
              onClick={() => {
                setLocalQuery('');
                onFiltersChange({ ...filters, query: '' });
              }}
              style={styles.clearButton}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          style={styles.filterToggle}
        >
          <span style={styles.filterIcon}>⚙️</span>
          Filters
          {activeFiltersCount > 0 && (
            <span style={styles.badge}>{activeFiltersCount}</span>
          )}
          <span style={{ ...styles.chevron, ...(isExpanded ? styles.chevronUp : {}) }}>
            ▼
          </span>
        </button>

        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={handleSortChange}
          style={styles.sortSelect}
        >
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
          <option value="rating-desc">Rating (High to Low)</option>
          <option value="rating-asc">Rating (Low to High)</option>
        </select>
      </div>

      {isExpanded && (
        <div style={styles.expandedFilters}>
          <div style={styles.filterSection}>
            <h4 style={styles.filterTitle}>Categories</h4>
            <div style={styles.categoryGrid}>
              {categories.map((category) => (
                <label key={category} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() => handleCategoryToggle(category)}
                    style={styles.checkbox}
                  />
                  <span style={styles.checkboxText}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div style={styles.filterSection}>
            <h4 style={styles.filterTitle}>Price Range</h4>
            <div style={styles.priceButtons}>
              {PRICE_RANGES.map((range) => (
                <button
                  key={range.label}
                  onClick={() => handlePriceRangeChange(range.min, range.max)}
                  style={{
                    ...styles.priceButton,
                    ...(filters.priceRange[0] === range.min &&
                    filters.priceRange[1] === range.max
                      ? styles.activePriceButton
                      : {}),
                  }}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.filterSection}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={handleInStockChange}
                style={styles.checkbox}
              />
              <span style={styles.checkboxText}>In Stock Only</span>
            </label>
          </div>

          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} style={styles.clearAllButton}>
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {activeFiltersCount > 0 && !isExpanded && (
        <div style={styles.activeFilters}>
          {filters.query && (
            <span style={styles.filterChip}>
              Search: "{filters.query}"
              <button
                onClick={() => {
                  setLocalQuery('');
                  onFiltersChange({ ...filters, query: '' });
                }}
                style={styles.chipRemove}
              >
                ×
              </button>
            </span>
          )}
          {filters.categories.map((category) => (
            <span key={category} style={styles.filterChip}>
              {category}
              <button
                onClick={() => handleCategoryToggle(category)}
                style={styles.chipRemove}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  searchRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: 1,
    minWidth: '250px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 14px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: '#f8f9fa',
  },
  searchIcon: {
    fontSize: '16px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    fontSize: '14px',
    outline: 'none',
  },
  clearButton: {
    border: 'none',
    background: 'transparent',
    color: '#7f8c8d',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '0 4px',
  },
  filterToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
  },
  filterIcon: {
    fontSize: '16px',
  },
  badge: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 600,
    padding: '2px 6px',
    borderRadius: '10px',
    minWidth: '18px',
    textAlign: 'center',
  },
  chevron: {
    fontSize: '10px',
    transition: 'transform 0.2s',
  },
  chevronUp: {
    transform: 'rotate(180deg)',
  },
  sortSelect: {
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: '#fff',
    fontSize: '14px',
    cursor: 'pointer',
  },
  expandedFilters: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #ecf0f1',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  filterSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  filterTitle: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 600,
    color: '#2c3e50',
    textTransform: 'uppercase',
  },
  categoryGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    padding: '6px 10px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#f8f9fa',
    },
  },
  checkbox: {
    cursor: 'pointer',
  },
  checkboxText: {
    fontSize: '14px',
    color: '#555',
  },
  priceButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  priceButton: {
    padding: '8px 16px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s',
  },
  activePriceButton: {
    backgroundColor: '#3498db',
    color: '#fff',
    borderColor: '#3498db',
  },
  clearAllButton: {
    padding: '10px 20px',
    border: '1px solid #e74c3c',
    borderRadius: '6px',
    backgroundColor: 'transparent',
    color: '#e74c3c',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    alignSelf: 'flex-start',
  },
  activeFilters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '12px',
  },
  filterChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    backgroundColor: '#ecf0f1',
    borderRadius: '16px',
    fontSize: '13px',
    color: '#555',
  },
  chipRemove: {
    border: 'none',
    background: 'transparent',
    color: '#7f8c8d',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
  },
};
