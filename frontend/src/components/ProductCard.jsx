import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Plus, Minus, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState('');

  const handleAdd = () => {
    addToCart(product, qty, notes);
    setQty(1); // Reset form
    setNotes('');
    alert(`Added ${qty} ${product.unit} of ${product.name}`); // Simple feedback
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
            <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-600 uppercase">
              {product.category}
            </span>
        </div>
        <p className="text-red-700 font-bold mt-1">
          ₱{parseFloat(product.price).toFixed(2)} / {product.unit}
        </p>
        
        {/* Optional: Display availability */}
        {!product.is_available && (
          <p className="text-xs text-red-500 font-bold mt-2">Currently Unavailable</p>
        )}
      </div>

      {product.is_available && (
        <div className="mt-4 space-y-3">
            {/* Notes Input */}
            <input
              type="text"
              placeholder="Notes (e.g. Skin on, sliced)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-sm p-2 border rounded bg-gray-50"
            />

            {/* Quantity Controls */}
            <div className="flex items-center justify-between bg-gray-50 rounded p-1 border">
              <button 
                onClick={() => setQty(q => Math.max(0.5, q - 0.5))}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <Minus size={16} />
              </button>
              <span className="font-semibold text-sm w-12 text-center">{qty}</span>
              <button 
                onClick={() => setQty(q => q + 0.5)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Add Button */}
            <button
                onClick={handleAdd}
                className="w-full bg-red-700 text-white py-2 rounded flex items-center justify-center gap-2 hover:bg-red-800 transition"
            >
                <ShoppingBag size={18} />
                Add to Order
            </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;