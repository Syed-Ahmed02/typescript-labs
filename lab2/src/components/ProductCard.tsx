import './ProductCard.css';

interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
}

// BUG 4: Incorrect prop type definition
// The component expects the wrong prop structure
// Hint: Check how the component is being used in App.tsx

// ❌ BROKEN - Wrong prop type
interface ProductCardProps {
  item: Product;
}

export function ProductCard(props: ProductCardProps) {
  const { item } = props;

  return (
    <div className={`product-card ${!item.inStock ? 'product-card--out-of-stock' : ''}`}>
      <h3 className="product-name">{item.name}</h3>
      <p className="product-price">${item.price.toFixed(2)}</p>
      <span className={`product-status product-status--${item.inStock ? 'in' : 'out'}`}>
        {item.inStock ? 'In Stock' : 'Out of Stock'}
      </span>
    </div>
  );
}
