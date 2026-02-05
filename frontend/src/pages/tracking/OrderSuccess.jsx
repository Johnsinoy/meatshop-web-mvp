import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../api/axiosClient';
import { CheckCircle, Clock, ShoppingBag, ArrowRight } from 'lucide-react';

const OrderSuccess = () => {
  const { orderNumber } = useParams(); // Get from URL
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Calls GET /api/v1/orders/:orderNumber
        const response = await apiClient.get(`/orders/${orderNumber}`);
        // Backend returns { order: {...}, items: [...] }
        setOrderData(response.data); 
      } catch (err) {
        console.error("Tracking error:", err);
        setError("Order not found. Please check your order number.");
      } finally {
        setLoading(false);
      }
    };

    if (orderNumber) fetchOrder();
  }, [orderNumber]);

  // Status Color Helper
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-10 text-center">Loading order details...</div>;
  if (error) return <div className="p-10 text-center text-red-600 font-bold">{error}</div>;
  if (!orderData) return null;

  const { order, items } = orderData;

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-8">
      {/* Header */}
      <div className="bg-green-600 p-6 text-white text-center">
        <CheckCircle size={48} className="mx-auto mb-2" />
        <h2 className="text-2xl font-bold">Order Placed Successfully!</h2>
        <p className="opacity-90">Thank you, {order.customer_name || 'Customer'}</p>
      </div>

      <div className="p-6">
        {/* Order Info & Status */}
        <div className="text-center mb-6">
          <p className="text-gray-500 text-sm uppercase tracking-wide">Order Number</p>
          <p className="text-2xl font-mono font-bold text-gray-800 tracking-wider select-all">
            {order.order_number}
          </p>
          
          <div className={`mt-4 inline-flex items-center px-4 py-2 rounded-full border ${getStatusColor(order.status)}`}>
            <Clock size={16} className="mr-2" />
            <span className="font-bold uppercase text-sm">{order.status}</span>
          </div>
          
          <p className="text-xs text-gray-400 mt-2">
            Save this number to track your order status.
          </p>
        </div>

        {/* Order Items List */}
        <div className="border-t border-b py-4 mb-4">
          <h3 className="font-bold text-gray-700 mb-3 flex items-center">
            <ShoppingBag size={18} className="mr-2"/> Order Items
          </h3>
          <ul className="space-y-3">
            {items.map((item, idx) => (
              <li key={idx} className="flex justify-between text-sm">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-500 mx-2">
                    ({parseFloat(item.qty)} {item.unit})
                  </span>
                </div>
                <span className="font-semibold text-gray-700">
                  ₱{parseFloat(item.unit_price * item.qty).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center text-xl font-bold text-gray-900 mb-8">
          <span>Total</span>
          <span>₱{parseFloat(order.total).toFixed(2)}</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
            {/* Simple reload button to simulate "Tracking" updates */}
            <button 
                onClick={() => window.location.reload()}
                className="w-full border border-gray-300 py-2 rounded text-gray-600 hover:bg-gray-50 transition"
            >
                Refresh Status
            </button>

            <Link 
                to="/" 
                className="block w-full bg-red-700 text-white text-center py-3 rounded font-bold hover:bg-red-800 transition flex items-center justify-center gap-2"
            >
                Start New Order <ArrowRight size={18} />
            </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;