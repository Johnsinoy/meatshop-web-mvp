import { createContext, useState, useContext, useMemo } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add an item to the cart
  const addToCart = (product, quantity = 1, notes = '') => {
    setCartItems((prevItems) => {
      // Check if item already exists in cart to update qty instead of duplicating
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + quantity }
            : item
        );
      }

      // Add new item. We store the full product object for UI display (name, unit),
      // but we will only send specific fields to the backend later.
      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price), // Ensure number format [cite: 62]
          unit: product.unit,               // 'kg' or 'pack' [cite: 62]
          qty: quantity,
          itemNotes: notes,
        },
      ];
    });
  };

  // Remove item
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  // Clear cart (used after successful order)
  const clearCart = () => setCartItems([]);

  // Calculate totals for UI Display
  // Note: Backend recalculates this for security, but UI needs it for display 
  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  }, [cartItems]);

  // Helper to format data for the Backend API 
  const getOrderPayload = (customerDetails) => {
    return {
      customerName: customerDetails.customerName,
      phone: customerDetails.phone,
      pickupTime: customerDetails.pickupTime,
      notes: customerDetails.notes,
      items: cartItems.map((item) => ({
        productId: item.id,
        qty: item.qty,
        unitPrice: item.price, // Backend requires unitPrice in payload 
        itemNotes: item.itemNotes || ""
      })),
    };
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        getOrderPayload,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};