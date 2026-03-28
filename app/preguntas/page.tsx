'use client';

import React, { useState } from 'react';
import { FaChevronDown, FaChevronLeft, FaShieldAlt } from 'react-icons/fa';
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
      content: 'Para realizar consultas/reclamos relacionadas con la garantía o devolución de alguna de tus compras, al final de esta sección contamos con el apartado de contacto donde debes exponer tu caso y uno de nuestros representantes te ofrecerá la información correspondiente sobre cómo proceder.'
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        {/* Navigation / Return */}
        <div className="mb-10 flex items-center gap-4">
          <Link 
            href="/" 
            className="flex items-center justify-center w-10 h-10 bg-slate-50 text-slate-900 border border-slate-100 transition-colors hover:bg-slate-900 hover:text-white"
          >
            <FaChevronLeft size={16} />
          </Link>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight m-0">Preguntas Frecuentes</h1>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 mb-20">
          {faqData.map((faq, index) => (
            <div key={index} className="border border-slate-100 bg-white shadow-sm overflow-hidden transition-all">
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left bg-transparent border-0 cursor-pointer group hover:bg-slate-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <h3 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-tight m-0 group-hover:text-blue-600 transition-colors">
                  {faq.title}
                </h3>
                <FaChevronDown 
                  size={14} 
                  className={`text-slate-300 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-blue-600' : ''}`} 
                />
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
              >
                <div className="p-8 md:p-10 border-t border-slate-50 bg-slate-50/30">
                  <p className="text-slate-900 font-bold mb-4">{faq.question}</p>
                  <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-0">
                    {faq.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Post-Sale & Warranty Information Card */}
        <section className="p-10 md:p-16 bg-slate-900 text-white flex flex-col items-center text-center">
          <FaShieldAlt className="text-blue-400 mb-8" size={48} />
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight mb-6">Servicio Postventa y Garantías</h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mb-10">
            Para realizar consultas o reclamos relacionados con la garantía o devolución de alguna de tus compras, 
            podés contactarnos a través de nuestros canales oficiales. Uno de nuestros representantes te ofrecerá la 
            información correspondiente sobre cómo proceder. 
          </p>
          <div className="flex flex-col md:flex-row gap-6">
            <Link 
              href="/contacto" 
              className="px-10 py-5 bg-blue-600 text-white font-black uppercase text-[10px] tracking-[0.3em] no-underline hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-blue-500/20"
            >
              Contactar Soporte
            </Link>
            <Link 
              href="/terminos" 
              className="px-10 py-5 border border-white text-white font-black uppercase text-[10px] tracking-[0.3em] no-underline hover:bg-white hover:text-slate-900 transition-all"
            >
              Ver Términos y Condiciones
            </Link>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}
