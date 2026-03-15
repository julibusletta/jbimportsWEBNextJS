'use client';

import { FaCreditCard, FaTruck, FaShieldAlt } from 'react-icons/fa';
import '../../styles/Benefits.css';

export default function Benefits() {
  return (
    <section id="benefits" className="benefits-section visible in-view">
      <div className="benefits-wrapper">
        <div className="benefits-container">
          {/* Benefit 1: Payment Plans */}
          <div className="benefit-item-wrapper">
            <div className="benefit-item">
              <div className="benefit-icon">
                <FaCreditCard size={32} />
              </div>
              <div className="benefit-text">
                <h2>Hasta 6 cuotas sin interés</h2>
                <p>abonando desde <strong>MODO</strong> con</p>
                <div className="payment-logos">
                  <span>ICBC</span>
                  <span className="divider"></span>
                  <span>Supervielle</span>
                  <span className="divider"></span>
                  <span>YOY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider 1 */}
          <div className="divider-wrapper">
            <div className="vertical-divider"></div>
          </div>

          {/* Benefit 2: Shipping */}
          <div className="benefit-item-wrapper">
            <div className="benefit-item">
              <div className="benefit-icon">
                <FaTruck size={32} />
              </div>
              <div className="benefit-text">
                <h2><strong>Envíos rápidos</strong> a todo el país.</h2>
              </div>
            </div>
          </div>

          {/* Divider 2 */}
          <div className="divider-wrapper">
            <div className="vertical-divider"></div>
          </div>

          {/* Benefit 3: Warranty */}
          <div className="benefit-item-wrapper">
            <div className="benefit-item">
              <div className="benefit-icon">
                <FaShieldAlt size={32} />
              </div>
              <div className="benefit-text">
                <h2>Garantía oficial</h2>
                <p>de hasta 36 meses en todos los productos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
