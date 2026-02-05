import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

// Placeholder imports for pages we will build next
import Catalog from './pages/catalog/Catalog';
import Checkout from './pages/checkout/Checkout';
import OrderSuccess from './pages/tracking/OrderSuccess';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
          {/* Simple Header */}
          <header className="p-4 bg-red-700 text-white shadow-md">
            <h1 className="text-xl font-bold">Meatshop Pickup</h1>
          </header>

          <main className="p-4 max-w-4xl mx-auto">
            <Routes>
              <Route path="/" element={<Catalog />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:orderNumber" element={<OrderSuccess />} />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;