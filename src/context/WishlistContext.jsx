import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load wishlist from API on component mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // If no token, use empty wishlist
          setWishlist([]);
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/wishlist', {
          headers: {
            'x-auth-token': token
          }
        });

        if (response.data.success) {
          setWishlist(response.data.wishlist || []);
        } else {
          console.error('Error fetching wishlist:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        // Fallback to localStorage if API call fails
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const addToWishlist = async (item) => {
    // Check if item already exists in wishlist
    if (wishlist.some(wishlistItem => wishlistItem.id === item.id)) {
      return;
    }

    // Optimistically update UI
    setWishlist(prevWishlist => [...prevWishlist, item]);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token, save to localStorage
        localStorage.setItem('wishlist', JSON.stringify([...wishlist, item]));
        return;
      }

      await axios.post('http://localhost:5000/api/wishlist', 
        { productId: item.id }, 
        {
          headers: {
            'x-auth-token': token
          }
        }
      );
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      // Fallback to localStorage
      localStorage.setItem('wishlist', JSON.stringify([...wishlist, item]));
    }
  };

  const removeFromWishlist = async (itemId) => {
    // Optimistically update UI
    setWishlist(prevWishlist => prevWishlist.filter(item => item.id !== itemId));

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token, save to localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist.filter(item => item.id !== itemId)));
        return;
      }

      await axios.delete(`http://localhost:5000/api/wishlist/${itemId}`, {
        headers: {
          'x-auth-token': token
        }
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      // Fallback to localStorage
      localStorage.setItem('wishlist', JSON.stringify(wishlist.filter(item => item.id !== itemId)));
    }
  };

  const isInWishlist = (itemId) => {
    return wishlist.some(item => item.id === itemId);
  };

  const clearWishlist = async () => {
    // Optimistically update UI
    setWishlist([]);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // If no token, save to localStorage
        localStorage.setItem('wishlist', JSON.stringify([]));
        return;
      }

      await axios.delete('http://localhost:5000/api/wishlist', {
        headers: {
          'x-auth-token': token
        }
      });
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      // Fallback to localStorage
      localStorage.setItem('wishlist', JSON.stringify([]));
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      loading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}; 