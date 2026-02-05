import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../api/axiosClient';
import ProductCard from '../../components/ProductCard';
import { useCart } from '../../context/CartContext';
import { ShoppingCart } from 'lucide-react';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cartItems } = useCart();

useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/products');
        
        // --- DEBUG LOGGING ---
        console.log("RAW BACKEND RESPONSE:", response);
        console.log("DATA PART:", response.data);
        // ---------------------

        // Try to guess the structure
        let dataToUse = [];
        if (Array.isArray(response.data)) {
            dataToUse = response.data; // It's Option B (Direct Array)
        } else if (response.data.data && Array.isArray(response.data.data)) {
            dataToUse = response.data.data; // It's Option A (Wrapped)
        } else if (response.data.products && Array.isArray(response.data.products)) {
            dataToUse = response.data.products; // Maybe wrapped in 'products'
        }

        setProducts(dataToUse);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Could not load products. Check console for details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading fresh meats...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div>
      {/* Page Header with Cart Link */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Our Products</h2>
        
        <Link to="/checkout" className="relative bg-red-700 text-white p-3 rounded-full shadow-lg hover:bg-red-800 transition">
          <ShoppingCart size={24} />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-900 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border border-white">
              {cartItems.length}
            </span>
          )}
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
            <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Catalog;