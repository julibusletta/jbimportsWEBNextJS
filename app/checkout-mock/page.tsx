'use client';

import { useEffect, useState } from 'react';
import { FaLock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import Link from 'next/link';

export default function CheckoutMock() {
  const [status, setStatus] = useState<'loading' | 'payment'>('loading');

  useEffect(() => {
    const timer = setTimeout(() => setStatus('payment'), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f4f7f9', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'flex-start',
      paddingTop: '180px',
      fontFamily: 'sans-serif',
      paddingLeft: '20px',
      paddingRight: '20px',
      paddingBottom: '40px'
    }}>
      <div style={{ 
        maxWidth: '500px', 
        width: '100%', 
        background: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
        overflow: 'hidden'
      }}>
        {/* Header Nave Style */}
        <div style={{ background: '#000', padding: '20px', textAlign: 'center' }}>
          <img src="/images/nave.jfif" alt="Nave" style={{ height: '30px', filter: 'brightness(0) invert(1)' }} />
          <div style={{ color: 'white', fontSize: '12px', marginTop: '5px', opacity: 0.7 }}>
            <FaLock style={{ marginRight: '5px' }} /> Pago Seguro con Nave
          </div>
        </div>

        <div style={{ padding: '30px', textAlign: 'center' }}>
          {status === 'loading' ? (
            <div>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '3px solid #f3f3f3', 
                borderTop: '3px solid #000', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
              }}></div>
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              `}} />
              <h2 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Conectando con Nave...</h2>
              <p style={{ color: '#666' }}>Estamos preparando tu entorno de pago seguro.</p>
            </div>
          ) : (
            <div className="animate-fadeInUp">
              <div style={{ background: '#fff9c4', padding: '15px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #fbc02d' }}>
                <FaExclamationTriangle style={{ color: '#fbc02d', fontSize: '24px', marginBottom: '10px' }} />
                <h3 style={{ fontSize: '1rem', color: '#856404' }}>MODO SIMULACIÓN</h3>
                <p style={{ fontSize: '0.85rem', color: '#856404' }}>
                  Este es un entorno de prueba creado por Antigravity para JBimports. 
                  Una vez que integres tus llaves reales, aquí aparecerá la pasarela oficial de Banco Galicia.
                </p>
              </div>

              <div style={{ textAlign: 'left', marginBottom: '25px', padding: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '5px' }}>Comercio: JBimports</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total a pagar: $---.---</p>
              </div>

              <button 
                onClick={() => window.location.href = '/'}
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  background: '#000', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '6px', 
                  fontSize: '1rem', 
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginBottom: '10px'
                }}
              >
                Simular Pago Aprobado
              </button>
              
              <Link href="/" style={{ color: '#666', fontSize: '0.9rem', textDecoration: 'none' }}>
                Volver al sitio
              </Link>
            </div>
          )}
        </div>

        <div style={{ background: '#fafafa', padding: '15px', textAlign: 'center', fontSize: '0.75rem', color: '#999', borderTop: '1px solid #eee' }}>
          Powered by Nave & Antigravity AI
        </div>
      </div>
    </div>
  );
}
