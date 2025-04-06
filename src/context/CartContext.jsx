import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load cart from API on initial render
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // If no token, try to load from localStorage
          const storedCart = localStorage.getItem('cart');
          if (storedCart) {
            setCartItems(JSON.parse(storedCart));
          }
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/cart', {
          headers: {
            'x-auth-token': token
          }
        });

        if (response.data.success) {
          setCartItems(response.data.cart.items || []);
        } else {
          console.error('Error fetching cart:', response.data.message);
          // Fallback to localStorage
          const storedCart = localStorage.getItem('cart');
          if (storedCart) {
            setCartItems(JSON.parse(storedCart));
          }
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        // Fallback to localStorage
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Update cart count and total whenever cartItems changes
  useEffect(() => {
    // Calculate cart count and total
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
    
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
    
    // Update localStorage as a fallback
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    // Optimistically update UI
    const existingItemIndex = cartItems.findIndex(item => 
      item.id === product.id && 
      (product.selectedVariant ? item.selectedVariant === product.selectedVariant : true)
    );

    let newCartItems;
    if (existingItemIndex !== -1) {
      // Update quantity if product already exists in cart
      newCartItems = [...cartItems];
      newCartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      newCartItems = [...cartItems, { ...product, quantity }];
    }
    
    setCartItems(newCartItems);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token, just use localStorage (already updated above)
        return;
      }

      await axios.post('http://localhost:5000/api/cart', {
        productId: product.id,
        quantity,
        variant: product.selectedVariant || null
      }, {
        headers: {
          'x-auth-token': token
        }
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Already updated localStorage as fallback
    }
  };

  // Remove item from cart
  const removeFromCart = async (id, variant = null) => {
    // Optimistically update UI
    const newCartItems = cartItems.filter(item => 
      !(item.id === id && (variant ? item.selectedVariant === variant : true))
    );
    
    setCartItems(newCartItems);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token, just use localStorage (already updated above)
        return;
      }

      await axios.delete(`http://localhost:5000/api/cart/${id}`, {
        headers: {
          'x-auth-token': token
        },
        data: { variant }
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      // Already updated localStorage as fallback
    }
  };

  // Update item quantity
  const updateQuantity = async (id, quantity, variant = null) => {
    if (quantity <= 0) {
      removeFromCart(id, variant);
      return;
    }

    // Optimistically update UI
    const newCartItems = cartItems.map(item => {
      if (item.id === id && (variant ? item.selectedVariant === variant : true)) {
        return { ...item, quantity };
      }
      return item;
    });
    
    setCartItems(newCartItems);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token, just use localStorage (already updated above)
        return;
      }

      await axios.put(`http://localhost:5000/api/cart/${id}`, {
        quantity,
        variant
      }, {
        headers: {
          'x-auth-token': token
        }
      });
    } catch (error) {
      console.error('Error updating cart:', error);
      // Already updated localStorage as fallback
    }
  };

  // Clear cart
  const clearCart = async () => {
    // Optimistically update UI
    setCartItems([]);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token, just use localStorage (already updated above)
        localStorage.removeItem('cart');
        return;
      }

      await axios.delete('http://localhost:5000/api/cart', {
        headers: {
          'x-auth-token': token
        }
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      // Already cleared localStorage as fallback
      localStorage.removeItem('cart');
    }
  };

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    loading,
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