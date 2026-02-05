import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import apiClient from '../../api/axiosClient';
import { ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, removeFromCart, clearCart, getOrderPayload } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    pickupTime: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return alert("Your cart is empty!");

    setIsSubmitting(true);
    try {
      // 1. Prepare data for Backend using Context helper
      const payload = getOrderPayload(formData);
      
      [cite_start]// 2. Send POST request [cite: 79]
      const response = await apiClient.post('/orders', payload);
      
      // 3. Handle Success
      const { orderNumber } = response.data.data; // Ensure this matches your backend response format
      clearCart(); // Wipe the cart
      navigate(`/order-success/${orderNumber}`); // Go to tracking page

    } catch (error) {
      console.error("Order failed:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center p-10">
        <h2 className="text-xl mb-4">Your cart is empty.</h2>
        <Link to="/" className="text-red-700 underline">Go back to Menu</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/" className="flex items-center text-gray-500 mb-4 hover:text-red-700">
        <ArrowLeft size={16} className="mr-1"/> Back to Menu
      </Link>

      <h2 className="text-2xl font-bold mb-6">Review & Checkout</h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* LEFT COLUMN: Order Summary */}
        <div className="bg-white p-4 rounded shadow h-fit">
          <h3 className="font-bold border-b pb-2 mb-4">Order Summary</h3>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between items-start text-sm">
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-gray-500">
                    {item.qty} {item.unit} x ₱{item.price}
                  </div>
                  {item.itemNotes && (
                    <div className="text-xs text-gray-400 italic">Note: {item.itemNotes}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-semibold">₱{(item.price * item.qty).toFixed(2)}</div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-xs text-red-500 hover:underline mt-1"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
            <span>Total Estimate:</span>
            <span>₱{cartTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Customer Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input 
              required name="customerName" 
              type="text" 
              className="w-full border p-2 rounded mt-1"
              value={formData.customerName} onChange={handleChange}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input 
              required name="phone" 
              type="tel" 
              placeholder="0917..."
              className="w-full border p-2 rounded mt-1"
              value={formData.phone} onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Pickup Time</label>
            <input 
              required name="pickupTime" 
              type="text" 
              placeholder="e.g., Today 5pm or ASAP"
              className="w-full border p-2 rounded mt-1"
              value={formData.pickupTime} onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">General Notes (Optional)</label>
            <textarea 
              name="notes" 
              className="w-full border p-2 rounded mt-1"
              rows="2"
              value={formData.notes} onChange={handleChange}
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-red-700 text-white font-bold py-3 rounded shadow hover:bg-red-800 transition disabled:bg-gray-400"
          >
            {isSubmitting ? "Placing Order..." : "Confirm Pickup Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;