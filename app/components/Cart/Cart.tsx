'use client';

import { useContext, useState } from 'react';
import { useCart } from '../../context/CartContext';
import '../../styles/Cart.css';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function Cart() {
  const { cartItems, removeFromCart, addToCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      // Encontrar el item actual
      const currentItem = cartItems.find((item) => item.id === id);
      if (currentItem) {
        removeFromCart(id, currentItem.quantity);
        addToCart({ ...currentItem, quantity: newQuantity });
      }
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    
    setIsCheckingOut(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout/nave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          total,
          orderId: `JB-${Date.now()}`
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        // Redireccionar al checkout de Nave
        window.location.href = data.url;
      } else {
        setError(data.message || 'Error al iniciar el pago con Nave');
        setIsCheckingOut(false);
      }
    } catch (err) {
      setError('Ocurrió un error inesperado al conectar con el servidor.');
      console.error(err);
      setIsCheckingOut(false);
    }
  };

  if (cartItems.length === 0) {
// ... (rest of the empty state JSX)
    return (
      <div className="cart-container">
        <h1>Mi carrito</h1>
        <div className="cart-empty">
          <p>Tu carrito está vacío</p>
          <a href="/" className="btn-continue">
            Ver más productos
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Mi carrito</h1>

      <div className="cart-layout">
        {/* Productos */}
        <div className="cart-items">
          {cartItems.map((item: CartItem) => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>

              <div className="item-details">
                <h3>{item.name}</h3>
              </div>

              <div className="item-quantity">
                <button
                  className="qty-btn"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  disabled={isCheckingOut}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                  className="qty-input"
                  disabled={isCheckingOut}
                />
                <button
                  className="qty-btn"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  disabled={isCheckingOut}
                >
                  +
                </button>
              </div>

              <div className="item-price">
                <div className="price-info">
                  <span className="unit-price">${item.price.toLocaleString('es-AR')}</span>
                  <span className="subtotal">${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                </div>
              </div>

              <button
                className="btn-remove"
                onClick={() => removeFromCart(item.id, item.quantity)}
                title="Eliminar producto"
                disabled={isCheckingOut}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="cart-summary">
          <h2>RESUMEN</h2>

          <div className="summary-content">
            <div className="summary-row">
              <span>{cartItems.length} producto{cartItems.length !== 1 ? 's' : ''}</span>
              <span>${total.toLocaleString('es-AR')}</span>
            </div>

            <div className="summary-note">
              <p>Si tenés un cupón, podrás ingresarlo en el último paso.</p>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span className="total-amount">${total.toLocaleString('es-AR')}</span>
            </div>

            <div className="payment-methods">
              <p>*Precio abonando con depósito o transferencia.</p>
            </div>

            {error && <p className="error-message text-red-500 text-sm mt-2">{error}</p>}

            <div className="cart-actions">
              <button 
                className={`btn-checkout ${isCheckingOut ? 'loading opacity-70 cursor-not-allowed' : ''}`}
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? 'Procesando...' : 'Iniciar compra'}
              </button>
              <a href="/" className="btn-continue">
                Ver más productos
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
