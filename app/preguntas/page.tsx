'use client';

import React, { useState } from 'react';
import { FaChevronDown, FaChevronLeft } from 'react-icons/fa';
import Link from 'next/link';

interface AccordionItem {
  title: string;
  content: string;
  question?: string;
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData: AccordionItem[] = [
    {
      title: 'Realizar un pedido',
      question: '¿Cómo realizo un pedido?',
      content: '¡Comprar en nuestra web es muy fácil! Primero, sumá al carrito todos los productos que querés. Luego, elegí si preferís envío a domicilio o retirarlo en un punto de entrega. Indicá si necesitás factura A o factura B. Después, seleccioná el medio de pago que más te convenga. Revisá todos los detalles y confirmá tu compra. ¡Listo, ya tenés tu pedido realizado! Te enviamos toda la info y número de pedido al mail que tengas registrado en tu cuenta.'
    },
    {
      title: 'Precio',
      question: '¿El precio que figura en la web es el precio final?',
      content: 'Todos los precios en la web incluyen el IVA, y se encuentran expresados en pesos argentinos.'
    },
    {
      title: 'Formas de pago',
      question: '¿Cuáles son las formas de pago?',
      content: 'Contás con varias opciones para abonar tu pedido: Podés elegir entre depósito o transferencia bancaria (abonando el precio especial), tarjetas de crédito (en hasta 18 cuotas fijas) o billeteras virtuales, como Mercado Pago y MODO (con QR y hasta 2 tarjetas de crédito en simultáneo).'
    },
    {
      title: 'Códigos de descuento',
      question: '¿Cómo puedo aplicar un código de descuento en mi compra?',
      content: 'Si tenés un código de descuento, deberás agregar todos los productos que desees a tu carrito y completar los pasos de Envíos, Facturación y Forma de Pago. Al momento de la revisión, verás un campo de "¿Tenés un código de descuento?", seleccionalo e ingresá tu código. Una vez aplicado, verás los descuentos aplicados y ya podés confirmar tu compra ¡Importante! Sólo se permite un código por compra.'
    },
    {
      title: 'Mercado Pago',
      question: '¿Cómo puedo abonar a través de Mercado Pago?',
      content: 'Para pagar con Mercado Pago, al momento de elegir la forma de pago en el carrito, elegí “Billetera virtual” y seleccioná "Mercado Pago". Luego, vas a poder seleccionar la cantidad de cuotas. Confirmá tu reserva y vas a ver el link para pagar desde la App. Seguí las instrucciones y ¡listo! Con Mercado Pago podés abonar con hasta 2 tarjetas o con dinero en cuenta de Mercado Pago.'
    },
    {
      title: 'MODO',
      question: '¿Cómo puedo abonar a través de MODO?',
      content: 'Para pagar con MODO, al momento de elegir la forma de pago en el carrito, elegí “Billetera virtual” y seleccioná MODO. Confirmá tu pedido y continuá: si estás desde una PC, en la pantalla de confirmación —o desde Mi Cuenta > Mis pedidos— hacé clic en “Pagar con MODO” para generar el QR y escanearlo con tu app; si estás en el celular, ese botón abrirá tu app MODO para completar el pago.'
    },
    {
      title: 'Depósito - Transferencia bancaria',
      question: '¿Cómo abono a través de depósito/transferencia?',
      content: 'Una vez que realizás tu pedido, te enviamos los datos bancarios para hacer el depósito o la transferencia. Para informar el pago, ingresá a tu perfil, buscá el pedido y hacé clic en “Cargar comprobante”. Subí el comprobante (el archivo debe ser en formato JPG, PDF o BMP). Seleccioná el tipo de comprobante (si es depósito, transferencia o retención) e indicá el monto, el DNI o CUIT del titular del pago y el número de comprobante.'
    },
    {
      title: 'Tarjetas de crédito',
      question: '¿Cómo abonar con tarjeta de crédito?',
      content: 'En el paso de "Forma de pago" en el carrito, deberás seleccionar la opción "Tarjeta de crédito" y completar con los datos de tu tarjeta. Luego, deberás seleccionar la cantidad de cuotas e indicar los datos del titular de la tarjeta. Podés pagar tu pedido con tarjetas de crédito en hasta 24 cuotas fijas.'
    },
    {
      title: 'Facturación',
      question: '¿Cómo tramito la factura de mi compra?',
      content: 'En todas las compras efectuadas en la web, brindamos sin excepción alguna, la factura de compra. Una vez que realiza y abona el pedido, enviamos a tu dirección de correo electrónico la factura correspondiente. Por supuesto, también podés descargarla desde la sección Mi cuenta < Mis facturas. En caso de que precises factura A, solo debes ingresar tu CUIT al cargar el pedido.'
    },
    {
      title: 'Garantías',
      question: '¿Cómo utilizo el servicio de PosVenta y garantías?',
      content: 'Para realizar consultas/reclamos relacionadas con la garantía o devolución de alguna de tus compras, contamos con canales oficiales donde debes exponer tu caso y uno de nuestros representantes te ofrecerá la información correspondiente sobre cómo proceder.'
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-16 px-4 md:px-0 flex flex-col items-center">
      <div className="w-full max-w-6xl px-4 md:px-10">
        
        {/* CompraGamer Style Header */}
        <section className="flex items-center gap-6 py-4 mb-8">
          <Link 
            href="/" 
            className="flex items-center justify-center w-12 h-12 bg-white rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all no-underline shadow-sm"
          >
            <FaChevronLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-slate-800 m-0">Preguntas Frecuentes</h1>
        </section>

        {/* Categories Grid (Material Design inspired expansion list) */}
        <div className="space-y-4 mb-16">
          {faqData.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-white border border-slate-200 rounded-sm transition-all duration-300 ${openIndex === index ? 'shadow-md ring-1 ring-blue-100 mb-6' : 'hover:bg-slate-50'}`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left bg-transparent border-0 cursor-pointer group"
                aria-expanded={openIndex === index}
              >
                <div className="flex flex-col">
                  <h3 className={`text-lg md:text-xl font-semibold m-0 transition-colors ${openIndex === index ? 'text-blue-600' : 'text-slate-700'}`}>
                    {faq.title}
                  </h3>
                </div>
                <span className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${openIndex === index ? 'rotate-180 bg-blue-50 text-blue-600' : 'text-slate-300 group-hover:text-slate-500'}`}>
                  <FaChevronDown size={14} />
                </span>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
              >
                <div className="px-8 pb-10 pt-4 border-t border-slate-100">
                  <p className="text-slate-900 font-bold text-lg mb-5">{faq.question}</p>
                  <p className="text-slate-600 text-base leading-relaxed mb-0">
                    {faq.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Information Cards Section */}
        <div className="space-y-8">
          <div className="bg-white p-10 md:p-14 border border-slate-200 shadow-sm rounded-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Servicio postventa y garantías</h2>
            <div className="space-y-6 text-slate-600 text-base md:text-lg leading-relaxed">
              <p>
                Para realizar consultas o reclamos relacionadas con la garantía o devolución de alguna de tus compras, contamos con canales directos en el apartado de Ayuda donde podés exponer tu caso.
              </p>
              <p>
                Podes gestionar tu garantía de forma presencial o directamente con la marca una vez transcurridos los 30 días de la compra. Consultá nuestros términos para más detalles.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-5 justify-center mt-12 pt-10 border-t border-slate-100">
              <Link 
                href="/contacto" 
                className="w-full md:w-auto px-10 py-5 bg-blue-600 text-white font-bold uppercase text-xs tracking-widest rounded-sm text-center no-underline hover:bg-slate-900 transition-all shadow-lg shadow-blue-50"
              >
                Sacar turno presencial
              </Link>
              <Link 
                href="/contacto" 
                className="w-full md:w-auto px-10 py-5 border border-slate-300 text-slate-700 font-bold uppercase text-xs tracking-widest rounded-sm text-center no-underline hover:bg-slate-50 transition-all"
              >
                Gestionar con la marca
              </Link>
            </div>
          </div>
        </div>

        {/* Simple Professional Footer Note */}
        <div className="mt-24 py-12 text-center border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-4">JB Imports</p>
          <p className="text-[12px] text-slate-300 uppercase tracking-widest">
            Calidad y confianza en cada compra
          </p>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        body { 
          font-family: 'Inter', sans-serif; 
          background-color: #f8f9fa;
        }
      `}</style>
    </div>
  );
}
