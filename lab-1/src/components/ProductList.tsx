import React, { useState, useCallback } from 'react';
import type { Product, ProductCategory } from '../types';
import { formatDate, formatCurrency, calculateAverageRating } from '../utils/formatters';

interface ProductListProps {
  products: Product[];
  onProductSelect?: (product: Product) => void;
  onAddToCart?: (productId: string) => void;
  selectedProductIds?: string[];
  loading?: boolean;
}

const CATEGORY_COLORS: Record<ProductCategory, string> = {
  electronics: '#3498db',
  clothing: '#e74c3c',
  food: '#f39c12',
  books: '#9b59b6',
  home: '#1abc9c',
};

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onProductSelect,
  onAddToCart,
  selectedProductIds = [],
  loading = false,
}) => {
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'price' | 'name' | 'rating'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = useCallback((field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  // Performance issue: sorting on every render
  const sortedProducts = (() => {
    const sorted = [...products].sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
      }
      
      return sortDirection === 'desc' ? -comparison : comparison;
    });
    
    return sorted;
  })();

  const toggleExpand = (productId: string) => {
    setExpandedProductId((prev) => (prev === productId ? null : productId));
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} style={styles.star}>★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" style={styles.star}>☆</span>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} style={{ ...styles.star, opacity: 0.3 }}>★</span>);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
        <p>Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={styles.empty}>
        <p>No products found</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>
          Products ({products.length})
        </h3>
        <div style={styles.sortControls}>
          <span style={styles.sortLabel}>Sort by:</span>
          {(['name', 'price', 'rating'] as const).map((field) => (
            <button
              key={field}
              onClick={() => handleSort(field)}
              style={{
                ...styles.sortButton,
                ...(sortField === field ? styles.activeSortButton : {}),
              }}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
              {sortField === field && (
                <span style={styles.sortIndicator}>
                  {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.grid}>
        {sortedProducts.map((product) => {
          const isSelected = selectedProductIds.includes(product.id);
          const isExpanded = expandedProductId === product.id;
          
          return (
            <div
              key={product.id}
              style={{
                ...styles.card,
                ...(isSelected ? styles.selectedCard : {}),
              }}
              onClick={() => onProductSelect?.(product)}
            >
              <div style={styles.cardHeader}>
                <span
                  style={{
                    ...styles.category,
                    backgroundColor: CATEGORY_COLORS[product.category],
                  }}
                >
                  {product.category}
                </span>
                <span style={styles.date}>
                  {formatDate(product.createdAt)}
                </span>
              </div>

              <h4 style={styles.productName}>{product.name}</h4>
              <p style={styles.description}>{product.description}</p>

              <div style={styles.tags}>
                {product.tags.map((tag) => (
                  <span key={tag} style={styles.tag}>
                    #{tag}
                  </span>
                ))}
              </div>

              <div style={styles.rating}>
                {renderStars(product.rating)}
                <span style={styles.ratingText}>
                  ({product.reviews.length} reviews)
                </span>
              </div>

              <div style={styles.footer}>
                <span
                  style={{
                    ...styles.price,
                    ...(product.inStock ? {} : styles.outOfStock),
                  }}
                >
                  {formatCurrency(product.price)}
                </span>
                
                <div style={styles.actions}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleExpand(product.id);
                    }}
                    style={styles.actionButton}
                  >
                    {isExpanded ? 'Less' : 'More'}
                  </button>
                  
                  {product.inStock && onAddToCart && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product.id);
                      }}
                      style={styles.addButton}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>

              {isExpanded && product.reviews.length > 0 && (
                <div style={styles.reviews}>
                  <h5 style={styles.reviewsTitle}>Reviews</h5>
                  {product.reviews.slice(0, 3).map((review) => (
                    <div key={review.id} style={styles.review}>
                      <div style={styles.reviewHeader}>
                        {renderStars(review.rating)}
                        <span style={styles.reviewDate}>
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <p style={styles.reviewComment}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {!product.inStock && (
                <div style={styles.outOfStockBadge}>
                  Out of Stock
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    color: '#2c3e50',
  },
  sortControls: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: '14px',
    color: '#7f8c8d',
  },
  sortButton: {
    padding: '6px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'all 0.2s',
  },
  activeSortButton: {
    backgroundColor: '#3498db',
    color: '#fff',
    borderColor: '#3498db',
  },
  sortIndicator: {
    marginLeft: '4px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    position: 'relative',
    border: '2px solid transparent',
  },
  selectedCard: {
    borderColor: '#3498db',
    boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  category: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#fff',
    textTransform: 'uppercase',
  },
  date: {
    fontSize: '12px',
    color: '#95a5a6',
  },
  productName: {
    margin: '0 0 8px 0',
    fontSize: '18px',
    fontWeight: 600,
    color: '#2c3e50',
  },
  description: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    color: '#555',
    lineHeight: 1.5,
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginBottom: '12px',
  },
  tag: {
    padding: '2px 8px',
    backgroundColor: '#ecf0f1',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#7f8c8d',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  star: {
    color: '#f39c12',
    fontSize: '16px',
  },
  ratingText: {
    fontSize: '13px',
    color: '#7f8c8d',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #ecf0f1',
  },
  price: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#27ae60',
  },
  outOfStock: {
    color: '#e74c3c',
    textDecoration: 'line-through',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    padding: '6px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
  },
  addButton: {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    backgroundColor: '#27ae60',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 500,
  },
  reviews: {
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #ecf0f1',
  },
  reviewsTitle: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: 600,
    color: '#2c3e50',
  },
  review: {
    marginBottom: '12px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  reviewDate: {
    fontSize: '11px',
    color: '#95a5a6',
  },
  reviewComment: {
    margin: 0,
    fontSize: '13px',
    color: '#555',
    lineHeight: 1.4,
  },
  outOfStockBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    padding: '4px 10px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '16px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #ecf0f1',
    borderTopColor: '#3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  empty: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#7f8c8d',
  },
};
