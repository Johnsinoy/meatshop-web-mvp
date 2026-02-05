import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

// Import pages
import Catalog from './pages/catalog/catalog';
import Checkout from './pages/checkout/checkout';
import OrderSuccess from './pages/tracking/OrderSuccess'; // <--- Import added

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-10">
          <header className="p-4 bg-red-700 text-white shadow-md sticky top-0 z-50">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">Meatshop Pickup</h1>
                {/* Optional: Add a simple link to home if needed */}
            </div>
          </header>

          <main className="p-4 max-w-4xl mx-auto">
            <Routes>
              <Route path="/" element={<Catalog />} />
              <Route path="/checkout" element={<Checkout />} />
              {/* This route catches the ID passed from the checkout redirect */}
              <Route path="/order-success/:orderNumber" element={<OrderSuccess />} />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;