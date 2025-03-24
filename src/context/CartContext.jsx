import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Update localStorage and cart count whenever cartItems changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Calculate cart count and total
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
    
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => 
        item.id === product.id && 
        (product.selectedVariant ? item.selectedVariant === product.selectedVariant : true)
      );

      if (existingItemIndex !== -1) {
        // Update quantity if product already exists in cart
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item to cart
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (id, variant = null) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item.id === id && (variant ? item.selectedVariant === variant : true))
      )
    );
  };

  // Update item quantity
  const updateQuantity = (id, quantity, variant = null) => {
    if (quantity <= 0) {
      removeFromCart(id, variant);
      return;
    }

    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === id && (variant ? item.selectedVariant === variant : true)) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext; 