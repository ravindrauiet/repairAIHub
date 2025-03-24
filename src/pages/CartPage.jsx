import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  // Handle coupon application
  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'repair10') {
      setDiscount(cartTotal * 0.1);
    } else if (couponCode.toLowerCase() === 'welcome20') {
      setDiscount(cartTotal * 0.2);
    } else {
      alert('Invalid coupon code');
      setDiscount(0);
    }
  };

  // Handle checkout process
  const handleCheckout = () => {
    // In a real app, this would navigate to a checkout page
    // For now, we'll just show a success message and clear the cart
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    alert('Order placed successfully!');
    clearCart();
    navigate('/');
  };

  // Format price
  const formatPrice = (price) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="cart-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / <span>Shopping Cart</span>
        </div>

        <h1>Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <i className="fas fa-shopping-cart"></i>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any products to your cart yet.</p>
            <Link to="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <div className="cart-header">
                <span className="header-product">Product</span>
                <span className="header-price">Price</span>
                <span className="header-quantity">Quantity</span>
                <span className="header-total">Total</span>
                <span className="header-action"></span>
              </div>

              {cartItems.map((item) => (
                <div className="cart-item" key={`${item.id}-${item.selectedVariant || 'default'}`}>
                  <div className="item-product">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <h3>
                        <Link to={`/products/${item.id}`}>{item.name}</Link>
                      </h3>
                      {item.selectedVariant && (
                        <p className="item-variant">Variant: {item.selectedVariant}</p>
                      )}
                    </div>
                  </div>
                  <div className="item-price">{formatPrice(item.price)}</div>
                  <div className="item-quantity">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedVariant)}
                      className="qty-btn"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedVariant)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                  <div className="item-total">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                  <div className="item-action">
                    <button
                      onClick={() => removeFromCart(item.id, item.selectedVariant)}
                      className="remove-btn"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{cartTotal > 0 ? 'Free' : '₹0'}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatPrice(cartTotal - discount)}</span>
              </div>

              <div className="coupon-section">
                <h3>Apply Coupon</h3>
                <div className="coupon-form">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button onClick={applyCoupon}>Apply</button>
                </div>
                <p className="coupon-info">Try 'REPAIR10' or 'WELCOME20'</p>
              </div>

              <button onClick={handleCheckout} className="checkout-btn">
                Proceed to Checkout
              </button>
              <div className="continue-shopping">
                <Link to="/products">
                  <i className="fas fa-arrow-left"></i> Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage; 