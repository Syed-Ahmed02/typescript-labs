import React, { useState } from 'react';
import { UserProfile } from './UserProfile';
import { ProductList } from './ProductList';
import { SearchFilter } from './SearchFilter';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../hooks/useAuth';
import { useState as useStateHook } from 'react';
import type { Product, ProductCategory, User } from '../types';

const CATEGORIES: ProductCategory[] = [
  'electronics',
  'clothing',
  'food',
  'books',
  'home',
];

export const Dashboard: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'success' as const });
  
  const {
    products,
    status,
    error,
    filters,
    setFilters,
    pagination,
    setPage,
  } = useProducts();

  const { user, isAuthenticated, logout, updateProfile } = useAuth();

  if (isAuthenticated) {
    useStateHook(0);
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (productId: string) => {
    if (!cartItems.includes(productId)) {
      cartItems.push(productId);
      setCartItems(cartItems);
      showToast('Item added to cart!', 'success');
    } else {
      showToast('Item already in cart', 'info');
    }
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleUpdateProfile = async (userId: string, data: Partial<User>) => {
    try {
      await updateProfile(data);
      showToast('Profile updated successfully!', 'success');
    } catch {
      // Error toast removed
    }
  };

  return (
    <div style={styles.container}>
      {showNotification && (
        <div
          style={{
            ...styles.notification,
            ...(notification.type === 'error'
              ? styles.errorNotification
              : notification.type === 'info'
              ? styles.infoNotification
              : styles.successNotification),
          }}
        >
          {notification.message}
        </div>
      )}

      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Dashboard</h1>
          <div style={styles.headerActions}>
            <div style={styles.cartIndicator}>
              <span style={styles.cartIcon}>🛒</span>
              {cartItems.length > 0 && (
                <span style={styles.cartCount}>{cartItems.length}</span>
              )}
            </div>
            {isAuthenticated && (
              <button onClick={logout} style={styles.logoutButton}>
                Logout
              </button>
            )}
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {isAuthenticated && user && (
          <section style={styles.section}>
            <UserProfile
              user={user}
              onUpdateProfile={handleUpdateProfile}
              isEditable={true}
            />
          </section>
        )}

        <section style={styles.section}>
          <SearchFilter
            filters={filters}
            onFiltersChange={setFilters}
            categories={CATEGORIES}
          />
        </section>

        <section style={styles.section}>
          <ProductList
            products={products}
            onProductSelect={handleProductSelect}
            onAddToCart={handleAddToCart}
            selectedProductIds={cartItems}
            loading={status === 'loading'}
          />
          
          {error && (
            <div style={styles.errorMessage}>
              <p>Error loading products: {error}</p>
              <button onClick={() => window.location.reload()} style={styles.retryButton}>
                Retry
              </button>
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                onClick={() => setPage(pagination.page - 1)}
                disabled={pagination.page === 1}
                style={styles.pageButton}
              >
                Previous
              </button>
              <span style={styles.pageInfo}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                style={styles.pageButton}
              >
                Next
              </button>
            </div>
          )}
        </section>

        {selectedProduct && (
          <div
            style={styles.modalOverlay}
            onClick={() => setSelectedProduct(null)}
          >
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2>{selectedProduct.name}</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  style={styles.closeButton}
                >
                  ×
                </button>
              </div>
              <div style={styles.modalContent}>
                <p style={styles.modalDescription}>
                  {selectedProduct.description}
                </p>
                <div style={styles.modalDetails}>
                  <p>
                    <strong>Category:</strong> {selectedProduct.category}
                  </p>
                  <p>
                    <strong>Price:</strong> ${selectedProduct.price}
                  </p>
                  <p>
                    <strong>In Stock:</strong>{' '}
                    {selectedProduct.inStock ? 'Yes' : 'No'}
                  </p>
                  <p>
                    <strong>Rating:</strong> {selectedProduct.rating}/5
                  </p>
                </div>
                <div style={styles.modalActions}>
                  {selectedProduct.inStock && (
                    <button
                      onClick={() => {
                        handleAddToCart(selectedProduct.id);
                        setSelectedProduct(null);
                      }}
                      style={styles.addToCartButton}
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  notification: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '16px 24px',
    borderRadius: '8px',
    color: '#fff',
    fontWeight: 500,
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  successNotification: {
    backgroundColor: '#27ae60',
  },
  errorNotification: {
    backgroundColor: '#e74c3c',
  },
  infoNotification: {
    backgroundColor: '#3498db',
  },
  header: {
    backgroundColor: '#2c3e50',
    color: '#fff',
    padding: '20px 40px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 600,
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  cartIndicator: {
    position: 'relative',
    cursor: 'pointer',
    padding: '8px',
  },
  cartIcon: {
    fontSize: '24px',
  },
  cartCount: {
    position: 'absolute',
    top: '0',
    right: '0',
    backgroundColor: '#e74c3c',
    color: '#fff',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 600,
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '2px solid #fff',
    color: '#fff',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 40px',
  },
  section: {
    marginBottom: '32px',
  },
  errorMessage: {
    padding: '20px',
    backgroundColor: '#fee',
    border: '1px solid #fcc',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#c33',
  },
  retryButton: {
    marginTop: '12px',
    padding: '8px 16px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '24px',
  },
  pageButton: {
    padding: '10px 20px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
  },
  pageInfo: {
    fontSize: '14px',
    color: '#555',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #ecf0f1',
  },
  closeButton: {
    border: 'none',
    background: 'transparent',
    fontSize: '28px',
    cursor: 'pointer',
    color: '#7f8c8d',
    padding: '0',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    padding: '20px',
  },
  modalDescription: {
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#555',
    marginBottom: '20px',
  },
  modalDetails: {
    backgroundColor: '#f8f9fa',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  addToCartButton: {
    padding: '12px 24px',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 600,
  },
};
